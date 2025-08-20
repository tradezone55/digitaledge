import React from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "../../schemas/auth";
import Button from "../../components/ui/Button";
import { useMutation } from "@tanstack/react-query";
import { registerAPI } from "../../services/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores";
import { IUser } from "../../types/user";
import { inputLists } from "@/constants/sign-up";



const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setAuthenticated } = useUserStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: registerAPI,
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.message);
        setUser(data.user as IUser);
        setAuthenticated(true);
        navigate("/home/demo", {
          replace: true,
        });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    mutate(data);
  };

  return (
    <AuthLayout
      description="Enter your name, email and password to sign up to your account"
      link="/login"
      linkText="Login"
      linkContent="Already have an account? Login"
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
            {...register(input.name as keyof RegisterFormData)}
            error={errors[input.name as keyof RegisterFormData]}
            required={input.required}
          />
        ))}

        <div className="flex items-center justify-between">
          <Button
            type="submit"
            className="w-full p-2 rounded-md bg-blue-600 text-white"
            disabled={isPending}
            loading={isPending}
            loadingText="Registering..."
          >
            Sign up
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;

