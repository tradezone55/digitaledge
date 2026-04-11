import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccessScreen from "../components/AccessScreen";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const proEmail = sessionStorage.getItem("pro_email");
    if (!proEmail) {
      navigate("/pro");
    }
  }, [navigate]);

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
