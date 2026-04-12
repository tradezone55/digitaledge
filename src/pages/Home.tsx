import AccessScreen from "../components/AccessScreen";

const Home = () => {
  return (
    <AccessScreen
      inGracePeriod={false}
      graceDaysLeft={0}
      daysLeft={0}
      isTrial={false}
    />
  );
};

export default Home;
