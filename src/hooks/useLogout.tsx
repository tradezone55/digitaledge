import { useMutation } from "@tanstack/react-query";
import { logout } from "../services/auth";
import { useUserStore } from "../stores";
import { toast } from "react-toastify";
import { clearAllAppData } from "../utils/localStorage";

const useLogout = () => {
  const { clearUser } = useUserStore();
  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.message);
        clearUser();
        // Clear all localStorage data using utility function
        clearAllAppData();
        localStorage.clear();
        window.location.href = "https://hub.digitaledgeprep.com";
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to logout");
    },
  });
  return {
    logout: mutate,
    isPending,
  };
};

export default useLogout;
