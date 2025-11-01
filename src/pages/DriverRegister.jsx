
import { useState, useEffect } from "react";
import { Car, Loader2, UploadCloud, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { joltcab } from "@/lib/joltcab-api";
import { createPageUrl } from "@/utils";
import SocialLogin from "@/components/auth/SocialLogin";
import PropTypes from "prop-types";

export default function DriverRegister() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_year: "",
    vehicle_color: "",
    vehicle_plate: "",
    vehicle_seats: "4",
    service_type_id: "",
  });

  const [documents, setDocuments] = useState({});
  const [uploadingDocs, setUploadingDocs] = useState({}); // Track which docs are uploading
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Finaliza login social si viene token de proveedor
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) return;

    const finalize = async () => {
      try {
        joltcab.setToken(token);
        const pendingRole = localStorage.getItem('pendingUserRole');
        if (pendingRole) localStorage.removeItem('pendingUserRole');
        const user = await joltcab.auth.me();
        // Limpia la query
        const url = new URL(window.location.href);
        url.search = '';
        window.history.replaceState({}, document.title, url.toString());

        // Redirige según estado
        if (user?.role === 'driver') {
          if (user.status === 'pending') {
            window.location.href = createPageUrl('CompleteVerification');
          } else {
            window.location.href = createPageUrl('DriverDashboard');
          }
        } else {
          window.location.href = createPageUrl('UserDashboard');
        }
      } catch {
        // Ignora errores de finalización para no romper el formulario
      }
    };

    finalize();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = async (e, docType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mark this document as uploading
    setUploadingDocs((prev) => ({ ...prev, [docType]: true }));
    setError("");

    try {
      console.log(`📤 Uploading ${docType}...`);
      // Intentar subir usando funciones del backend joltcab
      let file_url;
      try {
        const uploadRes = await joltcab.functions.invoke('uploadDriverDocument', { docType, file });
        file_url = uploadRes?.data?.file_url;
      } catch (uploadErr) {
        // Fallback a URL local para no romper la UI si el backend no acepta archivos directamente
        file_url = URL.createObjectURL(file);
      }
      
      // Save the file URL
      setDocuments((prevDocs) => ({ ...prevDocs, [docType]: file_url }));
      
      // If it's a selfie, also show preview
      if (docType === "selfie") {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelfiePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
      
      console.log(`✅ ${docType} uploaded successfully`);
      setError("");
    } catch (err) {
      console.error(`❌ Error uploading ${docType}:`, err);
      setError(`Failed to upload ${docType}. Please try again.`);
      
      // Remove the failed document
      setDocuments((prevDocs) => {
        const newDocs = { ...prevDocs };
        delete newDocs[docType];
        return newDocs;
      });
    } finally {
      // Mark this document as done uploading
      setUploadingDocs((prev) => {
        const newState = { ...prev };
        delete newState[docType];
        return newState;
      });
    }
  };

  const handleNextStep = () => {
    setError("");

    if (currentStep === 1) {
      if (!formData.full_name || !formData.email || !formData.phone || !formData.city || !formData.country) {
        setError("Please fill in all required driver details.");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address.");
        return;
      }
      const phoneRegex = /^\+?[0-9\s-()]{7,20}$/;
      if (!phoneRegex.test(formData.phone)) {
        setError("Please enter a valid phone number (e.g., +15551234567).");
        return;
      }
    }

    if (currentStep === 2) {
      if (!formData.vehicle_make || !formData.vehicle_model || !formData.vehicle_year || !formData.vehicle_color || !formData.vehicle_plate || !formData.service_type_id) {
        setError("Please fill in all required vehicle details.");
        return;
      }
      const vehicleYear = parseInt(formData.vehicle_year);
      const currentYear = new Date().getFullYear();
      if (isNaN(vehicleYear) || vehicleYear < 1900 || vehicleYear > currentYear + 1) {
        setError("Please enter a valid vehicle year.");
        return;
      }
      const vehicleSeats = parseInt(formData.vehicle_seats);
      if (isNaN(vehicleSeats) || vehicleSeats < 1 || vehicleSeats > 8) {
        setError("Please enter a valid number of seats (1-8).");
        return;
      }
    }
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setError("");
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if any documents are still uploading
    if (Object.keys(uploadingDocs).length > 0) {
      setError("Please wait for all documents to finish uploading.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (!formData.email || !formData.phone || !formData.vehicle_make || !formData.vehicle_model) {
        setError("Please fill in all required fields.");
        setLoading(false);
        return;
      }

      if (currentStep === 3) {
        const uploadedDocs = ['license_front', 'license_back', 'vehicle_registration', 'vehicle_insurance'];
        const missingDocs = uploadedDocs.filter(doc => !documents[doc]);
        
        if (missingDocs.length > 0) {
          setError(`Please upload: ${missingDocs.map(d => d.replace(/_/g, ' ')).join(', ')}`);
          setLoading(false);
          return;
        }

        if (!documents.selfie) {
          setError("Please upload a selfie for verification.");
          setLoading(false);
          return;
        }

        if (!agreedToTerms) {
          setError("Please accept the Terms and Conditions.");
          setLoading(false);
          return;
        }
      }

      // Validate vehicle age
      console.log('🚗 Validating vehicle age...');
      const { data: ageValidation } = await joltcab.functions.invoke('validateVehicleAge', {
        vehicle_year: formData.vehicle_year,
        country_code: formData.country
      });

      if (!ageValidation.valid) {
        setError(`❌ ${ageValidation.error}. Este vehículo no cumple con los requisitos.`);
        setLoading(false);
        return;
      }

      console.log('✅ Vehicle age validated');


      console.log('📤 Submitting registration...');

      const payload = {
        email: formData.email,
        full_name: formData.full_name,
        phone: formData.phone,
        city: formData.city,
        country: formData.country,
        vehicle_make: formData.vehicle_make,
        vehicle_model: formData.vehicle_model,
        vehicle_year: parseInt(formData.vehicle_year),
        vehicle_color: formData.vehicle_color,
        vehicle_plate: formData.vehicle_plate,
        vehicle_seats: parseInt(formData.vehicle_seats),
        service_type_id: formData.service_type_id,
        documents: documents
      };

      const response = await joltcab.functions.invoke('registerDriver', payload);
      
      console.log('📥 Response:', response);

      if (response.data && response.data.success) {
        console.log('✅ Registration successful, redirecting...');
        
        // Show success message with credentials
        alert(`✅ Registration Successful!\n\nYour temporary credentials:\nEmail: ${response.data.user_email}\nPassword: ${response.data.temp_password}\n\nPlease login and complete verification.`);
        
        // Redirect to login with email pre-filled
        window.location.href = createPageUrl("Home") + `?email=${encodeURIComponent(formData.email)}`;
      } else {
        throw new Error(response.data?.error || 'Registration failed');
      }

    } catch (err) {
      console.error("❌ Registration error:", err);
      const errorMessage = err.response?.data?.error || err.message || "Registration failed. Please try again.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Driver Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input 
                    id="full_name" 
                    name="full_name" 
                    value={formData.full_name} 
                    onChange={handleInputChange} 
                    placeholder="John Doe" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    placeholder="john@example.com" 
                    required 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    type="tel" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    placeholder="+15551234567" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleInputChange} 
                    placeholder="New York" 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input 
                  id="country" 
                  name="country" 
                  value={formData.country} 
                  onChange={handleInputChange} 
                  placeholder="USA" 
                  required 
                />
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Vehicle Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle_make">Vehicle Make</Label>
                  <Input 
                    id="vehicle_make" 
                    name="vehicle_make" 
                    value={formData.vehicle_make} 
                    onChange={handleInputChange} 
                    placeholder="Toyota" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicle_model">Vehicle Model</Label>
                  <Input 
                    id="vehicle_model" 
                    name="vehicle_model" 
                    value={formData.vehicle_model} 
                    onChange={handleInputChange} 
                    placeholder="Camry" 
                    required 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle_year">Vehicle Year</Label>
                  <Input 
                    id="vehicle_year" 
                    name="vehicle_year" 
                    type="number" 
                    value={formData.vehicle_year} 
                    onChange={handleInputChange} 
                    placeholder="2020" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicle_color">Vehicle Color</Label>
                  <Input 
                    id="vehicle_color" 
                    name="vehicle_color" 
                    value={formData.vehicle_color} 
                    onChange={handleInputChange} 
                    placeholder="Black" 
                    required 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle_plate">Vehicle Plate</Label>
                  <Input 
                    id="vehicle_plate" 
                    name="vehicle_plate" 
                    value={formData.vehicle_plate} 
                    onChange={handleInputChange} 
                    placeholder="ABC123" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicle_seats">Seats</Label>
                  <Input 
                    id="vehicle_seats" 
                    name="vehicle_seats" 
                    type="number" 
                    value={formData.vehicle_seats} 
                    onChange={handleInputChange} 
                    min="1" 
                    max="8" 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="service_type_id">Service Type</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("service_type_id", value)} 
                  value={formData.service_type_id}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Standard Ride</SelectItem>
                    <SelectItem value="2">Premium Ride</SelectItem>
                    <SelectItem value="3">Cargo/Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Documents & Selfie</h2>
            <p className="text-sm text-gray-600 text-center mb-4">Upload clear images of your documents and a selfie</p>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* License Front */}
                <DocumentUploadField
                  id="license_front"
                  label="Driver's License (Front)"
                  isUploading={uploadingDocs.license_front}
                  isUploaded={!!documents.license_front}
                  onChange={(e) => handleFileChange(e, "license_front")}
                />

                {/* License Back */}
                <DocumentUploadField
                  id="license_back"
                  label="Driver's License (Back)"
                  isUploading={uploadingDocs.license_back}
                  isUploaded={!!documents.license_back}
                  onChange={(e) => handleFileChange(e, "license_back")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Vehicle Registration */}
                <DocumentUploadField
                  id="vehicle_registration"
                  label="Vehicle Registration"
                  isUploading={uploadingDocs.vehicle_registration}
                  isUploaded={!!documents.vehicle_registration}
                  onChange={(e) => handleFileChange(e, "vehicle_registration")}
                />

                {/* Vehicle Insurance */}
                <DocumentUploadField
                  id="vehicle_insurance"
                  label="Vehicle Insurance"
                  isUploading={uploadingDocs.vehicle_insurance}
                  isUploaded={!!documents.vehicle_insurance}
                  onChange={(e) => handleFileChange(e, "vehicle_insurance")}
                />
              </div>

              {/* Selfie */}
              <div className="space-y-2 mt-6 p-4 border rounded-md bg-gray-50">
                <Label className="text-lg font-semibold block mb-2">Selfie Verification</Label>
                <p className="text-sm text-gray-600 mb-3">
                  Take a selfie holding your ID next to your face
                </p>
                
                <div className="flex items-center gap-4">
                  <Input 
                    id="selfie" 
                    type="file" 
                    accept="image/*" 
                    capture="user"
                    onChange={(e) => handleFileChange(e, "selfie")} 
                    disabled={uploadingDocs.selfie}
                    className="flex-1"
                  />
                  
                  {uploadingDocs.selfie && (
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  )}
                  
                  {documents.selfie && !uploadingDocs.selfie && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                </div>

                {selfiePreview && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-700 mb-2">Preview:</p>
                    <img 
                      src={selfiePreview} 
                      alt="Selfie preview" 
                      className="max-w-full h-auto rounded-md border max-h-64 mx-auto"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 mt-6">
                <Checkbox 
                  id="terms" 
                  checked={agreedToTerms} 
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)} 
                  disabled={loading} 
                />
                <Label htmlFor="terms" className="text-sm font-medium">
                  I agree to the <a href="#" className="underline text-blue-600">Terms and Conditions</a>
                </Label>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const steps = [
    { title: "Driver Details", icon: Car },
    { title: "Vehicle Details", icon: Car },
    { title: "Documents & Selfie", icon: UploadCloud },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Driver Registration
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join us as a driver in a few simple steps
          </p>
        </div>

        {/* Social Login for Drivers */}
        <div className="pt-2">
          <SocialLogin role="driver" />
        </div>

        {/* Step Indicator */}
        <div className="flex justify-between items-center py-4 px-2 bg-gray-100 rounded-md">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center flex-1 text-center ${
                index + 1 === currentStep ? "text-blue-600 font-bold" : "text-gray-500"
              }`}
            >
              <step.icon className={`h-6 w-6 mb-1 ${
                index + 1 === currentStep ? "text-blue-600" : "text-gray-400"
              }`} />
              <span className="text-xs sm:text-sm">
                Step {index + 1}: {step.title}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md border border-red-200">
              {error}
            </div>
          )}

          {renderStepContent()}

          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <Button 
                type="button" 
                onClick={handlePrevStep} 
                variant="outline" 
                disabled={loading}
              >
                Previous
              </Button>
            )}
            {currentStep < steps.length && (
              <Button 
                type="button" 
                onClick={handleNextStep} 
                disabled={loading} 
                className="ml-auto"
              >
                Next
              </Button>
            )}
            {currentStep === steps.length && (
              <Button 
                type="submit" 
                disabled={loading || Object.keys(uploadingDocs).length > 0} 
                className="w-full md:w-auto ml-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : Object.keys(uploadingDocs).length > 0 ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading documents...
                  </>
                ) : (
                  <>
                    <Car className="mr-2 h-4 w-4" />
                    Complete Registration
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// Component for document upload fields with loading and check states
function DocumentUploadField({ id, label, isUploading, isUploaded, onChange }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-3">
        <Input 
          id={id} 
          type="file" 
          onChange={onChange} 
          accept="image/*,application/pdf" 
          disabled={isUploading}
          className="flex-1"
        />
        {isUploading && (
          <Loader2 className="w-5 h-5 animate-spin text-blue-600 flex-shrink-0" />
        )}
        {isUploaded && !isUploading && (
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
        )}
      </div>
    </div>
  );
}

DocumentUploadField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isUploading: PropTypes.bool,
  isUploaded: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};
