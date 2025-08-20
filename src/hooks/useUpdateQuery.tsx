import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";

export const useUpdateQuery = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const updateQueryParams = useCallback(
    (newParams: Record<string, string>) => {
      const currentParams = new URLSearchParams(location.search);

      for (const [key, value] of Object.entries(newParams)) {
        if (value === "" || value == "all") {
          delete newParams[key]; // Use delete to remove the key from newParams
          currentParams.delete(key); // Delete the parameter if the value is empty
        } else {
          currentParams.set(key, value); // Set or update the parameter if it has a value
        }
      }

      // Update the URL without a page reload
      navigate(`${location.pathname}?${currentParams.toString()}`, {
        replace: true,
      });
    },
    [navigate, location.pathname, location.search]
  );

  return updateQueryParams;
};
