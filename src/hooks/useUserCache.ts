import { useState, useCallback } from 'react';
import { UserIF } from '../types/users.interface';
import { userCacheService } from '../services/userCache.service';

export const useUserCache = () => {
  const [userCache, setUserCache] = useState<Map<string, UserIF>>(new Map());
  const [cacheVersion, setCacheVersion] = useState(0);

  const updateCache = useCallback(async (uids: (string | undefined)[]) => {
    const validUids = uids.filter((uid): uid is string => !!uid);
    
    if (validUids.length === 0) return;
    
    await userCacheService.updateUsersCache(validUids);
    
    // Update local cache state with all users from service cache
    setUserCache((prev) => {
      const updated = new Map(prev);
      let hasNewUsers = false;
      validUids.forEach((uid) => {
        const user = userCacheService.getUserFromCacheSync(uid);
        if (user && !updated.has(uid)) {
          updated.set(uid, user);
          hasNewUsers = true;
        }
      });
      // Only update if we have new users to trigger re-render
      return hasNewUsers ? updated : prev;
    });
    
    // Force re-render by updating version
    setCacheVersion((prev) => prev + 1);
  }, []);

  const getUser = useCallback((uid: string | undefined | null): UserIF | null => {
    if (!uid) return null;
    return userCache.get(uid) || userCacheService.getUserFromCacheSync(uid) || null;
  }, [userCache]);

  return { userCache, updateCache, getUser, cacheVersion };
};

