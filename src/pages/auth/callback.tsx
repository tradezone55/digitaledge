import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores';
import { checkProfileCompleteness, logout } from '../../services/auth';
import { toast } from 'react-toastify';
import supabase from '../../supabase';
import CustomLoader from '../../components/CustomLoader/page';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setAuthenticated } = useUserStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the auth callback
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          toast.error('Authentication failed');
          navigate('/login');
          return;
        }

        if (!data.user) {
          toast.error('No active session found');
          navigate('/login');
          return;
        }

        // Check if user profile is complete
        const profileCheck = await checkProfileCompleteness();

        if (profileCheck.isComplete && profileCheck.user?.is_active) {
          // Profile is complete and user is active - redirect to home
          setUser(profileCheck.user);
          setAuthenticated(true);
          navigate('/home');
        } else if (profileCheck.user && !profileCheck.user.is_active) {
          // User exists but is inactive - logout and redirect to login
          await logout();
          setUser(null);
          setAuthenticated(false);
          toast.error('Your account is inactive. Please contact support.');
          navigate('/login');
        } else {
          // Profile is incomplete (missing name or email) - redirect to profile setup
          // Set flag to indicate user is in registration flow
          localStorage.setItem('isInRegistrationFlow', 'true');
          navigate('/profile-setup');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error('Authentication failed');
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, setUser, setAuthenticated]);

  return <CustomLoader />;
};

export default AuthCallback;
