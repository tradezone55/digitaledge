import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { adminUserManagementAPI } from "../../../services/admin";
import { User } from "../../../types/subscription";

interface UserActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
  actionMonths: number;
  setActionMonths: (months: number) => void;
  actionReason: string;
  setActionReason: (reason: string) => void;
}

const UserActionModal: React.FC<UserActionModalProps> = ({
  open,
  onOpenChange,
  selectedUser,
  actionMonths,
  setActionMonths,
  actionReason,
  setActionReason,
}) => {
  const queryClient = useQueryClient();

  // User management mutation
  const { mutate: manageUser, isPending: managingUser } = useMutation({
    mutationFn: adminUserManagementAPI,
    onSuccess: () => {
      toast.success("Subscription extended successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to extend subscription");
    },
  });

  const handleUserAction = () => {
    if (!selectedUser) return;

    const actionData = {
      user_id: selectedUser.user_id,
      months: actionMonths,
      reason: actionReason || undefined,
    };

    manageUser(actionData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-white mb-4">
          Extend Subscription
        </h3>

        {selectedUser && (
          <div className="mb-4 p-3 bg-gray-700 rounded-lg">
            <p className="text-white font-medium">{selectedUser.name}</p>
            <p className="text-gray-400 text-sm">{selectedUser.email}</p>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Duration (months)
          </label>
          <Input
            type="number"
            min="1"
            max="12"
            value={actionMonths}
            onChange={(e) =>
              setActionMonths(parseInt(e.target.value) || 1)
            }
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Reason (optional)
          </label>
          <Input
            placeholder="Enter reason for this action..."
            value={actionReason}
            onChange={(e) => setActionReason(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUserAction}
            loading={managingUser}
            disabled={managingUser}
            className="flex-1"
          >
            Extend Subscription
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserActionModal;
