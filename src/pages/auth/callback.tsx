import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { verifyOTP } from "../../services/auth";
import { useUserStore } from "@/stores";
import type { IUser } from "@/types/user";
import AuthLayout from "../../components/layout/AuthLayout";
import Button from "@/components/ui/Button";
import ProfileSetupModal from "../../components/ProfileSetupModal";
import { useLanguageNavigation } from "../../utils/navigation";
import supabase from "../../supabase";

// Prevent multiple login toasts
let loginToastId: number | string | null = null;

const VerifyOTPPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setAuthenticated } = useUserStore();
  const { getLanguagePath } = useLanguageNavigation();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const hasShownSuccessToast = useRef(false);

  const { mutate: verify, isPending } = useMutation({
    mutationFn: verifyOTP,
    onSuccess: (data) => {
      if (data?.success) {
        const user = data.user as IUser;

        // Check if user needs to create profile or has incomplete profile
        if (data.needsProfile) {
          setShowProfileModal(true);
        } else {
          // Dismiss previous toast if it exists
          if (loginToastId) {
            toast.dismiss(loginToastId);
          }
          // Only show toast once
          if (!hasShownSuccessToast.current) {
            loginToastId = toast.success(data.message, { toastId: 'login-success' });
            hasShownSuccessToast.current = true;
          }
          setUser(user);
          setAuthenticated(true);
          navigate(getLanguagePath("home"));
        }
      }
    },
    onError: (error) => {
      // Dismiss previous toast if it exists
      if (loginToastId) {
        toast.dismiss(loginToastId);
      }
      loginToastId = toast.error(error.message, { toastId: 'login-error' });
      navigate(getLanguagePath("auth/login"));
    },
  });

  const handleProfileModalClose = (open: boolean) => {
    setShowProfileModal(open);
    // Profile setup is handled by the modal's onComplete callback
  };

  const handleProfileComplete = () => {
    // Dismiss previous toast if it exists
    if (loginToastId) {
      toast.dismiss(loginToastId);
    }
    // Only show toast once
    if (!hasShownSuccessToast.current) {
      loginToastId = toast.success("Welcome! Your profile is now complete.", { toastId: 'profile-complete' });
      hasShownSuccessToast.current = true;
    }
    // The ProfileSetupModal will handle setting the user and authentication
    // We just need to redirect to home
    navigate(getLanguagePath("home"));
  };

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if we have URL hash parameters (common with Outlook)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hasHashParams = hashParams.has('access_token') || hashParams.has('refresh_token');

        console.log('Auth callback - Hash params present:', hasHashParams);
        console.log('Current URL:', window.location.href);

        // Handle the auth callback from URL hash parameters
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);

          // If we have hash params but session failed, try to handle the auth state change
          if (hasHashParams) {
            console.log('Hash params detected but session failed, waiting for auth state change...');
            // Wait a bit for Supabase to process the hash parameters
            setTimeout(() => {
              verify();
            }, 1000);
            return;
          }

          if (loginToastId) {
            toast.dismiss(loginToastId);
          }
          loginToastId = toast.error('Authentication failed. Please try again.', { toastId: 'auth-failed' });
          navigate(getLanguagePath("auth/login"));
          return;
        }

        if (!data.session) {
          // No session found, try to get user anyway (fallback)
          console.log('No session found, attempting to verify OTP...');

          // If we have hash params, wait a bit for Supabase to process them
          if (hasHashParams) {
            console.log('Hash params detected, waiting for processing...');
            setTimeout(() => {
              verify();
            }, 1500);
            return;
          }

          verify();
          return;
        }

        // Session found, proceed with verification
        console.log('Session found, proceeding with verification...');
        verify();
      } catch (error) {
        console.error('Auth callback error:', error);
        if (loginToastId) {
          toast.dismiss(loginToastId);
        }
        loginToastId = toast.error('Authentication failed. Please try again.', { toastId: 'auth-failed-catch' });
        navigate(getLanguagePath("auth/login"));
      }
    };

    // Handle the auth callback
    handleAuthCallback();
  }, [verify, navigate, getLanguagePath]);

  return (
    <>
      <AuthLayout
        description="Verifying your magic link..."
        link="/auth/login"
        linkText="Back to login"
        linkContent=""
      >
        <div className="w-full space-y-4 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">
              {isPending ? "Verifying your magic link..." : "Redirecting you to your dashboard..."}
            </p>
          </div>

          <div className="mt-6">
            <Button
              onClick={() => navigate(getLanguagePath("auth/login"))}
              className="w-full p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
              disabled={isPending}
            >
              Back to Login
            </Button>
          </div>
        </div>
      </AuthLayout>

      <ProfileSetupModal
        open={showProfileModal}
        onOpenChange={handleProfileModalClose}
        onComplete={handleProfileComplete}
        closable={false}
      />
    </>
  );
};

export default VerifyOTPPage;
