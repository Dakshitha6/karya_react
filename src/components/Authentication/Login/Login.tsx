import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useUserDetails } from '../../../hooks/useUserDetails';
import { useToast } from '../../../hooks/useToast';
import { useUserStore } from '../../../store/userStore';
import { logoutUser } from '../../../utils/authentication.function';
import NegativeAuthRoute from '../../ProtectedRoute/NegativeAuthRoute';
import './Login.scss';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { fetchUserDetails } = useUserDetails();
  const { userDetails, setApplicationLoaded } = useUserStore();
  const toast = useToast();
  const navigate = useNavigate();

  // Set application loaded on mount (hide splash screen)
  useEffect(() => {
    setApplicationLoaded(true);
  }, [setApplicationLoaded]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsFormSubmitted(true);
    setIsLoading(true);

    if (!email || !password) {
      setIsLoading(false);
      return;
    }

    try {
      // Login with Firebase
      await login(email, password);

      // Fetch user details - force refresh to get latest data
      const ok = await fetchUserDetails(undefined, true);

      if (!ok) {
        toast.error('Failed to fetch user details. Please try again.', {
          position: 'top-right',
        });
        await logoutUser(true);
        return;
      }

      // Get user details from store after fetch
      const currentUserDetails = useUserStore.getState().userDetails;

      // Check if user is admin
      if (!currentUserDetails?.isAdmin) {
        toast.error(
          'This account is not allowed to access the admin portal.',
          {
            position: 'top-right',
          }
        );
        // Force logout and reload
        await logoutUser(true);
        return;
      }

      toast.success('Logged in successfully', {
        position: 'top-right',
      });

      // Navigate to home
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(
        error?.message ?? 'Unable to login. Please check your credentials.',
        {
          position: 'top-right',
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && email && password) {
      handleSubmit(e as any);
    }
  };

  return (
    <NegativeAuthRoute>
      <div className="login-container">
        <div className="login-form-wrapper">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="admin@karya.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                required
                className="form-input"
              />
              {!email && isFormSubmitted && (
                <p className="error-message">Email is required.</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                required
                className="form-input"
              />
              {!password && isFormSubmitted && (
                <p className="error-message">Password is required.</p>
              )}
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </NegativeAuthRoute>
  );
};

export default Login;

