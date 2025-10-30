import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await base44.auth.me();
      
      if (user && user.role === 'admin') {
        window.location.href = createPageUrl("AdminPanel");
      } else if (user) {
        setMessage({ 
          type: 'error', 
          text: 'Access denied. Admin privileges required.' 
        });
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setLoggingIn(true);
    setMessage({ type: '', text: '' });

    try {
      await base44.auth.login(loginData.email, loginData.password);
      const user = await base44.auth.me();
      
      if (user.role !== 'admin') {
        await base44.auth.logout();
        setMessage({ 
          type: 'error', 
          text: 'Access denied. Admin privileges required.' 
        });
        setLoggingIn(false);
        return;
      }

      window.location.href = createPageUrl("AdminPanel");

    } catch (error) {
      console.error("Admin login error:", error);
      setMessage({ 
        type: 'error', 
        text: 'Invalid email or password' 
      });
      setLoggingIn(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend OAuth endpoint
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
    const callbackUrl = `${window.location.origin}/GoogleCallback`;
    window.location.href = `${apiUrl}/auth/google?role=admin&callback=${encodeURIComponent(callbackUrl)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-4 text-white hover:text-gray-300"
          onClick={() => window.location.href = createPageUrl("Home")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full mb-4 shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-gray-400">JoltCab Administration Portal</p>
        </div>

        <Card className="border-red-900 bg-gray-800/50 backdrop-blur-sm shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-white">
              Administrator Login
            </CardTitle>
          </CardHeader>

          <CardContent>
            {message.text && (
              <Alert className={`mb-6 ${
                message.type === 'success' ? 'bg-green-900/20 border-green-700 text-green-300' : 
                'bg-red-900/20 border-red-700 text-red-300'
              }`}>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            {/* Google Sign-In Button */}
            <div className="mb-6">
              <Button
                type="button"
                variant="outline"
                className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                onClick={handleGoogleLogin}
                disabled={loggingIn}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  placeholder="admin@joltcab.com"
                  required
                  disabled={loggingIn}
                  className="bg-gray-700 border-gray-600 text-white"
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    placeholder="••••••••"
                    required
                    disabled={loggingIn}
                    className="bg-gray-700 border-gray-600 text-white pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    disabled={loggingIn}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loggingIn}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-semibold"
              >
                {loggingIn ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Access Admin Panel
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
          <p className="text-red-300 text-sm text-center">
            <Shield className="w-4 h-4 inline mr-2" />
            This area is restricted to authorized administrators only
          </p>
        </div>
      </div>
    </div>
  );
}