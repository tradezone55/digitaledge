
import supabase from "../supabase";

interface MagicLinkPayload {
  email: string;
}

// Common school/institutional email domains that might have delivery issues
const INSTITUTIONAL_DOMAINS = [
  '.edu', '.ac.', '.school.', '.university.', '.college.',
  '.k12.', '.schools.', '.district.', '.gov'
];

// Email providers known to have magic link issues
const PROBLEMATIC_EMAIL_PROVIDERS = [
  'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
  'office365.com', 'microsoft.com'
];

// Check if email is from an institutional domain
const isInstitutionalEmail = (email: string): boolean => {
  const domain = email.toLowerCase().split('@')[1] || '';
  return INSTITUTIONAL_DOMAINS.some(institutionalDomain => 
    domain.includes(institutionalDomain)
  );
};

// Check if email is from a provider known to have magic link issues
const isProblematicEmailProvider = (email: string): boolean => {
  const domain = email.toLowerCase().split('@')[1] || '';
  return PROBLEMATIC_EMAIL_PROVIDERS.some(provider => 
    domain.includes(provider)
  );
};

interface ProfileSetupPayload {
  name: string;
  email: string;
}

const sendMagicLink = async (payload: MagicLinkPayload) => {
  // Check if Supabase is properly configured
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_KEY) {
    throw new Error('Supabase configuration is missing. Please check your environment variables.');
  }
  
  // Check if APP_URL is configured
  if (!import.meta.env.VITE_APP_URL) {
    throw new Error('Application URL is not configured. Please set VITE_APP_URL in your environment variables.');
  }

  // Check if this is an institutional email or problematic provider and provide helpful guidance
  if (isInstitutionalEmail(payload.email)) {
    console.warn(`Institutional email detected: ${payload.email}. This may have delivery issues.`);
  }
  
  if (isProblematicEmailProvider(payload.email)) {
    console.warn(`Problematic email provider detected: ${payload.email}. Magic links may not work properly.`);
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: payload.email,
      options: {
        emailRedirectTo: `${import.meta.env.VITE_APP_URL}/auth/callback`,
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
      } else if (error.message.includes('Email link is invalid') || error.message.includes('smtp')) {
        throw new Error('Email service is not properly configured. Please contact support.');
      } else if (error.status === 500 || error.message.includes('unexpected_failure')) {
        throw new Error('Unable to send email. Please check your email configuration in Supabase or contact support.');
      } else if (error.message.includes('blocked') || error.message.includes('domain')) {
        throw new Error('This email domain may be blocked. Please try using a personal email address (Gmail, Yahoo, etc.) or contact support.');
      } else if (error.message.includes('delivery') || error.message.includes('bounce')) {
        throw new Error('Unable to deliver email to this address. Please check your email address or try a different email provider.');
      } else {
        throw new Error(`Authentication error: ${error.message}`);
      }
    }
    
    // Verify that data exists (successful response)
    if (!data) {
      throw new Error('No response received from authentication service. Please try again.');
    }
    
    // Provide different messages based on email type
    let message = 'Magic link sent to your email! Please check your inbox and click the link to sign in.';
    
    if (isProblematicEmailProvider(payload.email)) {
      message = 'Magic link sent to your email! IMPORTANT: If you\'re using Outlook/Hotmail, please check your spam folder and click the link immediately. Outlook sometimes blocks or previews these links, making them expire quickly. If the link doesn\'t work, try using Gmail or another email provider.';
    } else if (isInstitutionalEmail(payload.email)) {
      message = 'Magic link sent to your email! Please check your inbox, spam folder, and junk mail. If you don\'t receive it within 5 minutes, try using a personal email address (Gmail, Yahoo, etc.) as school emails sometimes block authentication emails.';
    }

    return {
      success: true,
      message,
    };
  } catch (err) {
    console.error('Magic link send error:', err);
    
    // If it's already an Error object with a message, rethrow it
    if (err instanceof Error) {
      throw err;
    }
    
    // Handle unexpected error formats
    throw new Error('An unexpected error occurred. Please try again or contact support.');
  }
};

const sendAdminMagicLink = async (payload: MagicLinkPayload) => {
  // Check if Supabase is properly configured
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_KEY) {
    throw new Error('Supabase configuration is missing. Please check your environment variables.');
  }
  
  const redirectUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
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
      } else if (error.message.includes('Email link is invalid') || error.message.includes('smtp')) {
        throw new Error('Email service is not properly configured. Please contact support.');
      } else if (error.status === 500 || error.message.includes('unexpected_failure')) {
        throw new Error('Unable to send email. Please check your email configuration in Supabase or contact support.');
      } else if (error.message.includes('blocked') || error.message.includes('domain')) {
        throw new Error('This email domain may be blocked. Please try using a personal email address (Gmail, Yahoo, etc.) or contact support.');
      } else if (error.message.includes('delivery') || error.message.includes('bounce')) {
        throw new Error('Unable to deliver email to this address. Please check your email address or try a different email provider.');
      } else {
        throw new Error(`Authentication error: ${error.message}`);
      }
    }
    
    // Verify that data exists (successful response)
    if (!data) {
      throw new Error('No response received from authentication service. Please try again.');
    }
    
    return {
      success: true,
      message: 'Admin magic link sent to your email! Please check your inbox and click the link to access the admin dashboard.',
    };
  } catch (err) {
    console.error('Admin magic link send error:', err);
    
    // If it's already an Error object with a message, rethrow it
    if (err instanceof Error) {
      throw err;
    }
    
    // Handle unexpected error formats
    throw new Error('An unexpected error occurred. Please try again or contact support.');
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
  let isNewUser = false;
  
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
    isNewUser = true;
  }

  // If this is a new user, create a 60-day free trial subscription
  if (isNewUser) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 60); // Add 60 days

    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert([{
        user_id: userProfile.id,
        plan: 'trial',
        status: 'trial',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        transaction_id: 'TRIAL-' + userProfile.id.substring(0, 8),
        amount: 0,
        admin_reason: 'Automatic 60-day free trial for new user registration',
      }]);

    if (subscriptionError) {
      console.error('Error creating trial subscription:', subscriptionError);
      // Don't throw error here - user profile was created successfully
      // We can handle trial creation failure gracefully
    }
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
  
  // Check if profile is complete: has name, email, is_active=true, and role='user'
  const isComplete = missingFields.length === 0 && 
    userProfileData.is_active === true && 
    userProfileData.role === 'user';
  
  return {
    isComplete,
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

const verifyOTP = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw new Error('User not authenticated');
    }

    // Check if user exists in our database
    const { data: userProfileData, error: userProfileError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', data.user.id)
      .maybeSingle();

    if (userProfileError && userProfileError.code !== 'PGRST116') {
      throw new Error(userProfileError.message);
    }

    // If user doesn't exist in our database, they need to create a profile
    if (!userProfileData) {
      return {
        success: true,
        needsProfile: true,
        user: {
          id: data.user.id,
          email: data.user.email || '',
          name: '',
          role: 'user',
          is_active: true,
          user_id: data.user.id,
        },
        message: 'Please complete your profile setup',
      };
    }

    // Check if profile is complete
    const missingFields = [];
    if (!userProfileData.name) missingFields.push('name');
    if (!userProfileData.email) missingFields.push('email');

    const needsProfile = missingFields.length > 0 || 
      userProfileData.is_active !== true || 
      userProfileData.role !== 'user';

    if (needsProfile) {
      return {
        success: true,
        needsProfile: true,
        user: userProfileData,
        message: 'Please complete your profile setup',
      };
    }

    return {
      success: true,
      needsProfile: false,
      user: userProfileData,
      message: 'Authentication successful',
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Authentication failed');
  }
};


export { sendMagicLink, sendAdminMagicLink, setupProfile, logout, getUser, checkProfileCompleteness, checkUserStatus, verifyOTP };
