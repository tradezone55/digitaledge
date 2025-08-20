import supabase from "../supabase";

export const subscriptionApi = async (payload: SubscriptionPayload) => {
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

export const fetchSubscription = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
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
