import { LogOutIcon } from 'lucide-react'
import useLogout from '../hooks/useLogout'
import Button from './ui/Button'
import { useTranslation } from 'react-i18next'


const LogoutUser = ({ className }: LogoutUserProps) => {
  const { t } = useTranslation('common')
  const { logout, isPending } = useLogout()
  return (
    <div>
      <Button
        onClick={() => logout()}
        disabled={isPending}
        className={`!text-orange-400 bg-orange-500/10 px-4 py-2 rounded font-semibold items-center gap-2 hover:bg-orange-500/20 ${className} hover:text-white flex items-center gap-2`}
        loading={isPending}
        loadingText={t('buttons.logoutLoading')}
      >
        <LogOutIcon className='size-4' />
        {t('buttons.logout')}
      </Button>
    </div>
  )
}

export default LogoutUser
interface LogoutUserProps {
  className?: string
}