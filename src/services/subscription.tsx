import supabase from "../supabase";

export const subscriptionApi = async (payload: SubscriptionPayload) => {
  // Check if user profile is complete before allowing subscription
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User not authenticated");
  }

  const { data: userProfile, error: profileError } = await supabase
    .from('users')
    .select('name, email, is_active')
    .eq('user_id', user.id)
    .single();

  if (profileError || !userProfile) {
    throw new Error("User profile not found");
  }

  if (!userProfile.is_active || !userProfile.name || !userProfile.email) {
    throw new Error("Please complete your profile before subscribing");
  }

  const { error } = await supabase
    .from("subscriptions")
    .insert({
      user_id: payload.user_id,
      plan: payload.plan,
      status: payload.status,
      start_date: payload.start_date,
      end_date: payload.end_date,
      transaction_id: payload.transaction_id,
      amount: payload.amount,
    })
    .select()
    .single();
  if (error) {
    console.error("Error creating subscription:", error);
    throw new Error("Failed to create subscription");
  }
  return true;
};

export const fetchSubscription = async (id: string) => {

  if (!id) return null;
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", id)
    .in("status", ["active", "trial"])
    .order("end_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  return sub;
};

interface SubscriptionPayload {
  user_id: string;
  plan: string;
  status: string;
  start_date: string;
  end_date: string;
  transaction_id: string;
  amount: number;
}
