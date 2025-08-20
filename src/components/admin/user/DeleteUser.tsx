import { CustomModal } from "@/components/ui/custom-modal";
import { deleteUserAPI } from "@/services/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import { User } from "@/types/subscription";
import { AlertTriangle } from "lucide-react";

interface DeleteUserProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteUser: React.FC<DeleteUserProps> = ({ user, open, onOpenChange }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (user_id: string) => deleteUserAPI(user_id),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success("User deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
        onOpenChange(false);
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete user");
    },
  });

  const handleDelete = () => {
    if (!user) {
      toast.error("No user selected");
      return;
    }
    mutate(user.user_id);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <CustomModal
      title="Delete User"
      description="This action cannot be undone"
      open={open}
      onOpenChange={handleClose}
    >
      <div className="w-full space-y-4">
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">
              Are you sure you want to delete this user?
            </p>
            <p className="text-sm text-red-600 mt-1">
              This will permanently delete the user and all their subscription data.
            </p>
          </div>
        </div>

        {user && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">User Details:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Name:</span> {user.name}</p>
              <p><span className="font-medium">Email:</span> {user.email}</p>
              <p><span className="font-medium">User ID:</span> {user.user_id.slice(0, 8)}...</p>
            </div>
          </div>
        )}

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
            type="button"
            variant="danger"
            className="w-full p-2 rounded-md bg-red-600 text-white hover:bg-red-700"
            onClick={handleDelete}
            disabled={isPending}
            loading={isPending}
            loadingText="Deleting..."
          >
            Delete User
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};

export default DeleteUser;
