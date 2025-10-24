import React, { useEffect, useState } from "react";
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

const VerifyOTPPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setAuthenticated } = useUserStore();
  const { getLanguagePath } = useLanguageNavigation();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const { mutate: verify, isPending } = useMutation({
    mutationFn: verifyOTP,
    onSuccess: (data) => {
      if (data?.success) {
        const user = data.user as IUser;

        // Check if user needs to create profile or has incomplete profile
        if (data.needsProfile) {
          setShowProfileModal(true);
        } else {
          toast.success(data.message);
          setUser(user);
          setAuthenticated(true);
          navigate(getLanguagePath("home"));
        }
      }
    },
    onError: (error) => {
      toast.error(error.message);
      navigate(getLanguagePath("auth/login"));
    },
  });

  const handleProfileModalClose = (open: boolean) => {
    setShowProfileModal(open);
    // Profile setup is handled by the modal's onComplete callback
  };

  const handleProfileComplete = () => {
    toast.success("Welcome! Your profile is now complete.");
    // The ProfileSetupModal will handle setting the user and authentication
    // We just need to redirect to home
    navigate(getLanguagePath("home"));
  };

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the auth callback from URL hash parameters
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          toast.error('Authentication failed. Please try again.');
          navigate(getLanguagePath("auth/login"));
          return;
        }

        if (!data.session) {
          // No session found, try to get user anyway (fallback)
          console.log('No session found, attempting to verify OTP...');
          verify();
          return;
        }

        // Session found, proceed with verification
        console.log('Session found, proceeding with verification...');
        verify();
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error('Authentication failed. Please try again.');
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
