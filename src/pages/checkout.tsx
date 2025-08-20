import { useEffect, useState } from "react";
import Logo from "../components/ui/Logo";
import useAddSubscription from "../hooks/useAddSubscription";
import useCurrentUser from "../hooks/useCurrentUser";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AMOUNT_1 = Number(import.meta.env.VITE_BASIC_PLAN_AMOUNT);
const AMOUNT_2 = Number(import.meta.env.VITE_ADVANCED_PLAN_AMOUNT);
const MONTH_1 = import.meta.env.VITE_BASIC_PLAN_MONTH;
const MONTH_2 = import.meta.env.VITE_ADVANCED_PLAN_MONTH;
export default function CheckoutPage() {
  const { mutate } = useAddSubscription();
  const { currentUser } = useCurrentUser();
  const user = currentUser?.user;

  console.log(AMOUNT_1, AMOUNT_2, MONTH_1, MONTH_2);

  const PLAN_MAP = {
    PLAN_2M: {
      label: `${MONTH_1} Access`,
      amount: AMOUNT_1,
      months: MONTH_1,
    },
    PLAN_3M: {
      label: `${MONTH_2} Access`,
      amount: AMOUNT_2,
      months: MONTH_2,
    },
  };

  const navigate = useNavigate()

  const [selectedPlan, setSelectedPlan] =
    useState<keyof typeof PLAN_MAP>("PLAN_2M");
  const [isPayPalLoaded, setIsPayPalLoaded] = useState(false);

  const loadPayPalScript = () => {
    if (document.getElementById("paypal-sdk")) {
      // Script already exists, check if PayPal is loaded
      if (window.paypal && window.paypal.FUNDING) {
        setIsPayPalLoaded(true);
      }
      return;
    }
    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = `${import.meta.env.VITE_PAYPAL_URL}`;
    script.async = true;
    script.onload = () => {
      if (window.paypal && window.paypal.FUNDING) {
        setIsPayPalLoaded(true);
        renderButtons("#paypal-btn", window.paypal.FUNDING.PAYPAL);
        if (window.paypal.FUNDING && window.paypal.FUNDING.CARD) {
          renderButtons("#card-btn", window.paypal.FUNDING.CARD);
        } else {
          const cardFallback = document.getElementById("card-fallback");
          if (cardFallback) {
            cardFallback.style.display = "block";
          }
        }
      }
    };
    document.body.appendChild(script);
  };

  const clearButtonContainer = (target: string) => {
    const container = document.querySelector(target);
    if (container) {
      container.innerHTML = "";
    }
  };

  const renderButtons = (target: string, fundingSource: any) => {
    if (!window.paypal) return;

    if (!window.paypal || !window.paypal.Buttons) return;

    // Clear the container before rendering new buttons
    clearButtonContainer(target);

    window.paypal
      .Buttons({
        fundingSource,
        style: {
          layout: "vertical",
          shape: "rect",
          label:
            fundingSource === window.paypal?.FUNDING?.PAYPAL ? "paypal" : "pay",
        },
        createOrder: (_: any, actions: any) => {
          const plan = PLAN_MAP[selectedPlan as keyof typeof PLAN_MAP];
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: plan.label,
                amount: { currency_code: "USD", value: plan.amount },
              },
            ],
          });
        },
        onApprove: (_: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            const status =
              details.status ||
              details.purchase_units?.[0]?.payments?.captures?.[0]?.status;
            const startDate = new Date();
            const endDate = new Date();
            const plan = PLAN_MAP[selectedPlan as keyof typeof PLAN_MAP];

            // Calculate end date based on selected plan
            const monthsToAdd =
              selectedPlan === "PLAN_2M"
                ? parseInt(MONTH_1)
                : parseInt(MONTH_2);
            endDate.setMonth(endDate.getMonth() + monthsToAdd);

            mutate({
              user_id: user?.id!!,
              plan: selectedPlan,
              status: "active",
              start_date: startDate.toISOString(),
              end_date: endDate.toISOString(),
              transaction_id: details.id,
              amount: plan.amount,
            });
            toast.success(`${user?.name} Subscription added successfully`);
            navigate("/home");
          });
        },
        onError: (err: any) => {
          console.error(err);
          toast.error("Payment error in Sandbox demo. See console for details.");
        },
      })
      .render(target)
      .catch(() => {
        if (target === "#card-btn") {
          const cardFallback = document.getElementById("card-fallback");
          if (cardFallback) {
            cardFallback.style.display = "block";
          }
        }
      });
  };

  useEffect(() => {
    loadPayPalScript();
  }, []); // Only run once on mount

  useEffect(() => {
    // Re-render buttons when selectedPlan changes and PayPal is loaded
    if (isPayPalLoaded && window.paypal && window.paypal.FUNDING) {
      renderButtons("#paypal-btn", window.paypal.FUNDING.PAYPAL);
      if (window.paypal.FUNDING && window.paypal.FUNDING.CARD) {
        renderButtons("#card-btn", window.paypal.FUNDING.CARD);
      } else {
        const cardFallback = document.getElementById("card-fallback");
        if (cardFallback) {
          cardFallback.style.display = "block";
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlan, isPayPalLoaded]);
  return (
    <div className=" lg:p-40 p-4 text-[#e6edf3] font-sans bg-[#0b0f16] min-h-screen">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-white">
          Secure Checkout — <Logo size="sm" />
        </h1>
        <p className="text-sm text-white">
          Secure checkout with PayPal.
          <br />
          You'll be redirected to PayPal to complete payment. After success,
          <span className="text-blue-400 mx-1">
            you'll have access to the test.
          </span>
          <br />

        </p>
        <p className="text-white">
          If you have any issues, please contact us at <a href="mailto:support@digitaledgeprep.com" className="text-orange-400">support@digitaledgeprep.com</a>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 py-4">
        {Object.entries(PLAN_MAP).map(([key, plan]) => (
          <label
            key={key}
            className="bg-[#111827] border border-gray-800 rounded-xl p-5 shadow-lg"
          >
            <h2 className="text-xl font-medium mb-1">{plan.label}</h2>
            <div className="text-2xl font-bold mb-1">${plan.amount}</div>
            <p className="text-sm text-gray-400 mb-2">
              {key === "PLAN_2M"
                ? "Best for quick, focused exam prep."
                : "Most popular — extra runway for busy schedules."}
            </p>
            <ul className="text-sm space-y-1 mb-3 leading-relaxed">
              <li>• Full tester access</li>
              <li>• Updates included</li>
              <li>
                •{" "}
                {key === "PLAN_2M" ? "Email support" : "Priority email support"}
              </li>
            </ul>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="radio"
                name="plan"
                value={key}
                checked={selectedPlan === key}
                onChange={() => setSelectedPlan(key as keyof typeof PLAN_MAP)}
                className="w-4 h-4"
              />
              <span className="text-sm capitalize">Select {plan.months}</span>
            </div>
          </label>
        ))}
      </div>

      <div className="text-sm text-gray-300 mb-4">Pay with</div>
      <div className="grid gap-4 mb-4">
        <div id="paypal-btn" />
        <div id="card-btn" />
        <div
          id="card-fallback"
          className="text-sm text-gray-400"
          style={{ display: "none" }}
        >
          Card checkout isn’t available in your region/account config yet. Your
          account may need Advanced Cards enabled.
        </div>
      </div>

      <div className="text-sm text-gray-400 mb-6">
        You’ll be redirected to PayPal to complete payment. After success,
        you’ll see a Sandbox success alert (no real charge).
      </div>
      <footer className="text-xs text-gray-500 flex items-center gap-2">
        Powered by <Logo size="sm" />
      </footer>
    </div>
  );
}
