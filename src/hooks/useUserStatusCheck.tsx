import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useUserStore } from '@/stores';
import { checkUserStatus } from '@/services/auth';
import { toast } from 'react-toastify';

export const useUserStatusCheck = () => {
  const navigate = useNavigate();
  const { clearUser, isAuthenticated } = useUserStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Check user status every 5 minutes
    const checkStatus = async () => {
      try {
        const { isActive, shouldLogout } = await checkUserStatus();

        if (shouldLogout && !isActive) {
          clearUser();
          toast.error('Your account has been deactivated. You have been logged out.');
          navigate('/auth/login');
        }
      } catch (error) {
        console.error('Error checking user status:', error);
      }
    };

    // Initial check
    checkStatus();

    // Set up interval for periodic checks
    intervalRef.current = setInterval(checkStatus, 5 * 60 * 1000); // 5 minutes

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuthenticated, clearUser, navigate]);

  // Also check on window focus (when user comes back to the app)
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleFocus = async () => {
      try {
        const { isActive, shouldLogout } = await checkUserStatus();

        if (shouldLogout && !isActive) {
          clearUser();
          toast.error('Your account has been deactivated. You have been logged out.');
          navigate('/auth/login');
        }
      } catch (error) {
        console.error('Error checking user status on focus:', error);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isAuthenticated, clearUser, navigate]);
};
