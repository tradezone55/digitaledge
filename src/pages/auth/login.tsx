import React, { useEffect } from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../components/ui/Button";
import { toast } from "react-toastify";
import { sendMagicLink } from "../../services/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const magicLinkSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email({ message: 'Please enter a valid email address' }),
});

type MagicLinkFormData = z.infer<typeof magicLinkSchema>;

interface InputField {
  label: string;
  type: string;
  placeholder: string;
  name: string;
  required: boolean;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema),
  });

  // Check if user is in registration flow and redirect them
  useEffect(() => {
    const isInRegistrationFlow = localStorage.getItem('isInRegistrationFlow');
    if (isInRegistrationFlow === 'true') {
      toast.info('Please complete your profile setup first');
      navigate('/home/profile-setup');
    }
  }, [navigate]);

  const { mutate: sendLink, isPending } = useMutation({
    mutationFn: sendMagicLink,
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: MagicLinkFormData) => {
    sendLink(data);
  };

  return (
    <AuthLayout
      description="Enter your email to receive a magic link for secure login"
      link=""
      linkText=""
      linkContent=""
    >
      <form
        action=""
        className="w-full space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {inputLists.map((input) => (
          <Input
            key={input.name.toString()}
            {...input}
            {...register(input.name as keyof MagicLinkFormData)}
            error={
              errors[input.name as keyof MagicLinkFormData] as unknown as {
                message: string;
              }
            }
            required={input.required}
          />
        ))}

        <div className="flex items-center justify-between">
          <Button
            type="submit"
            className="w-full p-2 rounded-md bg-blue-600 text-white"
            disabled={isPending}
            loading={isPending}
            loadingText="Sending magic link..."
          >
            Send Magic Link
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;

const inputLists: InputField[] = [
  {
    label: "Email",
    type: "email",
    placeholder: "Enter your email address",
    name: "email",
    required: true,
  },
];
