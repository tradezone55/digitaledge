import { CustomModal } from "@/components/ui/custom-modal";
import Input from "@/components/ui/Input";
import { updateUserAPI } from "@/services/admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { z } from "zod";
import { User } from "@/types/subscription";

const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type UpdateUserFormData = z.infer<typeof updateUserSchema>;

interface UpdateUserProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UpdateUser: React.FC<UpdateUserProps> = ({ user, open, onOpenChange }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
  });

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
    }
  }, [user, setValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateUserFormData) =>
      updateUserAPI({
        user_id: user?.user_id || "",
        ...data,
      }),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success("User updated successfully");
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        onOpenChange(false);
        reset();
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update user");
    },
  });

  const onSubmit = (data: UpdateUserFormData) => {
    if (!user) {
      toast.error("No user selected");
      return;
    }
    mutate(data);
  };

  const handleClose = () => {
    onOpenChange(false);
    reset();
  };

  return (
    <CustomModal
      title="Update User"
      description="Update user information"
      open={open}
      onOpenChange={handleClose}
    >
      <form
        className="w-full space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="Name"
          type="text"
          placeholder="Enter user name"
          {...register("name")}
          error={errors.name}
          required
        />

        <Input
          label="Email"
          type="email"
          placeholder="Enter user email"
          {...register("email")}
          error={errors.email}
          required
        />

        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="secondary"
            className="w-full p-2 rounded-md"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full p-2 rounded-md bg-blue-600 text-white"
            disabled={isPending}
            loading={isPending}
            loadingText="Updating..."
          >
            Update
          </Button>
        </div>
      </form>
    </CustomModal>
  );
};

export default UpdateUser;
