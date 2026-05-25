import { supabase } from './supabase';
import { uploadImage, PRESETS } from './cloudinary';

async function setUid(uid) {
  await supabase.rpc('set_firebase_uid', { uid });
}

/** Fetch complete profile by username. */
export async function getProfile(username) {
  const { data, error } = await supabase
    .rpc('get_profile', { p_username: username });
  if (error) {
    console.error('[ArcHive Profile] getProfile:', error);
    return { data: null, error: 'Profile not found.' };
  }
  return { data, error: null };
}

/** Check if firebaseUid follows targetUsername. */
export async function isFollowing(firebaseUid, targetUsername) {
  const { data, error } = await supabase.rpc('is_following', {
    p_follower_uid:       firebaseUid,
    p_following_username: targetUsername,
  });
  if (error) return { data: false, error };
  return { data: !!data, error: null };
}

/** Follow a user. Creates activity + notification. */
export async function followUser(firebaseUid, targetUsername) {
  const { data, error } = await supabase.rpc('follow_user', {
    p_follower_uid:       firebaseUid,
    p_following_username: targetUsername,
  });
  if (error || data?.error) {
    console.error('[ArcHive Profile] followUser:', error || data.error);
    return { error: 'Could not follow user.' };
  }
  return { error: null };
}

/** Unfollow a user. */
export async function unfollowUser(firebaseUid, targetUsername) {
  const { data, error } = await supabase.rpc('unfollow_user', {
    p_follower_uid:       firebaseUid,
    p_following_username: targetUsername,
  });
  if (error || data?.error) {
    console.error('[ArcHive Profile] unfollowUser:', error || data.error);
    return { error: 'Could not unfollow user.' };
  }
  return { error: null };
}

/** Get followers list for a user ID. */
export async function getFollowers(userId) {
  const { data, error } = await supabase
    .from('follows')
    .select(`
      follower:users!follower_id (
        id, username, display_name,
        avatar_url, title, is_verified
      )
    `)
    .eq('following_id', userId)
    .order('created_at', { ascending: false });

  if (error) return { data: [], error };
  return { data: data.map(r => r.follower), error: null };
}

/** Get following list for a user ID. */
export async function getFollowing(userId) {
  const { data, error } = await supabase
    .from('follows')
    .select(`
      following:users!following_id (
        id, username, display_name,
        avatar_url, title, is_verified
      )
    `)
    .eq('follower_id', userId)
    .order('created_at', { ascending: false });

  if (error) return { data: [], error };
  return { data: data.map(r => r.following), error: null };
}

/** Get mutual follows (connections) for a user ID. */
export async function getConnections(userId) {
  const [{ data: followers }, { data: following }] = await Promise.all([
    getFollowers(userId),
    getFollowing(userId),
  ]);

  if (!followers || !following) return { data: [], error: null };

  const followerIds  = new Set(followers.map(u => u.id));
  const connections  = following.filter(u => followerIds.has(u.id));
  return { data: connections, error: null };
}

/** Update profile fields (partial update). */
export async function updateProfile(firebaseUid, updates) {
  try {
    await setUid(firebaseUid);
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('firebase_uid', firebaseUid)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('[ArcHive Profile] updateProfile:', err);
    return { data: null, error: 'Failed to save changes.' };
  }
}

/** Upload new avatar and save URL. */
export async function updateAvatar(firebaseUid, file, onProgress) {
  const { url, error: uploadErr } = await uploadImage(
    file, PRESETS.AVATAR, onProgress
  );
  if (uploadErr) return { data: null, error: uploadErr };
  return updateProfile(firebaseUid, { avatar_url: url });
}

/** Upload new banner and save URL. */
export async function updateBanner(firebaseUid, file, onProgress) {
  const { url, error: uploadErr } = await uploadImage(
    file, PRESETS.BANNER, onProgress
  );
  if (uploadErr) return { data: null, error: uploadErr };
  return updateProfile(firebaseUid, { banner_url: url });
}

/** Replace all specializations for a user. */
export async function updateSpecializations(firebaseUid, tags) {
  await setUid(firebaseUid);
  const { data: user } = await supabase
    .from('users').select('id')
    .eq('firebase_uid', firebaseUid).single();
  if (!user) return { error: 'User not found.' };

  await supabase.from('user_specializations')
    .delete().eq('user_id', user.id);

  if (tags.length) {
    await supabase.from('user_specializations').insert(
      tags.map(tag => ({ user_id: user.id, tag }))
    );
  }
  return { error: null };
}

/** Replace all tools for a user. */
export async function updateTools(firebaseUid, tools) {
  await setUid(firebaseUid);
  const { data: user } = await supabase
    .from('users').select('id')
    .eq('firebase_uid', firebaseUid).single();
  if (!user) return { error: 'User not found.' };

  await supabase.from('user_tools')
    .delete().eq('user_id', user.id);

  if (tools.length) {
    await supabase.from('user_tools').insert(
      tools.map(tool => ({ user_id: user.id, tool }))
    );
  }
  return { error: null };
}

/** Update privacy or notification settings. */
export async function updateSettings(firebaseUid, settings) {
  return updateProfile(firebaseUid, settings);
}

/** Get activity feed for a user. */
export async function getActivity(userId, limit = 10, offset = 0) {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return { data: [], error };
  return { data: data || [], error: null };
}
