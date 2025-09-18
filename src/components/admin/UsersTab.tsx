import React, { useState } from "react";
import { Edit, Trash2, CreditCard } from "lucide-react";
import Button from "../ui/Button";
import { User } from "../../types/subscription";
import AddUser from "./user/AddUser";
import SubscribeUser from "./user/SubscribeUser";
import { Switch } from "../ui/switch";
import { toggleUserStatusAPI } from "../../services/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";


interface UsersTabProps {
  users: User[] | undefined;
  subscriptions: any[] | undefined;
  getSubscriptionStatusColor: (status: string) => string;
  formatDate: (date: string) => string;
  setSelectedUser: (user: User | null) => void;
  setShowUpdateUserModal: (show: boolean) => void;
  setShowDeleteUserModal: (show: boolean) => void;
}

const UsersTab: React.FC<UsersTabProps> = ({
  users,
  subscriptions,
  getSubscriptionStatusColor,
  formatDate,
  setSelectedUser,
  setShowUpdateUserModal,
  setShowDeleteUserModal,
}) => {
  const queryClient = useQueryClient();
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [selectedUserForSubscription, setSelectedUserForSubscription] = useState<User | null>(null);

  const { mutate: toggleUserStatus, isPending: togglingStatus } = useMutation({
    mutationFn: ({ user_id, is_active }: { user_id: string; is_active: boolean }) =>
      toggleUserStatusAPI(user_id, is_active),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to toggle user status");
    },
  });

  const handleToggleStatus = (user: User, newStatus: boolean) => {
    toggleUserStatus({ user_id: user.user_id, is_active: newStatus });
  };

  const hasActiveSubscription = (userId: string) => {
    return subscriptions?.some(sub =>
      sub.user_id === userId && sub.status === 'active'
    );
  };

  const handleSubscribeUser = (user: User) => {
    setSelectedUserForSubscription(user);
    setShowSubscribeModal(true);
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">User Management</h3>
        <div>
          <AddUser />
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-600">
            <tr>
              <th className="text-left p-4 text-gray-300">User</th>
              <th className="text-left p-4 text-gray-300">Email</th>
              <th className="text-left p-4 text-gray-300">Joined</th>
              <th className="text-left p-4 text-gray-300">Status</th>
              <th className="text-left p-4 text-gray-300">Active</th>
              <th className="text-left p-4 text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 && users.map((user) => {
              const userSub = subscriptions?.find(
                (sub) => sub.user_id === user.user_id
              );
              return (
                <tr
                  key={user.id}
                  className="border-b border-gray-600 hover:bg-gray-600/50"
                >
                  <td className="p-4">
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-gray-400 text-sm">
                        ID: {user.user_id.slice(0, 8)}...
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-white">{user.email}</td>
                  <td className="p-4 text-gray-400">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${user?.is_active ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                    >
                      {user?.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <Switch
                      id={`user-status-${user.user_id}`}
                      checked={user.is_active}
                      onCheckedChange={(newStatus) => handleToggleStatus(user, newStatus)}
                      disabled={togglingStatus}
                    />
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      {!hasActiveSubscription(user.id) ? (
                        <Button
                          size="sm"
                          onClick={() => handleSubscribeUser(user)}
                          className="bg-green-600 text-white flex items-center gap-2 justify-center hover:bg-green-700"
                        >
                          <CreditCard className="size-4" />
                          <span>Subscribe</span>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleSubscribeUser(user)}
                          className="bg-green-600 text-white flex items-center gap-2 justify-center hover:bg-green-700"
                          disabled
                        >
                          <CreditCard className="size-4" />
                          <span>Subscribed</span>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUpdateUserModal(true);
                        }}
                        className="bg-white text-black flex items-center gap-2 justify-center hover:bg-gray-100"
                      >
                        <span className="text-blue-500">
                          Edit
                        </span>
                        <Edit className="size-4 text-blue-500" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteUserModal(true);
                        }}
                        className="bg-white text-black flex items-center gap-2 justify-center hover:bg-gray-100"
                      >
                        <span className="text-red-500">
                          Delete
                        </span>
                        <Trash2 className="size-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {users && users.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Subscribe User Modal */}
      <SubscribeUser
        user={selectedUserForSubscription}
        open={showSubscribeModal}
        onOpenChange={setShowSubscribeModal}
      />
    </div>
  );
};

export default UsersTab;
