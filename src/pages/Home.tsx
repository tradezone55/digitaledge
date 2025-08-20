import AccessScreen from "../components/AccessScreen";
import CustomLoader from "../components/CustomLoader/page";
import UnAccessScreen from "../components/UnAccessScreen";
import { useSubscriptionStatus } from "../hooks/useSubscriptionStatus";

const Home = () => {
  const { loading, access, inGracePeriod, graceDaysLeft, daysLeft } =
    useSubscriptionStatus();

  if (loading) return <CustomLoader />;

  if (!access) {
    return <UnAccessScreen />;
  }

  return (
    <AccessScreen
      inGracePeriod={inGracePeriod}
      graceDaysLeft={graceDaysLeft}
      daysLeft={graceDaysLeft + daysLeft}
    />
  );
};

export default Home;
