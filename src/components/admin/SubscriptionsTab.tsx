import React from "react";
import { Clock } from "lucide-react";
import Button from "../ui/Button";
import { User } from "../../types/subscription";

interface SubscriptionsTabProps {
  subscriptions: any[] | undefined;
  getSubscriptionStatusColor: (status: string) => string;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
  setSelectedUser: (user: User | null) => void;
  setActionType: (type: "grant" | "revoke" | "extend") => void;
  setShowUserModal: (show: boolean) => void;
}

const SubscriptionsTab: React.FC<SubscriptionsTabProps> = ({
  subscriptions,
  getSubscriptionStatusColor,
  formatDate,
  formatCurrency,
  setSelectedUser,
  setActionType,
  setShowUserModal,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">
        Subscription Management
      </h3>

      <div className="bg-gray-700 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-600">
            <tr>
              <th className="text-left p-4 text-gray-300">User</th>
              <th className="text-left p-4 text-gray-300">Plan</th>
              <th className="text-left p-4 text-gray-300">Amount</th>
              <th className="text-left p-4 text-gray-300">Status</th>
              <th className="text-left p-4 text-gray-300">Start Date</th>
              <th className="text-left p-4 text-gray-300">End Date</th>
              <th className="text-left p-4 text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions?.map((sub) => (
              <tr
                key={sub.id}
                className="border-b border-gray-600 hover:bg-gray-600/50"
              >
                <td className="p-4">
                  <div>
                    <p className="text-white font-medium">{sub.users.name}</p>
                    <p className="text-gray-400 text-sm">{sub.users.email}</p>
                  </div>
                </td>
                <td className="p-4 text-white">{sub.plan}</td>
                <td className="p-4 text-white">
                  {formatCurrency(Number(sub.amount))}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getSubscriptionStatusColor(
                      sub.status
                    )}`}
                  >
                    {sub.status}
                  </span>
                </td>
                <td className="p-4 text-gray-400">
                  {formatDate(sub.start_date)}
                </td>
                <td className="p-4 text-gray-400">
                  {formatDate(sub.end_date)}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {sub.status === "active" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setSelectedUser({
                            id: "",
                            user_id: sub.user_id,
                            email: sub.users.email,
                            name: sub.users.name,
                            role: "user",
                            created_at: "",
                          });
                          setActionType("extend");
                          setShowUserModal(true);
                        }}
                      >
                        <Clock className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscriptionsTab;
