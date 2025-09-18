import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Shield } from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Logo from "../../../components/ui/Logo";
import { adminMagicLinkSchema } from "../../../schemas/admin";
import { sendAdminMagicLink } from "../../../services/auth";



interface AdminLoginFormData {
  email: string;
}

const AdminLoginPage: React.FC = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminMagicLinkSchema),
  });

  const { mutate: sendLink, isPending } = useMutation({
    mutationFn: sendAdminMagicLink,
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send admin magic link");
    },
  });

  const onSubmit = (data: AdminLoginFormData) => {
    sendLink(data);
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
            Enter your admin email to receive a secure magic link
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

            <Button
              type="submit"
              disabled={isPending}
              loading={isPending}
              loadingText="Sending magic link..."
              className="mt-6"
            >
              <Shield className="w-4 h-4 mr-2" />
              Send Admin Magic Link
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
