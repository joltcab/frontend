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