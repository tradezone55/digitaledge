
import supabase from "../supabase";

interface MagicLinkPayload {
  email: string;
}

interface ProfileSetupPayload {
  name: string;
  email: string;
}

const sendMagicLink = async (payload: MagicLinkPayload) => {
  // Check if Supabase is properly configured
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_KEY) {
    throw new Error('Supabase configuration is missing. Please check your environment variables.');
  }
  
  const redirectUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: payload.email,
      options: {
        emailRedirectTo: `${redirectUrl}/auth/callback`,
        shouldCreateUser: true
      },
    });
    
    if (error) {
      console.error('Magic link error:', error);
      
      // Provide more specific error messages
      if (error.message.includes('Invalid email')) {
        throw new Error('Please enter a valid email address.');
      } else if (error.message.includes('rate limit')) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      } else if (error.message.includes('disabled')) {
        throw new Error('Email authentication is not enabled. Please contact support.');
      } else {
        throw new Error(`Authentication error: ${error.message}`);
      }
    }
    
    return {
      success: true,
      message: 'Magic link sent to your email! Please check your inbox and click the link to sign in.',
    };
  } catch (err) {
    console.error('Magic link send error:', err);
    throw err;
  }
};

const sendAdminMagicLink = async (payload: MagicLinkPayload) => {
  // Check if Supabase is properly configured
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_KEY) {
    throw new Error('Supabase configuration is missing. Please check your environment variables.');
  }
  
  const redirectUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: payload.email,
      options: {
        emailRedirectTo: `${redirectUrl}/admin/auth/callback`,
        shouldCreateUser: false // Don't create new users for admin login
      },
    });
    
    if (error) {
      console.error('Admin magic link error:', error);
      
      // Provide more specific error messages
      if (error.message.includes('Invalid email')) {
        throw new Error('Please enter a valid email address.');
      } else if (error.message.includes('rate limit')) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      } else if (error.message.includes('disabled')) {
        throw new Error('Email authentication is not enabled. Please contact support.');
      } else {
        throw new Error(`Authentication error: ${error.message}`);
      }
    }
    
    return {
      success: true,
      message: 'Admin magic link sent to your email! Please check your inbox and click the link to access the admin dashboard.',
    };
  } catch (err) {
    console.error('Admin magic link send error:', err);
    throw err;
  }
};

const setupProfile = async (payload: ProfileSetupPayload) => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  // Check if user already exists
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw new Error(fetchError.message);
  }

  let userProfile;
  
  if (existingUser) {
    // Update existing user
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        name: payload.name,
        email: payload.email,
        is_active: true,
        role: 'user',
      })
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (updateError) throw new Error(updateError.message);
    userProfile = updatedUser;
  } else {
    // Create new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{
        name: payload.name,
        email: payload.email,
        role: 'user',
        user_id: user.id,
        is_active: true,
      }])
      .select()
      .single();
    
    if (insertError) throw new Error(insertError.message);
    userProfile = newUser;
  }

  return {
    user: userProfile,
    success: true,
    message: 'Profile setup successful',
  };
};


const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error(error?.message || 'User not found');
  
  const { data: userProfileData, error: userProfileError } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', data.user.id)
    .maybeSingle();
    
  if (userProfileError || !userProfileData) throw new Error(userProfileError?.message || 'User not found');
  
  return {
    user: userProfileData,
    success: true,
    message: 'User fetched successfully',
  };
};

const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) return {
    success: false,
    message: error.message,
  };
  return {
    success: true,
    message: 'Logout successful',
  };
};

const checkProfileCompleteness = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error(error?.message || 'User not found');
  
  const { data: userProfileData, error: userProfileError } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', data.user.id)
    .eq('is_active', true)
    .single();
    
  if (userProfileError) {
    // User doesn't exist in our database yet
    return {
      isComplete: false,
      user: null,
      missingFields: ['name', 'email'],
    };
  }
  
  const missingFields = [];
  if (!userProfileData.name) missingFields.push('name');
  if (!userProfileData.email) missingFields.push('email');
  
  return {
    isComplete: missingFields.length === 0,
    user: userProfileData,
    missingFields,
  };
};

const checkUserStatus = async () => {
  try {
    const { data, error } = await supabase.auth.getUser()
    if(error || !data.user) return { isActive: false, shouldLogout: true }
    
    const { data: userProfileData, error: userProfileError } = await supabase.from('users').select('is_active').eq('user_id', data.user.id).maybeSingle()
    if(userProfileError || !userProfileData) return { isActive: false, shouldLogout: true }
    
    if (!userProfileData.is_active) {
      await supabase.auth.signOut()
      return { isActive: false, shouldLogout: true }
    }
    
    return { isActive: true, shouldLogout: false }
  } catch {
    return { isActive: false, shouldLogout: true }
  }
}


export { sendMagicLink, sendAdminMagicLink, setupProfile, logout, getUser, checkProfileCompleteness, checkUserStatus };
