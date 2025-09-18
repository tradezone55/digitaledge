import { createAdminClient } from "@/supabase/adminServer";
import supabase from "../supabase";
import { Subscription } from "../types/subscription";
import { ProfileSetupFormData } from "@/schemas/auth";

// Admin login is now handled via magic link in auth.ts

interface AdminUserManagementPayload {
  user_id: string;
  action: "grant_access" | "revoke_access" | "extend_subscription";
  months?: number;
  reason?: string;
}

// AdminSubscriptionPayload interface removed as it's not currently used

interface UpdateUserPayload {
  user_id: string;
  name: string;
  email: string;
}

// Admin login is now handled via magic link authentication in auth.ts

const getAdminUser = async () => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('Admin not authenticated');
  }

  const { data: userProfileData, error: userProfileError } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', user.id)
    .single();
    
  if (userProfileError || !userProfileData) {
    throw new Error('Admin profile not found');
  }

  // Verify admin role
  if (userProfileData.role !== 'admin') {
    throw new Error('Access denied. Admin privileges required.');
  }

  return {
    admin: userProfileData,
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
  _payload: AdminUserManagementPayload
) => {
  // TODO: Implement admin user management functionality
};

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

// Generate unique transaction ID
const generateTransactionId = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ADMIN_${timestamp}_${random}`;
};

const createAdminSubscription = async (payload: {
  user_id: string;
  plan: string;
  start_date: string;
  end_date: string;
  amount: number;
  reason?: string;
}) => {
  // Verify admin authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('Admin not authenticated');
  }

  const { data: userProfileData, error: userProfileError } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', user.id)
    .single();
    
  if (userProfileError || !userProfileData) {
    throw new Error('Admin profile not found');
  }

  // Verify admin role
  if (userProfileData.role !== 'admin') {
    throw new Error('Access denied. Admin privileges required.');
  }

  // Verify target user exists
  const { data: targetUser, error: targetUserError } = await supabase
    .from('users')
    .select('*')
    .eq('id', payload.user_id)
    .maybeSingle();

  if (targetUserError || !targetUser) {
    throw new Error('Target user not found');
  }

  // Generate unique transaction ID
  const transaction_id = generateTransactionId();

  // Create subscription
  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: payload.user_id,
      plan: payload.plan,
      status: 'active',
      start_date: payload.start_date,
      end_date: payload.end_date,
      transaction_id: transaction_id,
      amount: payload.amount,
      admin_reason: payload.reason,
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating subscription:', error);
    throw new Error(error.message || 'Failed to create subscription');
  }

  return {
    subscription: data,
    success: true,
    message: 'Subscription created successfully',
  };
};

const adminLogout = async () => {
  return {
    success: true,
    message: "Admin logout successful",
  };
};





export const adminCreateUserAPI = async (payload: ProfileSetupFormData) => {
  const adminClient = createAdminClient();
  
  // Create user in auth with magic link
  const { data: { user }, error: authError } = await adminClient.auth.admin.createUser({
    email: payload.email,
    email_confirm: false, // User will need to verify email
  });
  
  if (authError || !user) {
    throw new Error(authError?.message || 'Failed to create user');
  }
  
  // Create profile
  const { data: userProfileData, error: userProfileError } = await supabase
    .from('users')
    .insert([{ 
      name: payload.name, 
      email: payload.email, 
      is_active: payload.is_active,
      role: payload.role,
      user_id: user.id,
    }])
    .select()
    .single();
  
  if (userProfileError) {
    // Clean up auth user if profile creation fails
    await adminClient.auth.admin.deleteUser(user.id);
    throw new Error(userProfileError?.message || 'Failed to create user profile');
  }
  
  return {
    user: userProfileData,
    success: true,
    message: 'User created successfully. They will receive a magic link to set up their account.',
  };
};

export {
  getAdminUser,
  getAllUsers,
  getAllSubscriptions,
  adminUserManagementAPI,
  updateUserAPI,
  deleteUserAPI,
  toggleUserStatusAPI,
  createAdminSubscription,
  adminLogout,
};
