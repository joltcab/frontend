import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { Loader2, AlertCircle, CheckCircle, Building2, User, Phone, Mail, Lock, FileText, Users as UsersIcon } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function CorporateSignUpForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    company_name: "",
    contact_name: "",
    company_phone: "",
    tax_id: "",
    billing_address: "",
    employee_count: "",
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
    if (!formData.company_name.trim()) errors.company_name = "Company name is required";
    if (!formData.contact_name.trim()) errors.contact_name = "Contact person name is required";
    if (!formData.company_phone.trim()) errors.company_phone = "Company phone is required";
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
      // Step 1: Register the user with base44.auth
      await base44.auth.register({
        email: formData.email.trim(),
        password: formData.password,
        full_name: formData.full_name.trim(),
      });

      // Step 2: Login to get authenticated session
      await base44.auth.login(formData.email.trim(), formData.password);

      // Step 3: Update user with additional info (now authenticated)
      await base44.auth.updateMe({
        phone: formData.phone.trim(),
        role: "corporate",
        status: "pending",
      });

      // Step 4: Create corporate profile using service role
      await base44.asServiceRole.entities.CorporateProfile.create({
        user_email: formData.email.trim(),
        company_name: formData.company_name.trim(),
        contact_name: formData.contact_name.trim(),
        company_phone: formData.company_phone.trim(),
        tax_id: formData.tax_id.trim() || null,
        billing_address: formData.billing_address.trim() || null,
        employee_count: formData.employee_count || "1-10",
        status: "pending",
      });

      // Step 5: Create verification data
      await base44.asServiceRole.entities.VerificationData.create({
        user_email: formData.email.trim(),
        email_verified: false,
        phone_verified: false,
        phone_number: formData.phone.trim(),
        verification_status: "pending"
      });

      // Step 6: Send notification (non-blocking)
      try {
        await base44.functions.invoke('sendNotification', {
          user_email: formData.email.trim(),
          type: 'info',
          title: '🎉 Welcome to JoltCab Corporate!',
          message: 'Your corporate account has been created. Our team will review your application and contact you soon.',
          action_url: '/pages/CorporateDashboard',
          channels: ['email']
        });
      } catch (notifError) {
        console.log('Notification error (non-critical):', notifError);
      }

      // Step 7: Notify admin (non-blocking)
      try {
        await base44.functions.invoke('notifyAdmin', {
          subject: 'New Corporate Registration',
          message: `New corporate account registered: ${formData.company_name}`,
          type: 'new_registration',
          data: {
            'Company': formData.company_name,
            'Contact': formData.contact_name,
            'Email': formData.email,
            'Phone': formData.company_phone,
            'Employees': formData.employee_count || 'Not specified'
          }
        });
      } catch (adminError) {
        console.log('Admin notification error (non-critical):', adminError);
      }

      setSuccess(true);
      
      setTimeout(() => {
        window.location.href = createPageUrl("CorporateDashboard");
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
          Your corporate account has been created
        </p>
        <div className="flex items-center justify-center gap-2 text-[#15B46A]">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Redirecting to your dashboard...</span>
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
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border-2 border-purple-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
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
                placeholder="john@company.com"
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

        {/* Company Information */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Company Information</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company_name">
                <Building2 className="w-4 h-4 inline mr-2" />
                Company Name *
              </Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => updateField("company_name", e.target.value)}
                placeholder="Acme Corp"
                className={`h-12 ${validationErrors.company_name ? 'border-red-500' : ''}`}
                required
              />
              {validationErrors.company_name && <p className="text-xs text-red-600 mt-1">{validationErrors.company_name}</p>}
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
                placeholder="Jane Smith"
                className={`h-12 ${validationErrors.contact_name ? 'border-red-500' : ''}`}
                required
              />
              {validationErrors.contact_name && <p className="text-xs text-red-600 mt-1">{validationErrors.contact_name}</p>}
            </div>

            <div>
              <Label htmlFor="company_phone">
                <Phone className="w-4 h-4 inline mr-2" />
                Company Phone *
              </Label>
              <Input
                id="company_phone"
                type="tel"
                value={formData.company_phone}
                onChange={(e) => updateField("company_phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
                className={`h-12 ${validationErrors.company_phone ? 'border-red-500' : ''}`}
                required
              />
              {validationErrors.company_phone && <p className="text-xs text-red-600 mt-1">{validationErrors.company_phone}</p>}
            </div>

            <div>
              <Label htmlFor="tax_id">
                <FileText className="w-4 h-4 inline mr-2" />
                Tax ID / Business Registration
              </Label>
              <Input
                id="tax_id"
                value={formData.tax_id}
                onChange={(e) => updateField("tax_id", e.target.value)}
                placeholder="12-3456789"
                className="h-12"
              />
            </div>

            <div>
              <Label htmlFor="employee_count">
                <UsersIcon className="w-4 h-4 inline mr-2" />
                Number of Employees
              </Label>
              <Select 
                value={formData.employee_count} 
                onValueChange={(value) => updateField("employee_count", value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-500">201-500 employees</SelectItem>
                  <SelectItem value="501+">501+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="billing_address">
                <Building2 className="w-4 h-4 inline mr-2" />
                Billing Address
              </Label>
              <Textarea
                id="billing_address"
                value={formData.billing_address}
                onChange={(e) => updateField("billing_address", e.target.value)}
                placeholder="123 Business St, Suite 100, City, State, ZIP"
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
              Creating Your Corporate Account...
            </>
          ) : (
            <>
              <Building2 className="w-6 h-6 mr-2" />
              Complete Corporate Registration
            </>
          )}
        </Button>
      </form>
    </div>
  );
}