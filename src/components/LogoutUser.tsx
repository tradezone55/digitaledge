import { LogOutIcon } from 'lucide-react'
import useLogout from '../hooks/useLogout'
import Button from './ui/Button'


const LogoutUser = ({ className, redirectTo = "/" }: LogoutUserProps) => {
  const { logout, isPending } = useLogout(redirectTo)
  return (
    <div>
      <Button
        onClick={() => logout()}
        disabled={isPending}
        className={`!text-orange-400 bg-orange-500/10 px-4 py-2 rounded font-semibold items-center gap-2 hover:bg-orange-500/20 ${className} hover:text-white flex items-center gap-2`}
        loading={isPending}
        loadingText='Logging out...'
      >
        <LogOutIcon className='size-4' />
        Logout
      </Button>
    </div>
  )
}

export default LogoutUser
interface LogoutUserProps {
  className?: string
  redirectTo?: string
}