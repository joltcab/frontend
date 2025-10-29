import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [token, setToken] = useState("");
  const [role, setRole] = useState("passenger");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    const roleParam = params.get('role');
    
    if (!tokenParam) {
      setMessage({ 
        type: 'error', 
        text: 'Invalid or missing reset token' 
      });
      return;
    }
    
    setToken(tokenParam);
    if (roleParam) {
      setRole(roleParam);
    }
  }, []);

  const validatePassword = (pwd) => {
    if (pwd.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(pwd)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(pwd)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(pwd)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setMessage({ type: 'error', text: passwordError });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let result;
      
      if (role === 'admin') {
        result = await base44.functions.invoke('adminResetPassword', {
          token,
          new_password: password
        });
      } else {
        result = await base44.functions.invoke('userResetPassword', {
          token,
          new_password: password,
          role
        });
      }

      if (result.data?.success) {
        setSuccess(true);
        setMessage({
          type: 'success',
          text: 'Password reset successfully! Redirecting to login...'
        });
        
        setTimeout(() => {
          const loginPages = {
            admin: 'Admin',
            dispatcher: 'DispatcherLogin',
            passenger: 'PassengerAuth',
            driver: 'PassengerAuth',
            corporate: 'PassengerAuth',
            hotel: 'PassengerAuth',
            partner: 'PassengerAuth'
          };
          window.location.href = createPageUrl(loginPages[role] || 'PassengerAuth');
        }, 2000);
      } else {
        setMessage({
          type: 'error',
          text: result.data?.error || 'Failed to reset password. Please try again.'
        });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setMessage({
        type: 'error',
        text: 'Error resetting password. Please try again or request a new reset link.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="pt-12 pb-8 text-center">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Password Reset Successfully!
            </h2>
            
            <p className="text-gray-600 mb-8">
              Your password has been updated. You will be redirected to login...
            </p>

            <div className="flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-[#15B46A] animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#15B46A] to-[#0F9456] rounded-full flex items-center justify-center mb-4">
            <Key className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Reset Password
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Enter your new password
          </p>
        </CardHeader>

        <CardContent>
          {message.text && (
            <Alert className={`mb-6 ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  disabled={loading}
                  className="text-lg py-6 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Must be at least 8 characters with uppercase, lowercase, and numbers
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  disabled={loading}
                  className="text-lg py-6 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !token}
              className="w-full bg-gradient-to-r from-[#15B46A] to-[#0F9456] hover:from-[#0F9456] hover:to-[#0D7A48] text-white py-6 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  <Key className="w-5 h-5 mr-2" />
                  Reset Password
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}