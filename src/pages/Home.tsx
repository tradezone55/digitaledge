import AccessScreen from "../components/AccessScreen";
import CustomLoader from "../components/CustomLoader/page";
import UnAccessScreen from "../components/UnAccessScreen";
import ProfileSetupModal from "../components/ProfileSetupModal";
import { useSubscriptionStatus } from "../hooks/useSubscriptionStatus";
import { useProfileCompleteness } from "../hooks/useProfileCompleteness";

const Home = () => {
  const { loading, access, inGracePeriod, graceDaysLeft, daysLeft } =
    useSubscriptionStatus();
  const { isProfileComplete, isLoading: profileLoading } = useProfileCompleteness();

  // Show loading while checking profile completeness
  if (loading || profileLoading) return <CustomLoader />;

  // If profile is not complete, show modal and prevent closing
  if (!isProfileComplete) {
    return (
      <>
        <AccessScreen
          inGracePeriod={inGracePeriod}
          graceDaysLeft={graceDaysLeft}
          daysLeft={graceDaysLeft + daysLeft}
        />
        <ProfileSetupModal
          open={true}
          closable={false}
          onOpenChange={() => {
            // Prevent closing the modal - do nothing
          }}
          onComplete={() => {
            // Profile setup completed successfully
            window.location.reload(); // Reload to refresh user data
          }}
        />
      </>
    );
  }

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
