import React from "react";
import { Calendar, CreditCard, User } from "lucide-react";
import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { User as UserType } from "../../../types/subscription";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createAdminSubscription } from "../../../services/admin";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrAfter);

interface SubscribeUserProps {
  user: UserType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SubscriptionFormData {
  plan: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

const SUBSCRIPTION_PLANS = [
  { value: "PLAN_2M", label: "1 Month Plan", duration: 1 },
  { value: "PLAN_3M", label: "6 Month Plan", duration: 6 },
];

const SubscribeUser: React.FC<SubscribeUserProps> = ({
  user,
  open,
  onOpenChange,
}) => {
  const queryClient = useQueryClient();
  console.log(user, "subscribe user");
  const { mutate: createSubscription, isPending } = useMutation({
    mutationFn: createAdminSubscription,
    onSuccess: () => {
      toast.success("Subscription created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      handleClose();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create subscription");
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SubscriptionFormData>({
    defaultValues: {
      plan: "",
      startDate: "",
      endDate: "",
      reason: "",
    },
  });

  const watchedPlan = watch("plan");
  const watchedStartDate = watch("startDate");

  // Auto-calculate end date when plan or start date changes
  React.useEffect(() => {
    if (watchedPlan) {
      const plan = SUBSCRIPTION_PLANS.find(p => p.value === watchedPlan);
      if (plan) {
        // If no start date is set, default to today
        const today = dayjs().add(1, "day").format('YYYY-MM-DD');
        const startDate = watchedStartDate || today;
        if (!watchedStartDate) {
          setValue("startDate", today);
        }

        // Use dayjs to add months - it handles edge cases automatically
        const endDate = dayjs(startDate).add(plan.duration, 'month').format('YYYY-MM-DD');
        setValue("endDate", endDate);
      }
    }
  }, [watchedPlan, watchedStartDate, setValue]);

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = (data: SubscriptionFormData) => {
    if (!user) {
      toast.error("User not found");
      return;
    }

    const plan = SUBSCRIPTION_PLANS.find(p => p.value === data.plan);
    if (!plan) {
      toast.error("Invalid plan selected");
      return;
    }

    createSubscription({
      user_id: user.id,
      plan: data.plan,
      start_date: data.startDate,
      end_date: data.endDate,
      amount: 1, // Default amount as specified
      reason: data.reason || undefined,
    });
  };

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">
            Create Subscription
          </h3>
        </div>

        {/* User Info */}
        <div className="mb-4 p-3 bg-gray-700 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-300">User</span>
          </div>
          <p className="text-white font-medium">{user.name}</p>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Plan Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Subscription Plan *
            </label>
            <select
              {...register("plan", { required: "Please select a plan" })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a plan</option>
              {SUBSCRIPTION_PLANS.map((plan) => (
                <option key={plan.value} value={plan.value}>
                  {plan.label} ({plan.duration} month{plan.duration > 1 ? 's' : ''})
                </option>
              ))}
            </select>
            {errors.plan && (
              <p className="text-red-400 text-sm mt-1">{errors.plan.message}</p>
            )}
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Start Date *
            </label>
            <Input
              type="date"
              min={dayjs().format('YYYY-MM-DD')}
              {...register("startDate", {
                required: "Please select a start date",
                validate: (value) => {
                  if (!value) return true; // Let required validation handle empty values

                  const selectedDate = dayjs(value);
                  const today = dayjs().startOf('day');

                  return selectedDate.isSameOrAfter(today) || "Start date cannot be in the past";
                }
              })}
            />
            {errors.startDate && (
              <p className="text-red-400 text-sm mt-1">{errors.startDate.message}</p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              End Date *
            </label>
            <Input
              type="date"
              {...register("endDate", { required: "End date is required" })}
              readOnly
              className="bg-gray-600 cursor-not-allowed"
            />
            {errors.endDate && (
              <p className="text-red-400 text-sm mt-1">{errors.endDate.message}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              End date is automatically calculated based on the selected plan
            </p>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reason (optional)
            </label>
            <Input
              placeholder="Enter reason for subscription..."
              {...register("reason")}
            />
          </div>

          {/* Amount Display */}
          <div className="p-3 bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">Amount:</span>
              <span className="text-white font-semibold">$1.00</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Default amount as specified
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isPending}
              disabled={isPending}
              className="flex-1"
            >
              Create Subscription
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscribeUser;
