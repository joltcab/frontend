import React, { useState } from "react";
import joltcab from "@/lib/joltcab-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle, User, Mail, Phone, Lock } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function PassengerSignUpForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    acceptTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.acceptTerms) {
      setError("You must accept the Terms and Conditions");
      setLoading(false);
      return;
    }

    try {
      await joltcab.auth.register({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
      });

      await joltcab.auth.updateMe({
        phone: formData.phone,
        role: "user",
        status: "active",
      });

      try {
        await joltcab.entities.Wallet.create({
          user_email: formData.email,
          balance: 0,
          currency: "USD"
        });
      } catch (walletError) {
        console.error("Wallet creation failed (non-critical):", walletError);
      }

      setSuccess(true);
      
      setTimeout(() => {
        window.location.href = createPageUrl("UserDashboard");
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
    setError(null);
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to JoltCab! 🎉</h3>
        <p className="text-gray-600 mb-4">Your account has been created successfully</p>
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#15B46A]" />
        <p className="text-sm text-gray-500 mt-2">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="h-12"
            required
            disabled={loading}
          />
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
            placeholder="john@example.com"
            className="h-12"
            required
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="phone">
            <Phone className="w-4 h-4 inline mr-2" />
            Phone Number *
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="h-12"
            required
            disabled={loading}
          />
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
            className="h-12"
            required
            minLength={6}
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="acceptTerms"
            checked={formData.acceptTerms}
            onCheckedChange={(checked) => updateField("acceptTerms", checked)}
            disabled={loading}
          />
          <Label htmlFor="acceptTerms" className="text-sm leading-relaxed cursor-pointer">
            I accept the{" "}
            <a href="#" className="text-[#15B46A] hover:underline">
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#15B46A] hover:underline">
              Privacy Policy
            </a>
          </Label>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-12 bg-[#15B46A] hover:bg-[#0F9456] text-white rounded-xl"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </div>
  );
}