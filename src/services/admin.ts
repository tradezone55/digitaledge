import supabase from "../supabase";
import { Subscription } from "../types/subscription";

interface AdminLoginPayload {
  email: string;
  password: string;
}

interface AdminUserManagementPayload {
  user_id: string;
  action: "grant_access" | "revoke_access" | "extend_subscription";
  months?: number;
  reason?: string;
}

interface AdminSubscriptionPayload {
  user_id: string;
  plan: string;
  months: number;
  amount: number;
}

interface UpdateUserPayload {
  user_id: string;
  name: string;
  email: string;
}

const adminLoginAPI = async (payload: AdminLoginPayload) => {
  let userAdminProfile = null;
  const { data, error } = await supabase.auth.signInWithPassword(payload);
  if (error || !data.user)
    throw new Error(error?.message || "User not Logged in");
  const { data: userProfileData, error: userProfileError } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", data.user.id)
    .single();
  if (userProfileError || !userProfileData)
    throw new Error(userProfileError?.message || "User not found");
  userAdminProfile = userProfileData;
  return {
    user: userAdminProfile,
    success: true,
    message: "Login successful",
  };
};

const getAdminUser = async () => {
  // For demo purposes, return hardcoded admin
  // In production, this should verify admin session
  const DEMO_ADMIN_EMAIL =
    import.meta.env.VITE_ADMIN_EMAIL || "admin@comptia.com";

  const admin = {
    id: "admin-1",
    email: DEMO_ADMIN_EMAIL,
    name: "System Administrator",
    role: "admin" as const,
    created_at: new Date().toISOString(),
  };

  return {
    admin,
    success: true,
    message: "Admin user fetched successfully",
  };
};

const getAllUsers = async () => {
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })
    .eq("role", "user");

  if (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
  return users || [];
};

const getAllSubscriptions = async () => {
  const { data: subscriptions, error } = await supabase
    .from("subscriptions")
    .select(
      `*,
        users (
          id,
          email,
          name
        )
      `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching subscriptions:", error);
    throw new Error("Failed to fetch subscriptions");
  }

  return subscriptions || ([] as Subscription[]);
};

const adminUserManagementAPI = async (
  payload: AdminUserManagementPayload
) => {};

const updateUserAPI = async (payload: UpdateUserPayload) => {
  const { data, error } = await supabase
    .from("users")
    .update({
      name: payload.name,
      email: payload.email,
    })
    .eq("user_id", payload.user_id)
    .select()
    .single();

  if (error) {
    console.error("Error updating user:", error);
    throw new Error(error.message || "Failed to update user");
  }

  return {
    user: data,
    success: true,
    message: "User updated successfully",
  };
};

const deleteUserAPI = async (user_id: string) => {
  // First delete related subscriptions
  const { error: subscriptionError } = await supabase
    .from("subscriptions")
    .delete()
    .eq("user_id", user_id);

  if (subscriptionError) {
    console.error("Error deleting user subscriptions:", subscriptionError);
    throw new Error(
      subscriptionError.message || "Failed to delete user subscriptions"
    );
  }

  // Then delete the user
  const { error: userError } = await supabase
    .from("users")
    .delete()
    .eq("user_id", user_id);

  if (userError) {
    console.error("Error deleting user:", userError);
    throw new Error(userError.message || "Failed to delete user");
  }

  return {
    success: true,
    message: "User deleted successfully",
  };
};

const toggleUserStatusAPI = async (user_id: string, is_active: boolean) => {
  const { data, error } = await supabase
    .from("users")
    .update({ is_active })
    .eq("user_id", user_id)
    .select()
    .single();

  if (error) {
    console.error("Error toggling user status:", error);
    throw new Error(error.message || "Failed to toggle user status");
  }

  return {
    user: data,
    success: true,
    message: `User ${is_active ? "activated" : "deactivated"} successfully`,
  };
};

const adminLogout = async () => {
  return {
    success: true,
    message: "Admin logout successful",
  };
};

export {
  adminLoginAPI,
  getAdminUser,
  getAllUsers,
  getAllSubscriptions,
  adminUserManagementAPI,
  updateUserAPI,
  deleteUserAPI,
  toggleUserStatusAPI,
  adminLogout,
};
