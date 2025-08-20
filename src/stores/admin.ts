import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Admin {
  id: string
  email: string
  name: string
  role: 'admin'
  created_at: string
}

interface AdminState {
  admin: Admin | null
  isAuthenticated: boolean
  isLoading: boolean
  setAdmin: (admin: Admin) => void
  setAuthenticated: (status: boolean) => void
  setLoading: (loading: boolean) => void
  clearAdmin: () => void
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,
      isLoading: false,
      setAdmin: (admin) => set({ admin, isAuthenticated: true }),
      setAuthenticated: (status) => set({ isAuthenticated: status }),
      setLoading: (loading) => set({ isLoading: loading }),
      clearAdmin: () => set({ admin: null, isAuthenticated: false, isLoading: false }),
    }),
    {
      name: 'admin-storage',
      partialize: (state) => ({ 
        admin: state.admin, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)
