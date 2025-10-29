import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle, Upload, ChevronRight, ChevronLeft } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";

export default function DriverSignUpForm({ onSuccess }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_year: "",
    vehicle_color: "",
    vehicle_plate: "",
    vehicle_seats: "4",
    acceptTerms: false,
  });
  const [documents, setDocuments] = useState({
    license_front: null,
    license_back: null,
    vehicle_registration: null,
    vehicle_insurance: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(null);

  const handleFileUpload = async (docType, file) => {
    if (!file) return;

    setUploadingDoc(docType);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setDocuments(prev => ({ ...prev, [docType]: file_url }));
    } catch (err) {
      setError(`Failed to upload ${docType}. Please try again.`);
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    if (!formData.acceptTerms) {
      setError("You must accept the Terms and Conditions");
      setLoading(false);
      return;
    }

    if (!documents.license_front || !documents.license_back || !documents.vehicle_registration) {
      setError("Please upload all required documents");
      setLoading(false);
      return;
    }

    try {
      await base44.auth.register({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
      });

      await base44.auth.updateMe({
        phone: formData.phone,
        role: "driver",
        status: "pending",
      });

      await base44.entities.DriverProfile.create({
        user_email: formData.email,
        vehicle_make: formData.vehicle_make,
        vehicle_model: formData.vehicle_model,
        vehicle_year: formData.vehicle_year,
        vehicle_color: formData.vehicle_color,
        vehicle_plate: formData.vehicle_plate,
        vehicle_seats: parseInt(formData.vehicle_seats),
        background_check_status: "pending",
        is_online: false,
      });

      for (const [docType, fileUrl] of Object.entries(documents)) {
        if (fileUrl) {
          await base44.entities.Document.create({
            user_email: formData.email,
            document_type: docType,
            file_url: fileUrl,
            status: "pending",
          });
        }
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.full_name || !formData.email || !formData.phone || !formData.password) {
        setError("Please fill all required fields");
        return;
      }
    } else if (step === 2) {
      if (!formData.vehicle_make || !formData.vehicle_model || !formData.vehicle_plate) {
        setError("Please fill all vehicle information");
        return;
      }
    }
    setError(null);
    setStep(step + 1);
  };

  const prevStep = () => {
    setError(null);
    setStep(step - 1);
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
        <p className="text-gray-600 mb-4">Redirecting to complete your verification...</p>
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#15B46A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === step ? 'w-8 bg-[#15B46A]' : i < step ? 'w-2 bg-[#15B46A]' : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
      <p className="text-sm text-gray-500 text-center">Step {step} of 4</p>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Step 1: Personal Information */}
      {step === 1 && (
        <form className="space-y-4">
          <div>
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <Button
            type="button"
            onClick={nextStep}
            className="w-full bg-[#15B46A] hover:bg-[#0F9456] h-12"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </form>
      )}

      {/* Step 2: Vehicle Information */}
      {step === 2 && (
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicle_make">Vehicle Make *</Label>
              <Input
                id="vehicle_make"
                name="vehicle_make"
                value={formData.vehicle_make}
                onChange={handleChange}
                placeholder="Toyota"
                required
              />
            </div>

            <div>
              <Label htmlFor="vehicle_model">Vehicle Model *</Label>
              <Input
                id="vehicle_model"
                name="vehicle_model"
                value={formData.vehicle_model}
                onChange={handleChange}
                placeholder="Camry"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicle_year">Year *</Label>
              <Input
                id="vehicle_year"
                name="vehicle_year"
                value={formData.vehicle_year}
                onChange={handleChange}
                placeholder="2020"
                required
              />
            </div>

            <div>
              <Label htmlFor="vehicle_color">Color *</Label>
              <Input
                id="vehicle_color"
                name="vehicle_color"
                value={formData.vehicle_color}
                onChange={handleChange}
                placeholder="Black"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicle_plate">License Plate *</Label>
              <Input
                id="vehicle_plate"
                name="vehicle_plate"
                value={formData.vehicle_plate}
                onChange={handleChange}
                placeholder="ABC-1234"
                required
              />
            </div>

            <div>
              <Label htmlFor="vehicle_seats">Number of Seats *</Label>
              <Input
                id="vehicle_seats"
                name="vehicle_seats"
                type="number"
                value={formData.vehicle_seats}
                onChange={handleChange}
                placeholder="4"
                min="2"
                max="8"
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="flex-1"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>
            <Button
              type="button"
              onClick={nextStep}
              className="flex-1 bg-[#15B46A] hover:bg-[#0F9456]"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </form>
      )}

      {/* Step 3: Upload Documents */}
      {step === 3 && (
        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please upload clear, readable photos of your documents. All documents marked with * are required.
            </AlertDescription>
          </Alert>

          {/* Driver's License Front */}
          <Card>
            <CardContent className="pt-6">
              <Label className="mb-2 block">Driver's License (Front) *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#15B46A] transition-colors">
                {documents.license_front ? (
                  <div className="space-y-2">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                    <p className="text-sm text-green-600 font-semibold">Uploaded Successfully</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setDocuments(prev => ({ ...prev, license_front: null }))}
                    >
                      Change File
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Click to upload</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('license_front', e.target.files[0])}
                      className="hidden"
                      id="license_front"
                      disabled={uploadingDoc === 'license_front'}
                    />
                    <label htmlFor="license_front">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        asChild
                        disabled={uploadingDoc === 'license_front'}
                      >
                        <span>
                          {uploadingDoc === 'license_front' ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            'Choose File'
                          )}
                        </span>
                      </Button>
                    </label>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Driver's License Back */}
          <Card>
            <CardContent className="pt-6">
              <Label className="mb-2 block">Driver's License (Back) *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#15B46A] transition-colors">
                {documents.license_back ? (
                  <div className="space-y-2">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                    <p className="text-sm text-green-600 font-semibold">Uploaded Successfully</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setDocuments(prev => ({ ...prev, license_back: null }))}
                    >
                      Change File
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('license_back', e.target.files[0])}
                      className="hidden"
                      id="license_back"
                      disabled={uploadingDoc === 'license_back'}
                    />
                    <label htmlFor="license_back">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        asChild
                        disabled={uploadingDoc === 'license_back'}
                      >
                        <span>
                          {uploadingDoc === 'license_back' ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            'Choose File'
                          )}
                        </span>
                      </Button>
                    </label>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Registration */}
          <Card>
            <CardContent className="pt-6">
              <Label className="mb-2 block">Vehicle Registration *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#15B46A] transition-colors">
                {documents.vehicle_registration ? (
                  <div className="space-y-2">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                    <p className="text-sm text-green-600 font-semibold">Uploaded Successfully</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setDocuments(prev => ({ ...prev, vehicle_registration: null }))}
                    >
                      Change File
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('vehicle_registration', e.target.files[0])}
                      className="hidden"
                      id="vehicle_registration"
                      disabled={uploadingDoc === 'vehicle_registration'}
                    />
                    <label htmlFor="vehicle_registration">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        asChild
                        disabled={uploadingDoc === 'vehicle_registration'}
                      >
                        <span>
                          {uploadingDoc === 'vehicle_registration' ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            'Choose File'
                          )}
                        </span>
                      </Button>
                    </label>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Insurance */}
          <Card>
            <CardContent className="pt-6">
              <Label className="mb-2 block">Vehicle Insurance (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#15B46A] transition-colors">
                {documents.vehicle_insurance ? (
                  <div className="space-y-2">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                    <p className="text-sm text-green-600 font-semibold">Uploaded Successfully</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setDocuments(prev => ({ ...prev, vehicle_insurance: null }))}
                    >
                      Change File
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('vehicle_insurance', e.target.files[0])}
                      className="hidden"
                      id="vehicle_insurance"
                      disabled={uploadingDoc === 'vehicle_insurance'}
                    />
                    <label htmlFor="vehicle_insurance">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        asChild
                        disabled={uploadingDoc === 'vehicle_insurance'}
                      >
                        <span>
                          {uploadingDoc === 'vehicle_insurance' ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            'Choose File'
                          )}
                        </span>
                      </Button>
                    </label>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="flex-1"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>
            <Button
              type="button"
              onClick={nextStep}
              className="flex-1 bg-[#15B46A] hover:bg-[#0F9456]"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Terms & Submit */}
      {step === 4 && (
        <div className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              Please review all information before submitting your application. Your account will be reviewed within 24-48 hours.
            </AlertDescription>
          </Alert>

          {/* Summary */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <h3 className="font-semibold text-lg mb-3">Application Summary</h3>
              <div className="text-sm space-y-2">
                <p><strong>Name:</strong> {formData.full_name}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
                <p><strong>Vehicle:</strong> {formData.vehicle_year} {formData.vehicle_make} {formData.vehicle_model}</p>
                <p><strong>Plate:</strong> {formData.vehicle_plate}</p>
                <p><strong>Documents:</strong> {Object.values(documents).filter(Boolean).length} uploaded</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-start gap-2">
            <Checkbox
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptTerms: checked }))}
            />
            <Label htmlFor="acceptTerms" className="text-sm leading-relaxed cursor-pointer">
              I accept the{" "}
              <a href="#" className="text-[#15B46A] hover:underline">
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#15B46A] hover:underline">
                Privacy Policy
              </a>. I understand that my application will be reviewed and I will be notified of the decision.
            </Label>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="flex-1"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-[#15B46A] hover:bg-[#0F9456] h-12 text-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}