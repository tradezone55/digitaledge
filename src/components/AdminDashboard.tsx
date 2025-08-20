import React, { useState, useCallback } from "react";
import { Shield } from "lucide-react";
import OverviewTab from "./admin/OverviewTab";
import UsersTab from "./admin/UsersTab";
import SubscriptionsTab from "./admin/SubscriptionsTab";
import UpdateUser from "./admin/user/UpdateUser";
import DeleteUser from "./admin/user/DeleteUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { formatDate, formatCurrency } from "../utils/formatters";
import { adminUserManagementAPI } from "../services/admin";
import { useAdminStore } from "../stores/admin";
import { useAdminStats } from "../hooks/useAdminData";
import { User } from "../types/subscription";
import SearchBar from "./ui/SearchBar";
import TabNavigation from "./admin/TabNavigation";
import SkeletonLoader from "./admin/SkeletonLoader";
import ErrorUI from "./admin/ErrorUI";
import LogoutUser from "./LogoutUser";

const AdminDashboard: React.FC = () => {
  const { admin, clearAdmin } = useAdminStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "subscriptions"
  >("overview");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [actionType, setActionType] = useState<"grant" | "revoke" | "extend">(
    "grant"
  );
  const [actionMonths, setActionMonths] = useState(1);
  const [actionReason, setActionReason] = useState("");

  // Use React Query hooks with proper conditions
  const {
    users,
    subscriptions,
    activeSubscriptions,
    totalRevenue,
    conversionRate,
    isLoading,
    error,
    refetchUsers,
    refetchSubscriptions,
  } = useAdminStats();

  // User management mutation
  const { mutate: manageUser, isPending: managingUser } = useMutation({
    mutationFn: adminUserManagementAPI,
    onSuccess: () => {
      toast.success("User action completed successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
      setShowUserModal(false);
      setSelectedUser(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to perform user action");
    },
  });

  const getSubscriptionStatusColor = useCallback((status: string) => {
    switch (status) {
      case "active":
        return "bg-green-600 text-white";
      case "expired":
        return "bg-red-600 text-white";
      case "revoked":
        return "bg-gray-600 text-white";
      default:
        return "bg-yellow-600 text-white";
    }
  }, []);

  const handleLogout = useCallback(() => {
    clearAdmin();
    window.location.href = "/admin/login";
  }, [clearAdmin]);

  const handleRetry = useCallback(() => {
    refetchUsers();
    refetchSubscriptions();
  }, [refetchUsers, refetchSubscriptions]);

  if (!admin) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="text-center text-gray-400">
          <Shield className="w-12 h-12 mx-auto mb-4" />
          <p>Admin access required</p>
        </div>
      </div>
    );
  }

  // Show loading state with skeletons
  if (isLoading) {
    return <SkeletonLoader />;
  }

  // Show error state
  if (error) {
    return <ErrorUI handleRetry={handleRetry} />;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 ">
      {admin && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Admin Dashboard
            </h2>
            <p className="text-gray-400 text-sm">Welcome back, {admin.name}</p>
          </div>

        </div>
      )}

      {/* Search Bar */}
      <SearchBar />
      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* Overview Tab */}
      {activeTab === "overview" && (
        <OverviewTab
          users={users}
          subscriptions={subscriptions}
          activeSubscriptions={activeSubscriptions}
          totalRevenue={totalRevenue}
          conversionRate={conversionRate}
          getSubscriptionStatusColor={getSubscriptionStatusColor}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
        />
      )}
      {/* Users Tab */}
      {activeTab === "users" && (
        <UsersTab
          users={users}
          subscriptions={subscriptions}
          getSubscriptionStatusColor={getSubscriptionStatusColor}
          formatDate={formatDate}
          setSelectedUser={setSelectedUser}
          setShowUpdateUserModal={setShowUpdateUserModal}
          setShowDeleteUserModal={setShowDeleteUserModal}
        />
      )}

      {/* Subscriptions Tab */}
      {activeTab === "subscriptions" && (
        <SubscriptionsTab
          subscriptions={subscriptions}
          getSubscriptionStatusColor={getSubscriptionStatusColor}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          setSelectedUser={setSelectedUser}
          setActionType={setActionType}
          setShowUserModal={setShowUserModal}
        />
      )}

      {/* User Action Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">
              {actionType === "grant" && "Grant Access"}
              {actionType === "revoke" && "Revoke Access"}
              {actionType === "extend" && "Extend Subscription"}
            </h3>

            {selectedUser && (
              <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                <p className="text-white font-medium">{selectedUser.name}</p>
                <p className="text-gray-400 text-sm">{selectedUser.email}</p>
              </div>
            )}

            {actionType !== "revoke" && (
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
            )}

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
                onClick={() => setShowUserModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant={actionType === "revoke" ? "danger" : "primary"}
                // onClick={handleUserAction}
                loading={managingUser}
                disabled={managingUser}
                className="flex-1"
              >
                {actionType === "grant" && "Grant Access"}
                {actionType === "revoke" && "Revoke Access"}
                {actionType === "extend" && "Extend Subscription"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Update User Modal */}
      <UpdateUser
        user={selectedUser}
        open={showUpdateUserModal}
        onOpenChange={setShowUpdateUserModal}
      />

      {/* Delete User Modal */}
      <DeleteUser
        user={selectedUser}
        open={showDeleteUserModal}
        onOpenChange={setShowDeleteUserModal}
      />
    </div>
  );
};

export default AdminDashboard;
