import React, { useState, useEffect } from "react";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [role, setRole] = useState('passenger');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    if (roleParam) {
      setRole(roleParam);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setSent(true);
    setMessage({
      type: 'success',
      text: 'If an account exists with this email, you will receive a password reset link shortly.'
    });
  };

  const getRoleTitle = () => {
    const titles = {
      passenger: 'Passenger',
      driver: 'Driver',
      corporate: 'Corporate',
      hotel: 'Hotel',
      dispatcher: 'Dispatcher',
      partner: 'Partner',
      admin: 'Admin'
    };
    return titles[role] || 'User';
  };

  const getBackLink = () => {
    const links = {
      dispatcher: 'DispatcherLogin',
      admin: 'Admin',
      driver: 'UniversalLogin',
      corporate: 'UniversalLogin',
      hotel: 'UniversalLogin',
      partner: 'UniversalLogin',
      passenger: 'UniversalLogin'
    };
    return createPageUrl(links[role] || 'Home');
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="pt-12 pb-8 text-center">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Check Your Email
            </h2>
            
            <p className="text-gray-600 mb-8">
              If an account exists with:<br />
              <span className="font-semibold text-gray-900">{email}</span>
              <br />
              You will receive a password reset link shortly.
            </p>

            <p className="text-sm text-gray-500 mb-6">
              The link will expire in 1 hour.
            </p>

            <Button
              onClick={() => window.location.href = getBackLink()}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
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
            <Mail className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Forgot Password?
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {getRoleTitle()} Password Recovery
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
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="text-lg py-6"
              />
              <p className="text-sm text-gray-500">
                We'll send you a link to reset your password
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#15B46A] to-[#0F9456] hover:from-[#0F9456] hover:to-[#0D7A48] text-white py-6 text-lg font-semibold"
            >
              <Mail className="w-5 h-5 mr-2" />
              Send Reset Link
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a 
              href={getBackLink()}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}