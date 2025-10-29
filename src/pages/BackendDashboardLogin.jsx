import React, { useState } from "react";
import { joltcab } from "@/lib/joltcab-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, Database, Lock, Mail, Server } from "lucide-react";
import { toast } from "sonner";

/**
 * Página de login al Dashboard Backend
 * Acceso directo al backend de JoltCab
 * Credenciales: admin@joltcab.com / @Odg4383@
 */
export default function BackendDashboardLogin() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loginData, setLoginData] = useState({
    email: "admin@joltcab.com",
    password: ""
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('🔐 Attempting backend dashboard login...');
      
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

      console.log('✅ Backend dashboard login successful');
      toast.success('Welcome to Backend Dashboard!');
      
      // Redirigir al backend dashboard
      const backendUrl = import.meta.env.VITE_API_URL || 'https://admin.joltcab.com/api/v1';
      const dashboardUrl = backendUrl.replace('/api/v1', '/dashboard');
      
      // Guardar token en sessionStorage para el dashboard
      sessionStorage.setItem('backend_token', response.data?.token || joltcab.token);
      
      // Abrir dashboard en nueva ventana
      window.open(dashboardUrl, '_blank');
      
      setMessage({
        type: 'success',
        text: '✅ Dashboard opened in new window. You can close this tab.'
      });

    } catch (error) {
      console.error('❌ Login error:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Invalid credentials. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-blue-700 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Database className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <CardTitle className="text-3xl font-bold text-white">
                Backend Dashboard
              </CardTitle>
              <CardDescription className="text-gray-400 mt-2">
                JoltCab Backend Access
                <br />
                <span className="text-xs text-gray-500 flex items-center justify-center gap-1 mt-1">
                  <Server className="w-3 h-3" />
                  Direct Backend Connection
                </span>
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {message.text && (
              <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="bg-slate-800/50 border-slate-700">
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
                    className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-500 focus:border-blue-500"
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
                    className="pl-10 pr-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-500 focus:border-blue-500"
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
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Database className="w-5 h-5 mr-2" />
                    Access Backend Dashboard
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-700">
              <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                <p className="text-xs text-gray-400 font-mono">
                  <span className="text-blue-400">Default Credentials:</span>
                </p>
                <p className="text-xs text-gray-300 font-mono">
                  Email: admin@joltcab.com
                </p>
                <p className="text-xs text-gray-300 font-mono">
                  Pass: @Odg4383@
                </p>
              </div>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                🔒 Secure backend connection
                <br />
                Direct access to JoltCab API
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
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              iHOSTcast
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
