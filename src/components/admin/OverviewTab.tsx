import React from "react";
import {
  Users,
  TrendingUp,
  UserCheck,
  DollarSign,
} from "lucide-react";
import { User, Subscription } from "../../types/subscription";

interface OverviewTabProps {
  users: User[];
  subscriptions: Subscription[];
  activeSubscriptions: Subscription[];
  totalRevenue: number;
  conversionRate: number;
  getSubscriptionStatusColor: (status: string) => string;
  formatDate: (dateString: string) => string;
  formatCurrency: (amount: number) => string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  users,
  subscriptions,
  activeSubscriptions,
  totalRevenue,
  conversionRate,
  getSubscriptionStatusColor,
  formatDate,
  formatCurrency,
}) => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 rounded-lg p-6 text-center">
          <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-3xl font-bold text-white">{users?.length || 0}</div>
          <div className="text-gray-400">Total Users</div>
        </div>

        <div className="bg-gray-700 rounded-lg p-6 text-center">
          <UserCheck className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-3xl font-bold text-white">{activeSubscriptions.length}</div>
          <div className="text-gray-400">Active Subscriptions</div>
        </div>

        <div className="bg-gray-700 rounded-lg p-6 text-center">
          <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <div className="text-3xl font-bold text-white">{formatCurrency(totalRevenue)}</div>
          <div className="text-gray-400">Total Revenue</div>
        </div>

        <div className="bg-gray-700 rounded-lg p-6 text-center">
          <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <div className="text-3xl font-bold text-white">{conversionRate}%</div>
          <div className="text-gray-400">Conversion Rate</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Subscriptions</h3>
        <div className="space-y-3">
          {subscriptions?.slice(0, 5).map((sub) => (
            <div key={sub.id} className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
              <div>
                <p className="text-white font-medium">{sub.users.name}</p>
                <p className="text-gray-400 text-sm">{sub.users.email}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubscriptionStatusColor(sub.status)}`}>
                  {sub.status}
                </span>
                <p className="text-gray-400 text-sm mt-1">{formatDate(sub.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
