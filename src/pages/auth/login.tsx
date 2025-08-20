import React from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../components/ui/Button";
import { LoginFormData, loginSchema } from "../../schemas/auth";
import { toast } from "react-toastify";
import { loginAPI } from "../../services/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores";
import { IUser } from "../../types/user";

interface InputField {
  label: string;
  type: string;
  placeholder: string;
  name: string;
  required: boolean;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setAuthenticated } = useUserStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending } = useMutation({
    mutationFn: loginAPI,
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.message);
        setUser(data.user as IUser);
        setAuthenticated(true);
        navigate("/home");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <AuthLayout
      description="Enter your email and password to login to your account"
      link="/signup"
      linkText="Sign up"
      linkContent="Don't have an account? Sign up "
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
            {...register(input.name as keyof LoginFormData)}
            error={
              errors[input.name as keyof LoginFormData] as unknown as {
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
            loadingText="Logging in..."
          >
            Login
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
    placeholder: "Email",
    name: "email",
    required: true,
  },
  {
    label: "Password",
    type: "password",
    placeholder: "Password",
    name: "password",
    required: true,
  },
];
