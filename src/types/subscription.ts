

export interface User {
  id: string;
  user_id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  is_active: boolean;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: string;
  status: string;
  start_date: string;
  end_date: string;
  transaction_id: string;
  amount: number;
  admin_reason?: string;
  created_at: string;
  users: {
    id: string;
    email: string;
    name: string;
  };
}

export interface AdminUserManagementPayload {
  user_id: string;
  action: 'grant_access' | 'revoke_access' | 'extend_subscription';
  months?: number;
  reason?: string;
}

export interface AdminSubscriptionPayload {
  user_id: string;
  plan: string;
  months: number;
  amount: number;
}
