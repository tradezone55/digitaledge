import { useMutation } from "@tanstack/react-query";
import { logout } from "../services/auth";
import { useUserStore } from "../stores";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { clearAllAppData } from "../utils/localStorage";

const useLogout = (redirectTo = "/") => {
  const navigate = useNavigate();
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
        navigate(redirectTo, { replace: true });
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
