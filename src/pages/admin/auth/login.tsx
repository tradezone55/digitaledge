import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Shield, Eye, EyeOff } from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Logo from "../../../components/ui/Logo";
import { adminLoginSchema } from "../../../schemas/admin";
import { useAdminStore } from "../../../stores/admin";
import { adminLoginAPI } from "../../../services/admin";



interface AdminLoginFormData {
  email: string;
  password: string;
}

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAdmin, setAuthenticated } = useAdminStore();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const { mutate: login, isPending } = useMutation({
    mutationFn: adminLoginAPI,
    onSuccess: (data) => {
      if (data?.success) {
        console.log(data, "data");
        toast.success(data.message);
        setAdmin(data.user);
        setAuthenticated(true);
        navigate("/admin/dashboard", { replace: true });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Admin login failed");
    },
  });

  const onSubmit = (data: AdminLoginFormData) => {
    login(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f16] to-[#1e293b] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-gray-400">
            Enter your admin credentials to access the dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Admin Email"
              type="email"
              placeholder="admin@example.com"
              {...register("email")}
              error={errors.email}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                error={errors.password}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              loading={isPending}
              loadingText="Signing in..."
              className="mt-6"
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin Login
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Admin access is restricted to authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
