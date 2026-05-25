import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getProfile,
  isFollowing as checkIsFollowing,
  followUser,
  unfollowUser,
  getActivity,
} from '../lib/profile';

/**
 * useProfile(username)
 * Fetches profile data, follow status, and activity for a given username.
 * Provides optimistic follow / unfollow actions.
 */
export function useProfile(username) {
  const { firebaseUser, supabaseUser, isAuthenticated } = useAuth();

  const [profile,        setProfile]        = useState(null);
  const [activities,     setActivities]     = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [isFollowing,    setIsFollowing]    = useState(false);
  const [followerCount,  setFollowerCount]  = useState(0);
  const [followLoading,  setFollowLoading]  = useState(false);

  // Resolved username ─ if 'me' use own username
  const resolvedUsername = username === 'me'
    ? supabaseUser?.username
    : username;

  const isOwnProfile = isAuthenticated && !!supabaseUser &&
    supabaseUser.username === resolvedUsername;

  // Track last loaded username to avoid duplicate fetches
  const lastLoaded = useRef(null);

  const loadProfile = useCallback(async () => {
    if (!resolvedUsername) return;
    if (lastLoaded.current === resolvedUsername && profile) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchErr } = await getProfile(resolvedUsername);

    if (fetchErr || !data) {
      setError(fetchErr || 'Profile not found.');
      setLoading(false);
      return;
    }

    setProfile(data);
    setFollowerCount(data.follower_count || 0);
    lastLoaded.current = resolvedUsername;

    // Check follow status
    if (!isOwnProfile && isAuthenticated && firebaseUser) {
      const { data: following } = await checkIsFollowing(firebaseUser.uid, resolvedUsername);
      setIsFollowing(!!following);
    }

    // Load activity
    if (data.user?.id) {
      const { data: acts } = await getActivity(data.user.id);
      setActivities(acts || []);
    }

    setLoading(false);
  }, [resolvedUsername, isOwnProfile, isAuthenticated, firebaseUser, profile]);

  const [prevResolvedUsername, setPrevResolvedUsername] = useState(resolvedUsername);

  if (resolvedUsername !== prevResolvedUsername) {
    setPrevResolvedUsername(resolvedUsername);
    lastLoaded.current = null;
    setProfile(null);
    setActivities([]);
    setIsFollowing(false);
    setFollowerCount(0);
  }

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedUsername]);

  // Force refresh (e.g., after settings save)
  const refresh = useCallback(async () => {
    lastLoaded.current = null;
    await loadProfile();
  }, [loadProfile]);

  // Optimistic follow
  const follow = useCallback(async () => {
    if (!firebaseUser || followLoading) return;
    setIsFollowing(true);
    setFollowerCount(c => c + 1);
    setFollowLoading(true);
    const { error: err } = await followUser(firebaseUser.uid, resolvedUsername);
    setFollowLoading(false);
    if (err) {
      setIsFollowing(false);
      setFollowerCount(c => c - 1);
    }
    return err;
  }, [firebaseUser, resolvedUsername, followLoading]);

  // Optimistic unfollow
  const unfollow = useCallback(async () => {
    if (!firebaseUser || followLoading) return;
    setIsFollowing(false);
    setFollowerCount(c => Math.max(0, c - 1));
    setFollowLoading(true);
    const { error: err } = await unfollowUser(firebaseUser.uid, resolvedUsername);
    setFollowLoading(false);
    if (err) {
      setIsFollowing(true);
      setFollowerCount(c => c + 1);
    }
    return err;
  }, [firebaseUser, resolvedUsername, followLoading]);

  return {
    profile,
    activities,
    loading,
    error,
    isOwnProfile,
    resolvedUsername,
    isFollowing,
    followerCount,
    followLoading,
    follow,
    unfollow,
    refresh,
  };
}

export default useProfile;
