import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  updateProfile as fbUpdateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  getAuth,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { supabase } from './supabase';

function mapError(code) {
  const m = {
    'auth/user-not-found':          'No account with this email.',
    'auth/wrong-password':          'Incorrect password.',
    'auth/email-already-in-use':    'This email is already registered.',
    'auth/weak-password':           'Password needs at least 8 characters.',
    'auth/invalid-email':           'Enter a valid email address.',
    'auth/too-many-requests':       'Too many attempts. Try again later.',
    'auth/network-request-failed':  'Connection failed.',
    'auth/requires-recent-login':   'REQUIRES_RECENT_LOGIN',
    'auth/popup-closed-by-user':    null,
    'auth/cancelled-popup-request': null,
  };
  return code in m ? m[code] : 'Something went wrong.';
}

function generateUUID() {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function setSupabaseUid(uid) {
  await supabase.rpc('set_firebase_uid', { uid });
}

// ─── syncUser ────────────────────────────────────
// Called after every login.
// Ensures a row exists in public.users.
// Returns { isNew: boolean }

export async function syncUser(firebaseUser) {
  if (!firebaseUser?.uid) return { isNew: false };

  await setSupabaseUid(firebaseUser.uid);

  const { data: existing } = await supabase
    .from('users')
    .select('id, username')
    .eq('firebase_uid', firebaseUser.uid)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('users')
      .update({ last_active: new Date().toISOString() })
      .eq('firebase_uid', firebaseUser.uid);
    return { isNew: false };
  }

  // Build a safe username from email
  const base = (firebaseUser.email || '')
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '') || 'user';

  let username = base;
  let attempt  = 0;
  while (true) {
    const { data: conflict } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .maybeSingle();
    if (!conflict) break;
    attempt++;
    username = base + attempt;
  }

  const { error } = await supabase.from('users').insert({
    id:            generateUUID(),
    firebase_uid:  firebaseUser.uid,
    username,
    display_name:  firebaseUser.displayName
                     || base,
    email:         firebaseUser.email,
    avatar_url:    firebaseUser.photoURL || null,
  });

  if (error) console.error('[auth] syncUser insert:', error);
  return { isNew: true };
}

// ─── createFullProfile ───────────────────────────
// Called at end of signup wizard step 3.
// Upserts ALL profile fields into Supabase.

export async function createFullProfile(firebaseUser, data) {
  if (!firebaseUser?.uid) {
    return { error: 'Not authenticated.' };
  }

  await setSupabaseUid(firebaseUser.uid);

  // Resolve unique username
  let username = (data.username || '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '');

  const { data: conflict } = await supabase
    .from('users')
    .select('id, firebase_uid')
    .eq('username', username)
    .maybeSingle();

  if (conflict && conflict.firebase_uid !== firebaseUser.uid) {
    username = username + Math.floor(1000 + Math.random() * 9000);
  }

  // Check if profile already exists in Supabase
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('firebase_uid', firebaseUser.uid)
    .maybeSingle();

  let saved;
  let saveErr;

  const payload = {
    username:         username,
    display_name:     data.displayName || '',
    email:            firebaseUser.email,
    avatar_url:       firebaseUser.photoURL || null,
    title:            data.title            || null,
    organization:     data.organization     || null,
    location_city:    data.locationCity     || null,
    location_country: data.locationCountry  || null,
    years_exp:        data.yearsExp          || null,
    website_url:      data.websiteUrl        || null,
    account_type:     data.accountType       || 'individual',
    updated_at:       new Date().toISOString(),
  };

  if (existing) {
    // Update existing row
    const { data: updated, error: updateErr } = await supabase
      .from('users')
      .update(payload)
      .eq('firebase_uid', firebaseUser.uid)
      .select()
      .single();
    saved = updated;
    saveErr = updateErr;
  } else {
    // Insert new row
    const newId = generateUUID();
    const { data: inserted, error: insertErr } = await supabase
      .from('users')
      .insert({
        id: newId,
        firebase_uid: firebaseUser.uid,
        ...payload
      })
      .select()
      .single();
    saved = inserted;
    saveErr = insertErr;
  }

  if (saveErr) {
    console.error('[auth] createFullProfile save:', saveErr);
    return { error: 'Failed to save profile.' };
  }

  const userId = saved.id;

  // Replace interests
  await supabase
    .from('user_interests')
    .delete()
    .eq('user_id', userId);

  if (data.interests?.length) {
    await supabase.from('user_interests').insert(
      data.interests.map(interest =>
        ({ user_id: userId, interest })
      )
    );
  }

  // Replace specializations (interests)
  await supabase
    .from('user_specializations')
    .delete()
    .eq('user_id', userId);

  if (data.interests?.length) {
    await supabase.from('user_specializations').insert(
      data.interests.map(tag =>
        ({ user_id: userId, tag })
      )
    );
  }

  // Replace tools
  await supabase
    .from('user_tools')
    .delete()
    .eq('user_id', userId);

  if (data.tools?.length) {
    await supabase.from('user_tools').insert(
      data.tools.map(tool =>
        ({ user_id: userId, tool })
      )
    );
  }

  // Update Firebase display name
  try {
    await fbUpdateProfile(firebaseUser, {
      displayName: data.displayName,
    });
  } catch (e) {
    console.warn('[auth] Firebase displayName update:', e);
  }

  return { data: saved, error: null };
}

// ─── updateProfileFields ─────────────────────────
// Called from profile settings save.

export async function updateProfileFields(
  firebaseUser, fields
) {
  if (!firebaseUser?.uid) return { error: 'Not authenticated.' };

  await setSupabaseUid(firebaseUser.uid);

  const allowed = [
    'display_name', 'username', 'bio', 'title',
    'organization', 'location_city', 'location_country',
    'website_url', 'linkedin_url', 'twitter_url',
    'education', 'years_exp', 'account_type',
    'show_email', 'allow_messages', 'show_activity',
    'show_saves', 'allow_indexing',
    'notify_follows', 'notify_upvotes',
    'notify_comments', 'notify_digest',
  ];

  const clean = {};
  for (const key of allowed) {
    if (key in fields) clean[key] = fields[key];
  }
  clean.updated_at = new Date().toISOString();

  // If changing username, check availability
  if (clean.username) {
    clean.username = clean.username
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '');

    const { data: conflict } = await supabase
      .from('users')
      .select('id, firebase_uid')
      .eq('username', clean.username)
      .maybeSingle();

    if (conflict &&
        conflict.firebase_uid !== firebaseUser.uid) {
      return { error: 'Username already taken.' };
    }
  }

  // If changing display name, update Firebase too
  if (clean.display_name) {
    try {
      await fbUpdateProfile(firebaseUser, {
        displayName: clean.display_name,
      });
    } catch (e) {
      console.warn('[auth] Firebase name update:', e);
    }
  }

  const { data, error } = await supabase
    .from('users')
    .update(clean)
    .eq('firebase_uid', firebaseUser.uid)
    .select()
    .single();

  if (error) {
    console.error('[auth] updateProfileFields:', error);
    return { error: 'Failed to save. Try again.' };
  }

  return { data, error: null };
}

// ─── updateSpecializations / updateTools ─────────

export async function updateSpecializations(
  firebaseUser, tags
) {
  await setSupabaseUid(firebaseUser.uid);

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('firebase_uid', firebaseUser.uid)
    .single();

  if (!user) return { error: 'User not found.' };

  await supabase
    .from('user_specializations')
    .delete()
    .eq('user_id', user.id);

  if (tags.length) {
    await supabase.from('user_specializations').insert(
      tags.map(tag => ({ user_id: user.id, tag }))
    );
  }

  return { error: null };
}

export async function updateTools(firebaseUser, tools) {
  await setSupabaseUid(firebaseUser.uid);

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('firebase_uid', firebaseUser.uid)
    .single();

  if (!user) return { error: 'User not found.' };

  await supabase
    .from('user_tools')
    .delete()
    .eq('user_id', user.id);

  if (tools.length) {
    await supabase.from('user_tools').insert(
      tools.map(tool => ({ user_id: user.id, tool }))
    );
  }

  return { error: null };
}

// ─── checkUsername ───────────────────────────────

export async function checkUsername(username) {
  if (!username || username.length < 3) return false;
  const clean = username.toLowerCase()
    .replace(/[^a-z0-9_-]/g, '');
  if (clean.length < 3) return false;

  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('username', clean)
    .maybeSingle();

  return !data;
}

// ─── Standard auth ───────────────────────────────

export async function signInEmail(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(
      auth, email, password
    );
    await syncUser(cred.user);
    return { user: cred.user, error: null };
  } catch (e) {
    console.error('[auth] signInEmail:', e.code);
    return { user: null, error: mapError(e.code) };
  }
}

export async function signInGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const { isNew } = await syncUser(result.user);
    return { user: result.user, isNew, error: null };
  } catch (e) {
    console.error('[auth] signInGoogle:', e.code);
    const msg = mapError(e.code);
    return { user: null, isNew: false, error: msg };
  }
}

export async function signUpEmail(email, password) {
  try {
    const cred = await createUserWithEmailAndPassword(
      auth, email, password
    );
    return { user: cred.user, error: null };
  } catch (e) {
    console.error('[auth] signUpEmail:', e.code);
    return { user: null, error: mapError(e.code) };
  }
}

export async function signOut() {
  try {
    await fbSignOut(auth);
    return { error: null };
  } catch (e) {
    return { error: 'Sign out failed.' };
  }
}

export async function changePassword(fbUser, cur, next) {
  try {
    const cred = EmailAuthProvider.credential(
      fbUser.email, cur
    );
    await reauthenticateWithCredential(fbUser, cred);
    await updatePassword(fbUser, next);
    return { error: null };
  } catch (e) {
    return { error: mapError(e.code) };
  }
}

// ─── deleteAccount ───────────────────────────────
// Deletes from BOTH Supabase AND Firebase.

export async function deleteAccount(firebaseUser) {
  if (!firebaseUser) return { error: 'Not authenticated.' };

  try {
    // 1. Set Supabase UID first, so the database session is authenticated
    await setSupabaseUid(firebaseUser.uid);

    // 2. Delete from Firebase Auth first
    // This requires a recent login. If it fails, we catch it and abort BEFORE Supabase row is deleted.
    const currentUser = getAuth().currentUser;
    if (currentUser) {
      await deleteUser(currentUser);
    }

    // 3. Delete from Supabase now that Firebase deletion succeeded
    const { error: dbErr } = await supabase
      .from('users')
      .delete()
      .eq('firebase_uid', firebaseUser.uid);

    if (dbErr) {
      console.error('[auth] deleteAccount DB:', dbErr);
      return { error: 'Firebase account deleted, but database cleanup failed.' };
    }

    return { error: null };
  } catch (e) {
    console.error('[auth] deleteAccount Firebase:', e.code || e);
    if (e.code === 'auth/requires-recent-login') {
      return { error: 'REQUIRES_RECENT_LOGIN' };
    }
    return { error: e.message || 'Delete failed. Please try again.' };
  }
}

export async function reauthenticate(firebaseUser, password) {
  try {
    const cred = EmailAuthProvider.credential(
      firebaseUser.email, password
    );
    await reauthenticateWithCredential(firebaseUser, cred);
    return { error: null };
  } catch (e) {
    return { error: mapError(e.code) };
  }
}
