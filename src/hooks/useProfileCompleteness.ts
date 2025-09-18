import { useQuery } from '@tanstack/react-query';
import { checkProfileCompleteness } from '../services/auth';

export const useProfileCompleteness = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['profileCompleteness'],
    queryFn: checkProfileCompleteness,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });

  const isProfileComplete = data?.isComplete;

  return {
    isProfileComplete,
    isLoading,
    user: data?.user,
    missingFields: data?.missingFields || [],
  };
};
