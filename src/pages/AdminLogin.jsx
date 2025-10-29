import React, { useState, useEffect } from "react";
import { joltcab } from "@/lib/joltcab-api";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, Shield, Lock, Mail } from "lucide-react";
import { toast } from "sonner";

/**
 * Página de login exclusiva para admin.joltcab.com
 * Solo accesible desde el subdominio admin
 */
export default function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  useEffect(() => {
    // Verificar si ya está logueado
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await joltcab.auth.me();
      if (user && user.role === 'admin') {
        navigate('/AdminPanel');
      }
    } catch (error) {
      // No está logueado, continuar
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('🔐 Attempting admin login...');
      
      // Login
      const response = await joltcab.auth.login(loginData.email, loginData.password);
      console.log('✅ Login response:', response);

      // Obtener datos del usuario
      const user = await joltcab.auth.me();
      console.log('👤 User data:', user);

      // Verificar que sea admin
      if (user.role !== 'admin') {
        setMessage({
          type: 'error',
          text: '❌ Access denied. Admin credentials required.'
        });
        await joltcab.auth.logout();
        setLoading(false);
        return;
      }

      // Verificar estado de la cuenta
      if (user.status === 'suspended') {
        setMessage({
          type: 'error',
          text: '❌ Your account has been suspended. Contact support.'
        });
        await joltcab.auth.logout();
        setLoading(false);
        return;
      }

      console.log('✅ Admin login successful');
      toast.success('Welcome back, Admin!');
      
      // Redirigir al Admin Panel
      setTimeout(() => {
        navigate('/AdminPanel');
      }, 500);

    } catch (error) {
      console.error('❌ Login error:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Invalid credentials. Please try again.'
      });
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('🔐 Initiating Google OAuth for admin...');
      
      // Configurar URL de callback
      const redirectUri = window.location.origin + '/auth/google/callback';
      const backendUrl = import.meta.env.VITE_API_URL || 'https://admin.joltcab.com/api/v1';
      
      // Construir URL de OAuth
      const googleAuthUrl = `${backendUrl}/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}&role=admin`;
      
      console.log('🔗 Redirecting to:', googleAuthUrl);
      
      // Redirigir a Google OAuth
      window.location.href = googleAuthUrl;
      
    } catch (error) {
      console.error('❌ Google login error:', error);
      setMessage({
        type: 'error',
        text: 'Failed to initiate Google login. Please try again.'
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-gray-700 bg-gray-900/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#15B46A] to-[#0F9456] rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <CardTitle className="text-3xl font-bold text-white">
                JoltCab Admin
              </CardTitle>
              <CardDescription className="text-gray-400 mt-2">
                Secure Administrator Access
                <br />
                <span className="text-xs text-gray-500">admin.joltcab.com</span>
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {message.text && (
              <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="bg-gray-800/50 border-gray-700">
                <AlertDescription className="text-white">
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Admin Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@joltcab.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                    disabled={loading}
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#15B46A]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    disabled={loading}
                    className="pl-10 pr-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#15B46A]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#15B46A] to-[#0F9456] hover:from-[#0F9456] hover:to-[#15B46A] text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-green-500/50 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Sign In as Admin
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900/50 text-gray-400">Or continue with</span>
              </div>
            </div>

            {/* Google Login */}
            <Button
              type="button"
              onClick={() => handleGoogleLogin()}
              disabled={loading}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-6 rounded-xl shadow-lg border border-gray-300 transition-all"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </Button>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-xs text-gray-500 text-center">
                🔒 This is a secure admin portal
                <br />
                Unauthorized access is prohibited
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Powered by{" "}
            <a 
              href="https://ihostcast.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#15B46A] hover:text-[#0F9456] font-semibold"
            >
              iHOSTcast
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
