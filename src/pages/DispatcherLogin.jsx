import { useState, useEffect } from "react";
import joltcab from "@/lib/joltcab-api";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Radio, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";

export default function DispatcherLogin() {
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
      const token = localStorage.getItem('token');
      const disableChecks = import.meta.env.VITE_DISABLE_BACKEND_AUTH_CHECK === 'true';
      const isDev = import.meta.env.DEV === true;

      if (disableChecks || (!token && isDev)) {
        setLoading(false);
        return;
      }

      if (!token) {
        setLoading(false);
        return;
      }

  const user = await joltcab.auth.me();
      
      if (user && user.role === 'dispatcher') {
        window.location.href = createPageUrl("DispatcherDashboard");
      } else if (user) {
        setMessage({ 
          type: 'error', 
          text: 'Access denied. Dispatcher privileges required.' 
        });
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch {
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
  await joltcab.auth.login(loginData.email, loginData.password);
  const user = await joltcab.auth.me();
      
      if (user.role !== 'dispatcher') {
  await joltcab.auth.logout();
        setMessage({ 
          type: 'error', 
          text: 'Access denied. Dispatcher privileges required.' 
        });
        setLoggingIn(false);
        return;
      }

      window.location.href = createPageUrl("DispatcherDashboard");

    } catch (error) {
      console.error("Dispatcher login error:", error);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 flex items-center justify-center p-4">
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-full mb-4 shadow-2xl">
            <Radio className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Dispatcher Login</h1>
          <p className="text-gray-400">Manage your fleet operations</p>
        </div>

        <Card className="border-indigo-900 bg-gray-800/50 backdrop-blur-sm shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-white">
              Sign In
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
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  placeholder="dispatcher@company.com"
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
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg font-semibold"
              >
                {loggingIn ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Radio className="w-5 h-5 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Don&apos;t have an account?{' '}
                <a href={createPageUrl("Register")} className="text-indigo-400 hover:text-indigo-300 font-medium">
                  Register as Dispatcher
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}