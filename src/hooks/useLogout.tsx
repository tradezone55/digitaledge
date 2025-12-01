import { useMutation } from "@tanstack/react-query";
import { logout } from "../services/auth";
import { useUserStore } from "../stores";
import { toast } from "react-toastify";
import { clearAllAppData } from "../utils/localStorage";

// Prevent multiple logout toasts
let logoutToastId: number | string | null = null;

const useLogout = () => {
  const { clearUser } = useUserStore();
  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      if (data?.success) {
        // Dismiss previous toast if it exists
        if (logoutToastId) {
          toast.dismiss(logoutToastId);
        }
        // Show new toast and store its ID
        logoutToastId = toast.success(data.message, { toastId: 'logout-success' });
        clearUser();
        // Clear all localStorage data using utility function
        clearAllAppData();
        localStorage.clear();
        window.location.href = "https://hub.digitaledgeprep.com";
      }
    },
    onError: (error) => {
      // Dismiss previous toast if it exists
      if (logoutToastId) {
        toast.dismiss(logoutToastId);
      }
      // Show error toast and store its ID
      logoutToastId = toast.error(error.message || "Failed to logout", { toastId: 'logout-error' });
    },
  });
  return {
    logout: mutate,
    isPending,
  };
};

export default useLogout;
