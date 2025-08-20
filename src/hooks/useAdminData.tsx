import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getAllUsers, getAllSubscriptions } from "../services/admin";
import { Subscription } from "../types/subscription";

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: getAllUsers,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAdminSubscriptions = () => {
  return useQuery<Subscription[]>({
    queryKey: ["admin-subscriptions"],
    queryFn: getAllSubscriptions,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAdminStats = () => {
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useAdminUsers();

  const {
    data: subscriptions,
    isLoading: subsLoading,
    error: subsError,
    refetch: refetchSubscriptions,
  } = useAdminSubscriptions();

  const isLoading = usersLoading || subsLoading;
  const error = usersError || subsError;

  // Memoize calculations to prevent unnecessary re-renders
  const stats = useMemo(() => {
    const activeSubscriptions =
      subscriptions?.filter((sub) => sub.status === "active") || [];
    const totalRevenue =
      subscriptions?.reduce((sum, sub) => {
        const amount = parseFloat(sub.amount?.toString() || "0");
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0) || 0;

    const conversionRate = users?.length
      ? Math.round((activeSubscriptions.length / users.length) * 100)
      : 0;

    return {
      activeSubscriptions,
      totalRevenue,
      conversionRate,
    };
  }, [users, subscriptions]);

  return {
    users: users || [],
    subscriptions: subscriptions || [],
    activeSubscriptions: stats.activeSubscriptions,
    totalRevenue: stats.totalRevenue,
    conversionRate: stats.conversionRate,
    isLoading,
    error,
    refetchUsers,
    refetchSubscriptions,
  };
};
