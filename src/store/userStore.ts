import { create } from 'zustand';
import { UserIF } from '../types/users.interface';

interface UserStore {
  // User state
  userDetails: UserIF;
  isUserDetailsFetched: boolean;
  
  // Application state
  isApplicationLoaded: boolean;
  applicationVersion: string;
  
  // Actions
  setUserDetails: (user: UserIF) => void;
  updateUserDetails: (updates: Partial<UserIF>) => void;
  setIsUserDetailsFetched: (fetched: boolean) => void;
  setApplicationLoaded: (loaded: boolean) => void;
  resetUserStore: () => void;
}

const initialState = {
  userDetails: {} as UserIF,
  isUserDetailsFetched: false,
  isApplicationLoaded: false,
  applicationVersion: '1.2.3', // Match Angular version
};

export const useUserStore = create<UserStore>((set) => ({
  ...initialState,
  
  setUserDetails: (user: UserIF) => {
    set({ userDetails: user, isUserDetailsFetched: true });
  },
  
  updateUserDetails: (updates: Partial<UserIF>) => {
    set((state) => ({
      userDetails: { ...state.userDetails, ...updates },
    }));
  },
  
  setIsUserDetailsFetched: (fetched: boolean) => {
    set({ isUserDetailsFetched: fetched });
  },
  
  setApplicationLoaded: (loaded: boolean) => {
    set({ isApplicationLoaded: loaded });
  },
  
  resetUserStore: () => {
    set(initialState);
  },
}));


