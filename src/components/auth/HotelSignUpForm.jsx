import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import joltcab from "@/lib/joltcab-api";
import { Loader2, AlertCircle, CheckCircle, Hotel as HotelIcon, User, Phone, Mail, Lock, MapPin, Star } from "lucide-react";
import { createPageUrl } from "@/utils";
import PropTypes from "prop-types";

export default function HotelSignUpForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    hotel_name: "",
    contact_name: "",
    hotel_phone: "",
    address: "",
    star_rating: "",
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
    } else if (!/^\+?[\d\s()-]+$/.test(formData.phone)) {
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
    if (!formData.hotel_name.trim()) errors.hotel_name = "Hotel name is required";
    if (!formData.contact_name.trim()) errors.contact_name = "Contact person name is required";
    if (!formData.hotel_phone.trim()) errors.hotel_phone = "Hotel phone is required";
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
      await joltcab.auth.register({
        email: formData.email.trim(),
        password: formData.password,
        full_name: formData.full_name.trim(),
      });

      await joltcab.auth.updateMe({
        phone: formData.phone.trim(),
        role: "hotel",
        status: "pending",
      });

      await joltcab.entities.HotelProfile.create({
        user_email: formData.email.trim(),
        hotel_name: formData.hotel_name.trim(),
        contact_name: formData.contact_name.trim(),
        hotel_phone: formData.hotel_phone.trim(),
        address: formData.address.trim() || null,
        star_rating: formData.star_rating ? parseInt(formData.star_rating) : null,
        status: "pending",
      });

      await joltcab.entities.VerificationData.create({
        user_email: formData.email.trim(),
        email_verified: false,
        phone_verified: false,
        phone_number: formData.phone.trim(),
        verification_status: "pending"
      });

      try {
        await joltcab.functions.invoke('sendNotification', {
          user_email: formData.email.trim(),
          type: 'info',
          title: '🏨 Welcome to JoltCab Hotels!',
          message: 'Your hotel partner account has been created. Please complete verification.',
          action_url: '/pages/CompleteVerification',
          channels: ['email']
        });
      } catch (notifError) {
        console.log('Notification error (non-critical):', notifError);
      }

      setSuccess(true);
      if (typeof onSuccess === 'function') {
        onSuccess({ email: formData.email.trim() });
      }
      
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
          Your hotel partner account has been created
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
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
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
                placeholder="contact@hotel.com"
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

        {/* Hotel Information */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <HotelIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Hotel Information</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hotel_name">
                <HotelIcon className="w-4 h-4 inline mr-2" />
                Hotel Name *
              </Label>
              <Input
                id="hotel_name"
                value={formData.hotel_name}
                onChange={(e) => updateField("hotel_name", e.target.value)}
                placeholder="Grand Plaza Hotel"
                className={`h-12 ${validationErrors.hotel_name ? 'border-red-500' : ''}`}
                required
              />
              {validationErrors.hotel_name && <p className="text-xs text-red-600 mt-1">{validationErrors.hotel_name}</p>}
            </div>

            <div>
              <Label htmlFor="contact_name">
                <User className="w-4 h-4 inline mr-2" />
                Contact Person *
              </Label>
              <Input
                id="contact_name"
                value={formData.contact_name}
                onChange={(e) => updateField("contact_name", e.target.value)}
                placeholder="Jane Manager"
                className={`h-12 ${validationErrors.contact_name ? 'border-red-500' : ''}`}
                required
              />
              {validationErrors.contact_name && <p className="text-xs text-red-600 mt-1">{validationErrors.contact_name}</p>}
            </div>

            <div>
              <Label htmlFor="hotel_phone">
                <Phone className="w-4 h-4 inline mr-2" />
                Hotel Phone *
              </Label>
              <Input
                id="hotel_phone"
                type="tel"
                value={formData.hotel_phone}
                onChange={(e) => updateField("hotel_phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
                className={`h-12 ${validationErrors.hotel_phone ? 'border-red-500' : ''}`}
                required
              />
              {validationErrors.hotel_phone && <p className="text-xs text-red-600 mt-1">{validationErrors.hotel_phone}</p>}
            </div>

            <div>
              <Label htmlFor="star_rating">
                <Star className="w-4 h-4 inline mr-2" />
                Star Rating
              </Label>
              <Select 
                value={formData.star_rating} 
                onValueChange={(value) => updateField("star_rating", value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">⭐ 1 Star</SelectItem>
                  <SelectItem value="2">⭐⭐ 2 Stars</SelectItem>
                  <SelectItem value="3">⭐⭐⭐ 3 Stars</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐ 4 Stars</SelectItem>
                  <SelectItem value="5">⭐⭐⭐⭐⭐ 5 Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address">
                <MapPin className="w-4 h-4 inline mr-2" />
                Hotel Address
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="123 Hotel Street, City, State, ZIP"
                rows={3}
                className="resize-none"
              />
            </div>
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
            <a href="#" className="text-[#15B46A] hover:underline font-semibold">
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#15B46A] hover:underline font-semibold">
              Privacy Policy
            </a>
            . I understand that my account will be reviewed before activation.
          </Label>
        </div>
        {validationErrors.acceptTerms && (
          <p className="text-sm text-red-600 -mt-4">{validationErrors.acceptTerms}</p>
        )}

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
              Creating Your Hotel Account...
            </>
          ) : (
            <>
              <HotelIcon className="w-6 h-6 mr-2" />
              Complete Hotel Registration
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

HotelSignUpForm.propTypes = {
  onSuccess: PropTypes.func,
};