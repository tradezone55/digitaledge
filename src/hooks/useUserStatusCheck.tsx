import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useUserStore } from '@/stores';
import { checkUserStatus } from '@/services/auth';
import { toast } from 'react-toastify';
import { useLanguageNavigation } from '../utils/navigation';

// Prevent multiple deactivation toasts
let deactivationToastId: number | string | null = null;

export const useUserStatusCheck = () => {
  const navigate = useNavigate();
  const { clearUser, isAuthenticated } = useUserStore();
  const { getLanguagePath } = useLanguageNavigation();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasShownDeactivationToast = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Check user status every 5 minutes
    const checkStatus = async () => {
      try {
        const { isActive, shouldLogout } = await checkUserStatus();

        if (shouldLogout && !isActive && !hasShownDeactivationToast.current) {
          // Dismiss previous toast if it exists
          if (deactivationToastId) {
            toast.dismiss(deactivationToastId);
          }
          clearUser();
          hasShownDeactivationToast.current = true;
          deactivationToastId = toast.error('Your account has been deactivated. You have been logged out.', { toastId: 'deactivation' });
          navigate(getLanguagePath('auth/login'));
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
  }, [isAuthenticated, clearUser, navigate, getLanguagePath]);

  // Also check on window focus (when user comes back to the app)
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleFocus = async () => {
      try {
        const { isActive, shouldLogout } = await checkUserStatus();

        if (shouldLogout && !isActive && !hasShownDeactivationToast.current) {
          // Dismiss previous toast if it exists
          if (deactivationToastId) {
            toast.dismiss(deactivationToastId);
          }
          clearUser();
          hasShownDeactivationToast.current = true;
          deactivationToastId = toast.error('Your account has been deactivated. You have been logged out.', { toastId: 'deactivation' });
          navigate(getLanguagePath('auth/login'));
        }
      } catch (error) {
        console.error('Error checking user status on focus:', error);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isAuthenticated, clearUser, navigate, getLanguagePath]);
};
