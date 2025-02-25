import auth from '@/api/auth'
import EditProfile from './EditProfile'
import ChangePassword from './ChangePassword'
import Subscription from './Subscription'
import { cookies } from 'next/headers'

const Account = async () => {
  const accessToken = cookies().get('token')
  if (!accessToken) throw new Error('token not found')
  const me = await auth.me(accessToken?.value)

  return (
    <div className="px-10 pt-[5vh] w-[100%] overflow-x-hidden">
      <h1 className="text-[32px] text-[#219E99] font-bold">
        Account Information
      </h1>

      <div className="grid grid-rows-3 grid-cols-1 lg:grid-rows-2 lg:grid-flow-col lg:gap-x-10 lg:grid-cols-2 w-[100%] items-start gap-4 lg:flex-wrap pt-10 overflow-x-hidden">
        {/* edit profile */}
        <EditProfile
          user={{ email: me?.user.email, username: me?.user.username }}
        />

        {/* change password */}
        <ChangePassword />
        {/* user subscription */}
        {me.user.role !== 'admin' && (
          <Subscription user={me.user} accessToken={accessToken.value} />
        )}
      </div>
    </div>
  )
}

export default Account
