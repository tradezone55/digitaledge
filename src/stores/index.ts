
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { IUser } from '../types/user'

interface UserStore {
  user: IUser | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: IUser | null) => void
  setAuthenticated: (authenticated: boolean) => void
  setLoading: (loading: boolean) => void
  clearUser: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
      setLoading: (loading) => set({ isLoading: loading }),
      clearUser: () => set({ user: null, isAuthenticated: false, isLoading: false })
    }),
    {
      name: 'user-storage', // unique name for localStorage key
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }), // only persist user and isAuthenticated, not isLoading
    }
  )
)
