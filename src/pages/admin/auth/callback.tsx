import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../../stores/admin';
import { logout } from '../../../services/auth';
import { toast } from 'react-toastify';
import supabase from '../../../supabase';
import CustomLoader from '../../../components/CustomLoader/page';

const AdminAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { setAdmin, setAuthenticated } = useAdminStore();

  useEffect(() => {
    const handleAdminAuthCallback = async () => {
      try {
        // Handle the auth callback
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          toast.error('Admin authentication failed');
          navigate('/admin/auth/login');
          return;
        }

        if (!data.user) {
          toast.error('No active session found');
          navigate('/admin/auth/login');
          return;
        }

        // Check if user exists in our database and has admin role
        const { data: userProfileData, error: userProfileError } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (userProfileError || !userProfileData) {
          // User doesn't exist in our database
          await logout();
          toast.error('Admin account not found. Please contact system administrator.');
          navigate('/admin/auth/login');
          return;
        }

        // Check if user has admin role
        if (userProfileData.role !== 'admin') {
          await logout();
          toast.error('Access denied. Admin privileges required.');
          navigate('/admin/auth/login');
          return;
        }

        // Check if admin account is active
        if (!userProfileData.is_active) {
          await logout();
          toast.error('Admin account is inactive. Please contact system administrator.');
          navigate('/admin/auth/login');
          return;
        }

        // All checks passed - set admin and redirect to dashboard
        setAdmin(userProfileData);
        setAuthenticated(true);
        toast.success('Admin login successful');
        navigate('/admin/dashboard', { replace: true });

      } catch (error) {
        console.error('Admin auth callback error:', error);
        toast.error('Admin authentication failed');
        navigate('/admin/auth/login');
      }
    };

    handleAdminAuthCallback();
  }, [navigate, setAdmin, setAuthenticated]);

  return <CustomLoader />;
};

export default AdminAuthCallback;
