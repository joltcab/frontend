import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { base44 } from "@/api/base44Client";
import { Loader2, AlertCircle, CheckCircle, Radio, User, Phone, Mail, Lock } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function DispatcherSignUpForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dispatcher_name: "",
    acceptTerms: false,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!formData.full_name.trim()) errors.full_name = "Full name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone is required";
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      errors.phone = "Invalid phone format";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!formData.dispatcher_name.trim()) errors.dispatcher_name = "Dispatcher name is required";
    if (!formData.acceptTerms) errors.acceptTerms = "You must accept the Terms and Conditions";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      setError("Please fix the errors below");
      return;
    }

    setLoading(true);

    try {
      await base44.auth.register({
        email: formData.email.trim(),
        password: formData.password,
        full_name: formData.full_name.trim(),
      });

      await base44.auth.updateMe({
        phone: formData.phone.trim(),
        role: "dispatcher",
        status: "pending",
      });

      await base44.entities.DispatcherProfile.create({
        user_email: formData.email.trim(),
        dispatcher_name: formData.dispatcher_name.trim(),
        status: "pending",
      });

      await base44.entities.VerificationData.create({
        user_email: formData.email.trim(),
        email_verified: false,
        phone_verified: false,
        phone_number: formData.phone.trim(),
        verification_status: "pending"
      });

      try {
        await base44.functions.invoke('sendNotification', {
          user_email: formData.email.trim(),
          type: 'info',
          title: '📡 Welcome to JoltCab Dispatchers!',
          message: 'Your dispatcher account has been created. Please complete verification.',
          action_url: '/pages/CompleteVerification',
          channels: ['email']
        });
      } catch (notifError) {
        console.log('Notification error (non-critical):', notifError);
      }

      setSuccess(true);
      
      setTimeout(() => {
        window.location.href = createPageUrl("CompleteVerification");
      }, 2000);

    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-3">
          🎉 Registration Successful!
        </h3>
        <p className="text-gray-600 text-lg mb-4">
          Your dispatcher account has been created
        </p>
        <div className="flex items-center justify-center gap-2 text-[#15B46A]">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Redirecting to verification...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">
                <User className="w-4 h-4 inline mr-2" />
                Full Name *
              </Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => updateField("full_name", e.target.value)}
                placeholder="John Doe"
                className={`h-12 ${validationErrors.full_name ? 'border-red-500' : ''}`}
                required
              />
              {validationErrors.full_name && <p className="text-xs text-red-600 mt-1">{validationErrors.full_name}</p>}
            </div>

            <div>
              <Label htmlFor="email">
                <Mail className="w-4 h-4 inline mr-2" />
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="dispatcher@example.com"
                className={`h-12 ${validationErrors.email ? 'border-red-500' : ''}`}
                required
              />
              {validationErrors.email && <p className="text-xs text-red-600 mt-1">{validationErrors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+1 (555) 000-0000"
                className={`h-12 ${validationErrors.phone ? 'border-red-500' : ''}`}
                required
              />
              {validationErrors.phone && <p className="text-xs text-red-600 mt-1">{validationErrors.phone}</p>}
            </div>

            <div>
              <Label htmlFor="password">
                <Lock className="w-4 h-4 inline mr-2" />
                Password *
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateField("password", e.target.value)}
                placeholder="••••••••"
                className={`h-12 ${validationErrors.password ? 'border-red-500' : ''}`}
                required
                minLength={6}
              />
              {validationErrors.password && <p className="text-xs text-red-600 mt-1">{validationErrors.password}</p>}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="confirmPassword">
                <Lock className="w-4 h-4 inline mr-2" />
                Confirm Password *
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                placeholder="••••••••"
                className={`h-12 ${validationErrors.confirmPassword ? 'border-red-500' : ''}`}
                required
              />
              {validationErrors.confirmPassword && <p className="text-xs text-red-600 mt-1">{validationErrors.confirmPassword}</p>}
            </div>
          </div>
        </div>

        {/* Dispatcher Information */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Dispatcher Information</h3>
          </div>
          
          <div>
            <Label htmlFor="dispatcher_name">
              <Radio className="w-4 h-4 inline mr-2" />
              Dispatcher Name / Company *
            </Label>
            <Input
              id="dispatcher_name"
              value={formData.dispatcher_name}
              onChange={(e) => updateField("dispatcher_name", e.target.value)}
              placeholder="Elite Dispatch Services"
              className={`h-12 ${validationErrors.dispatcher_name ? 'border-red-500' : ''}`}
              required
            />
            {validationErrors.dispatcher_name && <p className="text-xs text-red-600 mt-1">{validationErrors.dispatcher_name}</p>}
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
          <Checkbox
            id="acceptTerms"
            checked={formData.acceptTerms}
            onCheckedChange={(checked) => updateField("acceptTerms", checked)}
            className={validationErrors.acceptTerms ? 'border-red-500' : ''}
          />
          <Label htmlFor="acceptTerms" className="text-sm leading-relaxed cursor-pointer flex-1">
            I accept the{" "}
            <a href="#" className="text-[#15B46A] hover:underline font-semibold">Terms and Conditions</a>{" "}
            and{" "}
            <a href="#" className="text-[#15B46A] hover:underline font-semibold">Privacy Policy</a>.
            I understand that my account will be reviewed before activation.
          </Label>
        </div>
        {validationErrors.acceptTerms && <p className="text-sm text-red-600 -mt-4">{validationErrors.acceptTerms}</p>}

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          className="w-full h-14 bg-gradient-to-r from-[#15B46A] to-[#0F9456] hover:from-[#0F9456] hover:to-[#15B46A] text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 mr-2 animate-spin" />
              Creating Your Dispatcher Account...
            </>
          ) : (
            <>
              <Radio className="w-6 h-6 mr-2" />
              Complete Dispatcher Registration
            </>
          )}
        </Button>
      </form>
    </div>
  );
}