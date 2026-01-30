import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useUserStore } from '../store/userStore';
import { getUserDetailsAPI } from '../apis/user.api';

export const useUserDetails = () => {
  const { user } = useAuth();
  const {
    userDetails,
    isUserDetailsFetched,
    setUserDetails,
    setIsUserDetailsFetched,
  } = useUserStore();

  const fetchUserDetails = async (uid?: string, force: boolean = false): Promise<boolean> => {
    if (isUserDetailsFetched && !force) return true;

    try {
      const result = await getUserDetailsAPI(uid || user?.uid);
      if (result) {
        setUserDetails(result);
        setIsUserDetailsFetched(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user && !isUserDetailsFetched) {
      fetchUserDetails();
    }
  }, [user, isUserDetailsFetched]);

  return {
    userDetails,
    isUserDetailsFetched,
    fetchUserDetails,
    refreshUserDetails: () => {
      setIsUserDetailsFetched(false);
      fetchUserDetails();
    },
  };
};

