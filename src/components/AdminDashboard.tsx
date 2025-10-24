import React, { useState, useCallback } from "react";
import { Shield } from "lucide-react";
import OverviewTab from "./admin/OverviewTab";
import UsersTab from "./admin/UsersTab";
import SubscriptionsTab from "./admin/SubscriptionsTab";
import UpdateUser from "./admin/user/UpdateUser";
import DeleteUser from "./admin/user/DeleteUser";
import UserActionModal from "./admin/user/UserActionModal";
import { formatDate, formatCurrency } from "../utils/formatters";
import Button from "./ui/Button";
import { useAdminStore } from "../stores/admin";
import { useAdminStats } from "../hooks/useAdminData";
import { User } from "../types/subscription";
import SearchBar from "./ui/SearchBar";
import TabNavigation from "./admin/TabNavigation";
import SkeletonLoader from "./admin/SkeletonLoader";
import ErrorUI from "./admin/ErrorUI";
import { useTranslation } from "react-i18next";


const AdminDashboard: React.FC = () => {
  const { admin, clearAdmin } = useAdminStore();
  const { t } = useTranslation(['common']);
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "subscriptions"
  >("overview");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
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
          <p>{t('common:admin.accessRequired')}</p>
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
          <Button
            variant="secondary"
            onClick={handleLogout}
            className="text-sm"
          >
            Logout
          </Button>
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
          setShowUserModal={setShowUserModal}
        />
      )}

      {/* User Action Modal */}
      <UserActionModal
        open={showUserModal}
        onOpenChange={setShowUserModal}
        selectedUser={selectedUser}
        actionMonths={actionMonths}
        setActionMonths={setActionMonths}
        actionReason={actionReason}
        setActionReason={setActionReason}
      />

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
