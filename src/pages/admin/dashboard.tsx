import React from "react";
import { Shield } from "lucide-react";
import { useAdminStore } from "../../stores/admin";
import AdminDashboard from "../../components/AdminDashboard";
import LogoutUser from "@/components/LogoutUser";

const AdminDashboardPage: React.FC = () => {
  const { admin } = useAdminStore();




  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f16] to-[#1e293b]">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-500 mr-3" />
              <h1 className="text-xl font-bold text-white">
                CompTIA Admin Panel
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-white">{admin?.name}</p>
                <p className="text-xs text-gray-400">{admin?.email}</p>
              </div>
              <LogoutUser redirectTo="/admin/auth/login" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminDashboard />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-400">Admin Panel v1.0.0</span>
            </div>
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} CompTIA Network+ Testing System
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboardPage;
