import { useNavigate } from "react-router-dom";
import Logo from "./ui/Logo";
import LogoutUser from "./LogoutUser";
import { useSubscriptionStatus } from "../hooks/useSubscriptionStatus";

const UnAccessScreen = () => {
  const navigate = useNavigate();
  const { graceDaysLeft } = useSubscriptionStatus();

  const handleGetAccess = () => {
    return navigate("/home/checkout");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f16] to-[#1e293b] overflow-hidden">
      <div className="w-full justify-end flex lg:p-10 p-5">
        <LogoutUser className="w-[400px] flex items-center" />
      </div>
      <div className="h-auto   flex items-center  justify-center flex-col gap-6 overflow-hidden">
        <div className="flex items-center h-full justify-center ">
          <div className="bg-[#111827] rounded-3xl shadow-2xl p-10 text-center max-w-xs w-full text-[#e6edf3] border border-[#222a3a]">
            <div className="text-5xl mb-4">
              <span role="img" aria-label="lock">
                🔒
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-base text-[#94a3b8] mb-6">
              {graceDaysLeft > 0
                ? `Your subscription has expired, but you have ${graceDaysLeft} day${graceDaysLeft !== 1 ? "s" : ""
                } left to renew and maintain access.`
                : "Your free trial or subscription has ended. Please subscribe to continue using the app."}
            </p>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 font-semibold text-base shadow-md transition-colors duration-200"
              onClick={handleGetAccess}
            >
              {graceDaysLeft > 0 ? "Renew Subscription" : "Subscribe Now"}
            </button>
          </div>
        </div>
        <footer className="text-xs text-gray-500 text-center gap-1">
          Powered by <Logo size="md" />
        </footer>
      </div>
    </div>
  );
};

export default UnAccessScreen;
