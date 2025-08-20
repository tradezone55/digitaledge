// hooks/useSubscriptionStatus.js
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSubscription } from "../services/subscription";

export function useSubscriptionStatus() {
  const { data: subscription, isLoading } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: fetchSubscription,
  });

  const [status, setStatus] = useState({
    loading: true,
    access: false,
    daysLeft: 0,
    inGracePeriod: false,
    graceDaysLeft: 0,
  });

  useEffect(() => {
    const fetchStatus = async () => {
      if (!subscription) {
        setStatus({
          loading: false,
          access: false,
          daysLeft: 0,
          inGracePeriod: false,
          graceDaysLeft: 0,
        });
        return;
      }

      const now = new Date();
      const end = new Date(subscription?.end_date);

      // Get grace period from environment variable (default to 3 days)
      const gracePeriodDays = parseInt(
        import.meta.env.VITE_GRACE_PERIOD_DAYS || "3"
      );
      const graceEndDate = new Date(
        end.getTime() + gracePeriodDays * 24 * 60 * 60 * 1000
      );

      // Check if subscription is still active
      const isSubscriptionActive = now <= end;

      // Check if we're in grace period
      const isInGracePeriod = !isSubscriptionActive && now <= graceEndDate;

      // Overall access (active subscription OR grace period)
      const access = isSubscriptionActive || isInGracePeriod;

      // Calculate days left in subscription
      const daysLeft = isSubscriptionActive
        ? Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      // Calculate grace period days left
      const graceDaysLeft = isInGracePeriod
        ? Math.ceil(
            (graceEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          )
        : 0;

      setStatus({
        loading: false,
        access,
        daysLeft: access ? daysLeft : 0,
        inGracePeriod: isInGracePeriod,
        graceDaysLeft,
      });
    };

    if (!isLoading) {
      fetchStatus();
    }
  }, [subscription, isLoading]);

  console.log(status, subscription);
  return status;
}
