import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Google OAuth Controller
 * Handles Google Sign-In authentication for admin panel
 */

// Initiate Google OAuth flow
export const googleAuth = async (req, res) => {
  try {
    const { role, callback } = req.query;
    
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_REDIRECT_URI = `${req.protocol}://${req.get('host')}/api/v1/auth/google/callback`;
    
    console.log('🔍 Environment check:', {
      hasClientId: !!GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: GOOGLE_REDIRECT_URI
    });
    
    if (!GOOGLE_CLIENT_ID) {
      return res.status(500).json({
        success: false,
        error: 'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET'
      });
    }

    // Build Google OAuth URL
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.append('client_id', GOOGLE_CLIENT_ID);
    googleAuthUrl.searchParams.append('redirect_uri', GOOGLE_REDIRECT_URI);
    googleAuthUrl.searchParams.append('response_type', 'code');
    googleAuthUrl.searchParams.append('scope', 'openid email profile');
    googleAuthUrl.searchParams.append('access_type', 'offline');
    googleAuthUrl.searchParams.append('prompt', 'consent');
    
    // Store role and callback in state parameter for verification
    const state = Buffer.from(JSON.stringify({ role, callback })).toString('base64');
    googleAuthUrl.searchParams.append('state', state);

    console.log('🔐 Initiating Google OAuth flow...');
    res.redirect(googleAuthUrl.toString());
    
  } catch (error) {
    console.error('❌ Google Auth initiation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initiate Google authentication'
    });
  }
};

// Handle Google OAuth callback
export const googleCallback = async (req, res) => {
  try {
    const { code, state, error } = req.query;

    if (error) {
      console.error('❌ Google OAuth error:', error);
      return res.redirect(`/Admin?error=${encodeURIComponent(error)}`);
    }

    if (!code || !state) {
      return res.redirect('/Admin?error=missing_code');
    }

    // Decode state to get role and callback
    const { role, callback } = JSON.parse(Buffer.from(state, 'base64').toString());

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const GOOGLE_REDIRECT_URI = `${req.protocol}://${req.get('host')}/auth/google/callback`;

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokens.access_token) {
      throw new Error('Failed to get access token');
    }

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const googleUser = await userInfoResponse.json();
    console.log('👤 Google user:', googleUser);

    // Find or create user
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        email: googleUser.email,
        first_name: googleUser.given_name || googleUser.name.split(' ')[0],
        last_name: googleUser.family_name || googleUser.name.split(' ').slice(1).join(' '),
        role: role || 'passenger',
        status: 'active',
        social_provider: 'google',
        social_id: googleUser.id,
        profile_picture: googleUser.picture,
        email_verified: googleUser.verified_email,
      });
      
      console.log('✅ Created new user from Google OAuth:', user.email);
    } else {
      // Update existing user with Google info
      user.social_provider = 'google';
      user.social_id = googleUser.id;
      user.profile_picture = googleUser.picture || user.profile_picture;
      user.email_verified = googleUser.verified_email || user.email_verified;
      await user.save();
      
      console.log('✅ Updated existing user from Google OAuth:', user.email);
    }

    // Verify role if admin is required
    if (role === 'admin' && user.role !== 'admin') {
      console.log('⚠️  Access denied: User is not an admin');
      return res.redirect('/Admin?error=not_admin');
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Google OAuth successful for:', user.email);

    // Redirect to callback URL with token
    const redirectUrl = new URL(callback || '/AdminPanel', `${req.protocol}://${req.get('host')}`);
    redirectUrl.searchParams.append('token', token);
    
    res.redirect(redirectUrl.toString());

  } catch (error) {
    console.error('❌ Google OAuth callback error:', error);
    res.redirect('/Admin?error=auth_failed');
  }
};

export default { googleAuth, googleCallback };
