import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase.config';

/**
 * This will logout the user and reload the entire app once to ensure that the service variables
 * were reset properly.
 */
export const logoutUser = async (force: boolean = true): Promise<void> => {
  try {
    await signOut(auth);
    if (force) {
      window.location.reload();
    }
  } catch (error: any) {
    console.log('logoutUser: [ERR]', error.message);
    throw error;
  }
};


