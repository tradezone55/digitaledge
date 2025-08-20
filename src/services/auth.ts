
import supabase from "../supabase";


interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

interface UpdateUserPayload {
  email?: string;
  password?: string;
  name?: string;
}

const loginAPI = async (payload: LoginPayload) => {
  let userProfile = null
  const { data, error } = await supabase.auth.signInWithPassword(payload)
  if(error || !data.user) throw new Error(error?.message || 'User not Logged in')
  const { data: userProfileData, error: userProfileError } = await supabase.from('users').select('*').eq('user_id', data.user.id).single()
  if(userProfileError || !userProfileData) throw new Error(userProfileError?.message || 'User not found')
  userProfile = userProfileData
  return {
    user: userProfile,
    success: true,
    message: 'Login successful',
  }

}

const registerAPI = async (payload: RegisterPayload) => {
  let userProfile = null
  const { data: {user}, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
  })
  if(error || !user) throw new Error(error?.message || 'User not created')
 const { data: userProfileData, error: userProfileError } = await supabase.from('users').insert([
    { name: payload.name, email: payload.email, role: 'user', user_id: user.id },
  ]).select().single()
  if(userProfileError || !userProfileData) throw new Error(userProfileError?.message || 'User not created')
  userProfile = userProfileData

  console.log(userProfile, "userProfile");
  return {
    user: userProfile,
    success: true,
    message: 'Register successful',
  }
}


const getUser = async () => {
  let userProfile = null
  const { data, error } = await supabase.auth.getUser()
  if(error || !data.user) throw new Error(error?.message || 'User not found')
  const { data: userProfileData, error: userProfileError } = await supabase.from('users').select('*').eq('user_id', data.user.id).single()
  if(userProfileError || !userProfileData) throw new Error(userProfileError?.message || 'User not found')
  userProfile = userProfileData
  return {
    user: userProfile,
    success: true,
    message: 'User fetched successfully',
  }
}

const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if(error) return {
    success: false,
    message: error.message,
  }
  return {
    success: true,
    message: 'Logout successful',
  }
}

const updateUser = async (payload: UpdateUserPayload) => {
  const { data, error } = await supabase.auth.updateUser({
    email: payload.email,
    password: payload.password,
    data: {
      name: payload.name,
      role: 'user',
    }
  })
  if(error) return new Error(error.message)
  return data
}

export { loginAPI, registerAPI, logout, getUser, updateUser }
