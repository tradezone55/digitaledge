
import { useQuery } from '@tanstack/react-query'
import { getUser } from '../services/auth'
import { useUserStore } from '../stores'
import { useEffect } from 'react'



const useCurrentUser = () => {
  const { isAuthenticated, setUser } = useUserStore()
  const { data, isLoading, status } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getUser,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })


  useEffect(() => {
    if (data?.user && status === 'success') {
      setUser(data.user)
    }
  }, [data, status])




  return {
    currentUser: data,
    isLoading: isLoading,
    isAuthenticated,
  }
}

export default useCurrentUser