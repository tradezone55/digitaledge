import { Activity, Calendar, Users } from "lucide-react";

const TabNavigation = ({ activeTab, setActiveTab }: TabNavigationProps) => {
  return (
    <div className="flex space-x-1 mb-6 bg-gray-700 rounded-lg p-1">
      {[
        { id: "overview", label: "Overview", icon: Activity },
        { id: "users", label: "Users", icon: Users },
        { id: "subscriptions", label: "Subscriptions", icon: Calendar },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <tab.icon className="w-4 h-4" />
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
interface TabNavigationProps {
  setActiveTab: (id: TabStatus) => void;
  activeTab: TabStatus;
}

type TabStatus = "overview" | "users" | "subscriptions";
