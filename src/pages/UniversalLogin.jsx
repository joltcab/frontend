import React, { useState, useEffect } from "react";
import { joltcab } from "@/lib/joltcab-api";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, LogIn, Mail, Phone, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function UniversalLogin() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loginData, setLoginData] = useState({
    identifier: "",
    password: ""
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await joltcab.auth.me();
      if (user) {
        redirectToDashboard(user.role);
      }
    } catch (error) {
      // Not logged in
    }
  };

  const redirectToDashboard = (role) => {
    const dashboards = {
      user: "UserDashboard",
      driver: "DriverDashboard",
      corporate: "CorporateDashboard",
      hotel: "HotelDashboard",
      dispatcher: "DispatcherDashboard",
      partner: "PartnerDashboard",
      admin: "AdminPanel"
    };
    window.location.href = createPageUrl(dashboards[role] || "UserDashboard");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!loginData.identifier || !loginData.password) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('🔐 Attempting login for:', loginData.identifier);

      // Intentar login directo con joltcab
      await joltcab.auth.login(loginData.identifier, loginData.password);
      
      // Obtener usuario
      const user = await joltcab.auth.me();
      
      if (!user) {
        throw new Error('Could not get user info');
      }

      console.log('✅ Login successful. User role:', user.role);

      // Verificar estado de la cuenta
      if (user.status === 'suspended') {
        setMessage({ 
          type: 'error', 
          text: '❌ Your account has been suspended. Contact support for assistance.' 
        });
        await joltcab.auth.logout();
        setLoading(false);
        return;
      }

      if (user.status === 'pending' && user.role === 'driver') {
        setMessage({ 
          type: 'warning', 
          text: '⏳ Your driver account is pending verification. Redirecting...' 
        });
        setTimeout(() => {
          window.location.href = createPageUrl("CompleteVerification");
        }, 2000);
        return;
      }

      setMessage({ 
        type: 'success', 
        text: '✅ Login successful! Redirecting to your dashboard...' 
      });

      setTimeout(() => {
        redirectToDashboard(user.role);
      }, 1000);

    } catch (error) {
      console.error('❌ Login error:', error);
      
      let errorMsg = 'Invalid email or password';
      
      if (error.message.includes('Invalid login credentials')) {
        errorMsg = '❌ Invalid email or password. Please try again.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMsg = '❌ Please verify your email before logging in.';
      }
      
      setMessage({ 
        type: 'error', 
        text: errorMsg
      });
      setLoading(false);
    }
  };

  const getIdentifierIcon = () => {
    if (loginData.identifier.includes('@')) return Mail;
    if (/^\+?[\d\s\-\(\)]+$/.test(loginData.identifier)) return Phone;
    return Mail;
  };

  const IdentifierIcon = getIdentifierIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => window.location.href = createPageUrl("Home")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#15B46A] to-[#0F9456] rounded-full flex items-center justify-center mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Welcome Back
            </CardTitle>
            <div className="flex items-center justify-center gap-2 mt-2">
              <p className="text-gray-600">Sign in to your JoltCab account</p>
              <a 
                href="https://ihostcast.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-gray-400 font-medium hover:text-[#15B46A] transition-colors"
              >
                by iHOSTcast
              </a>
            </div>
          </CardHeader>

          <CardContent>
            {message.text && (
              <Alert className={`mb-6 ${
                message.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : message.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                    : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">Email or Phone Number</Label>
                <div className="relative">
                  <IdentifierIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="identifier"
                    type="text"
                    value={loginData.identifier}
                    onChange={(e) => setLoginData({...loginData, identifier: e.target.value})}
                    placeholder="your@email.com or +1234567890"
                    required
                    disabled={loading}
                    className="text-lg py-6 pl-11"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    className="text-lg py-6 pl-11 pr-11"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <a 
                  href={createPageUrl("ForgotPassword")}
                  className="text-sm text-[#15B46A] hover:text-[#0F9456] font-medium"
                >
                  Forgot password?
                </a>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-gradient-to-r from-[#15B46A] to-[#0F9456] hover:from-[#0F9456] hover:to-[#15B46A] text-white font-semibold shadow-lg py-6 text-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => toast.info('Google login coming soon')}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => toast.info('Apple login coming soon')}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => toast.info('Facebook login coming soon')}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a 
                  href={createPageUrl("Register")} 
                  className="text-[#15B46A] hover:text-[#0F9456] font-semibold"
                >
                  Sign Up
                </a>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                🔒 Your password is encrypted and secure
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}