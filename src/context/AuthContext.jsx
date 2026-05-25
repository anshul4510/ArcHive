import React, {
  createContext, useContext, useState,
  useEffect, useCallback, useRef
} from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth }     from '../lib/firebase';
import { supabase } from '../lib/supabase';
import {
  signInEmail, signInGoogle as googleSignIn,
  signUpEmail, signOut, checkUsername,
  createFullProfile, updateProfileFields,
  updateSpecializations, updateTools,
  changePassword, deleteAccount, reauthenticate,
  setSupabaseUid,
} from '../lib/auth';

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser,   setFirebaseUser]   = useState(undefined);
  // undefined = not yet checked, null = signed out
  const [supabaseUser,   setSupabaseUser]   = useState(null);
  const [followerCount,  setFollowerCount]  = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const fetchingRef = useRef(false);

  const loading = firebaseUser === undefined;

  // ── Fetch Supabase profile by Firebase UID ──────
  const fetchProfile = useCallback(async (uid) => {
    if (fetchingRef.current) return null;
    fetchingRef.current = true;

    try {
      await setSupabaseUid(uid);

      const { data, error } = await supabase
        .from('users')
        .select(`
          id, firebase_uid, username, display_name,
          email, avatar_url, banner_url, bio, title,
          organization, location_city, location_country,
          website_url, linkedin_url, twitter_url,
          education, years_exp, account_type,
          is_verified, is_pro, member_since,
          last_active, show_email, allow_messages,
          show_activity, show_saves, allow_indexing,
          notify_follows, notify_upvotes,
          notify_comments, notify_digest,
          created_at, updated_at,
          user_specializations ( tag ),
          user_tools           ( tool ),
          user_interests       ( interest )
        `)
        .eq('firebase_uid', uid)
        .maybeSingle();

      if (error) {
        console.error('[AuthContext] fetchProfile error:', error);
        return null;
      }

      if (!data) {
        console.warn('[AuthContext] No profile found for uid:', uid);
        return null;
      }

      // Fetch counts
      const { data: stats } = await supabase
        .from('user_stats')
        .select('follower_count, following_count')
        .eq('id', data.id)
        .maybeSingle();

      setFollowerCount(stats?.follower_count  ?? 0);
      setFollowingCount(stats?.following_count ?? 0);

      return data;
    } catch (e) {
      console.error('[AuthContext] fetchProfile exception:', e);
      return null;
    } finally {
      fetchingRef.current = false;
    }
  }, []);

  // ── Auth state listener ──────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser ?? null);

      if (fbUser) {
        const profile = await fetchProfile(fbUser.uid);
        setSupabaseUser(profile);
      } else {
        setSupabaseUser(null);
        setFollowerCount(0);
        setFollowingCount(0);
      }
    });
    return unsub;
  }, [fetchProfile]);

  // ── refreshProfile ───────────────────────────────
  const refreshProfile = useCallback(async () => {
    if (!firebaseUser?.uid) return;
    const p = await fetchProfile(firebaseUser.uid);
    if (p) setSupabaseUser(p);
  }, [firebaseUser, fetchProfile]);

  // ── Wrappers that refresh after writes ───────────
  const wrappedUpdateFields = useCallback(
    async (fields) => {
      const result = await updateProfileFields(
        firebaseUser, fields
      );
      if (!result.error) await refreshProfile();
      return result;
    },
    [firebaseUser, refreshProfile]
  );

  const wrappedUpdateSpecs = useCallback(
    async (tags) => {
      const result = await updateSpecializations(
        firebaseUser, tags
      );
      if (!result.error) await refreshProfile();
      return result;
    },
    [firebaseUser, refreshProfile]
  );

  const wrappedUpdateTools = useCallback(
    async (tools) => {
      const result = await updateTools(firebaseUser, tools);
      if (!result.error) await refreshProfile();
      return result;
    },
    [firebaseUser, refreshProfile]
  );

  // ── All values exposed via useAuth() ────────────
  const value = {
    // Raw Firebase + Supabase objects
    firebaseUser,
    supabaseUser,
    currentUser: firebaseUser,

    // Auth state
    loading,
    isAuthenticated: !loading && !!firebaseUser,

    // Profile data — all safe defaults
    displayName:     supabaseUser?.display_name     ?? '',
    username:        supabaseUser?.username          ?? '',
    avatarUrl:       supabaseUser?.avatar_url        ?? null,
    bannerUrl:       supabaseUser?.banner_url        ?? null,
    userTitle:       supabaseUser?.title             ?? '',
    bio:             supabaseUser?.bio               ?? '',
    organization:    supabaseUser?.organization      ?? '',
    education:       supabaseUser?.education         ?? '',
    locationCity:    supabaseUser?.location_city     ?? '',
    locationCountry: supabaseUser?.location_country  ?? '',
    websiteUrl:      supabaseUser?.website_url       ?? null,
    linkedinUrl:     supabaseUser?.linkedin_url      ?? null,
    twitterUrl:      supabaseUser?.twitter_url       ?? null,
    yearsExp:        supabaseUser?.years_exp          ?? '',
    accountType:     supabaseUser?.account_type      ?? 'individual',
    isVerified:      supabaseUser?.is_verified       ?? false,
    isPro:           supabaseUser?.is_pro            ?? false,
    memberSince:     supabaseUser?.member_since      ?? null,
    showEmail:       supabaseUser?.show_email        ?? false,
    allowMessages:   supabaseUser?.allow_messages    ?? true,

    // Privacy / notification settings
    privacySettings: {
      show_email:      supabaseUser?.show_email      ?? false,
      allow_messages:  supabaseUser?.allow_messages  ?? true,
      show_activity:   supabaseUser?.show_activity   ?? true,
      show_saves:      supabaseUser?.show_saves      ?? false,
      allow_indexing:  supabaseUser?.allow_indexing  ?? true,
    },
    notifySettings: {
      notify_follows:  supabaseUser?.notify_follows  ?? true,
      notify_upvotes:  supabaseUser?.notify_upvotes  ?? false,
      notify_comments: supabaseUser?.notify_comments ?? true,
      notify_digest:   supabaseUser?.notify_digest   ?? true,
    },

    // Arrays
    specializations: supabaseUser?.user_specializations
                       ?.map(s => s.tag)             ?? [],
    tools:           supabaseUser?.user_tools
                       ?.map(t => t.tool)            ?? [],
    interests:       supabaseUser?.user_interests
                       ?.map(i => i.interest)        ?? [],

    // Provider detection
    authProvider:    firebaseUser?.providerData?.[0]
                       ?.providerId === 'google.com'
                       ? 'google' : 'email',

    // Counts
    followerCount,
    followingCount,
    repoCount: 0,

    // Count updaters for optimistic UI
    incrementFollowing: () => setFollowingCount(c => c + 1),
    decrementFollowing: () => setFollowingCount(c => c - 1),

    // Actions
    refreshProfile,
    signIn:              (email, pw) =>
                           signInEmail(email, pw),
    signInGoogle:        () => googleSignIn(),
    signUp:              (email, pw) =>
                           signUpEmail(email, pw),
    signOut,
    createFullProfile:   (data) =>
                           createFullProfile(firebaseUser, data),
    checkUsername,
    updateProfileFields: wrappedUpdateFields,
    updateSpecializations: wrappedUpdateSpecs,
    updateTools:         wrappedUpdateTools,
    changePassword:      (cur, next) =>
                           changePassword(firebaseUser, cur, next),
    deleteAccount:       () => deleteAccount(firebaseUser),
    reauthenticate:      (pw) =>
                           reauthenticate(firebaseUser, pw),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth: no AuthProvider');
  return ctx;
}
