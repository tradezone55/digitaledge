import { useMutation } from "@tanstack/react-query";
import { subscriptionApi } from "../services/subscription";
import { toast } from "react-toastify";

const useAddSubscription = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: subscriptionApi,
    onSuccess: (data) => {
      if (data) {
        toast.success("Subscription added successfully!");
      }
    },
  });
  return {
    mutate,
    isPending,
  };
};

export default useAddSubscription;
