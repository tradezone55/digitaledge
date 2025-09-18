import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { toast } from "react-toastify";
import { setupProfile } from "../services/auth";
import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "../stores";
import { IUser } from "../types/user";
import { profileSetupSchema, ProfileSetupFormData } from "../schemas/auth";
import supabase from "../supabase";
import { CustomModal } from "./ui/custom-modal";

interface InputField {
  label: string;
  type: string;
  placeholder: string;
  name: string;
  required: boolean;
  readOnly?: boolean;
}

interface ProfileSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
  closable?: boolean;
}

const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({
  open,
  onOpenChange,
  onComplete,
  closable = true
}) => {
  const { setUser, setAuthenticated } = useUserStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileSetupFormData>({
    resolver: zodResolver(profileSetupSchema),
  });

  // Pre-fill email and name from authenticated user
  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          setValue('email', user.email);
        }
        console.log(user);
        // Check if user profile exists and has a name
        const { data: userProfile } = await supabase
          .from('users')
          .select('name')
          .eq('user_id', user?.id)
          .single();
        console.log(userProfile);
        if (userProfile?.name) {
          setValue('name', userProfile.name);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (open) {
      getUserData();
    }
  }, [setValue, open]);

  const { mutate: setupUserProfile, isPending } = useMutation({
    mutationFn: setupProfile,
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.message);
        setUser(data.user as IUser);
        setAuthenticated(true);
        // Clear registration flow flag
        localStorage.removeItem('isInRegistrationFlow');
        onOpenChange(false);
        onComplete?.();
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: ProfileSetupFormData) => {
    setupUserProfile(data);
  };

  return (
    <CustomModal
      title="Complete Your Profile"
      description="Welcome! Please complete your profile to enjoy the platform"
      open={open}
      onOpenChange={onOpenChange}
      closable={closable}
    >
      <form
        className="w-full space-y-4 mt-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {inputLists.map((input) => (
          <Input
            key={input.name.toString()}
            {...input}
            {...register(input.name as keyof ProfileSetupFormData)}
            error={
              errors[input.name as keyof ProfileSetupFormData] as unknown as {
                message: string;
              }
            }
            required={input.required}
            readOnly={input.readOnly}
          />
        ))}

        <div className="flex items-center justify-between">
          <Button
            type="submit"
            className="w-full p-2 rounded-md bg-blue-600 text-white"
            disabled={isPending}
            loading={isPending}
            loadingText="Setting up profile..."
          >
            Complete Profile
          </Button>
        </div>
      </form>
    </CustomModal>
  );
};

export default ProfileSetupModal;

const inputLists: InputField[] = [
  {
    label: "Full Name",
    type: "text",
    placeholder: "Enter your full name",
    name: "name",
    required: true,
  },
  {
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    name: "email",
    required: true,
    readOnly: true,
  },
];
