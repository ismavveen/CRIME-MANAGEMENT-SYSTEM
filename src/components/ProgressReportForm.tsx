
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReporterInfoStep from "./interactive-steps/ReporterInfoStep";
import CrimeDetailsStep from "./interactive-steps/CrimeDetailsStep";
import EvidenceUploadStep from "./interactive-steps/EvidenceUploadStep";
import ReviewSubmissionStep from "./interactive-steps/ReviewSubmissionStep";

interface ProgressReportFormProps {
  onSuccess?: (reportId: string, serialNumber: string) => void;
}

const ProgressReportForm = ({ onSuccess }: ProgressReportFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [locationData, setLocationData] = useState({
    latitude: null as number | null,
    longitude: null as number | null,
    accuracy: null as number | null,
    hasPermission: false,
    isLoading: false,
  });
  
  const [formData, setFormData] = useState({
    // Step 1: Reporter Information
    isAnonymous: true,
    reporterName: "",
    reporterPhone: "",
    reporterEmail: "",
    
    // Step 2: Crime Details
    state: "",
    localGovernment: "",
    reportTitle: "",
    description: "",
    urgency: "medium",
    threatType: "",
    
    // Step 3: Attachments
    images: [] as File[],
    videos: [] as File[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const steps = [
    { number: 1, title: "Reporter Information", completed: false },
    { number: 2, title: "Crime Details", completed: false },
    { number: 3, title: "Evidence & Media", completed: false },
    { number: 4, title: "Review & Submit", completed: false }
  ];

  const progress = (currentStep / steps.length) * 100;

  const requestLocationPermission = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support location services",
        variant: "destructive",
      });
      return;
    }

    setLocationData(prev => ({ ...prev, isLoading: true }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationData({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          hasPermission: true,
          isLoading: false,
        });
        
        toast({
          title: "Location enabled",
          description: `Location acquired with ±${position.coords.accuracy?.toFixed(0)}m accuracy`,
        });
      },
      (error) => {
        setLocationData(prev => ({ ...prev, isLoading: false }));
        toast({
          title: "Location access denied",
          description: "Please enable location services for better reporting",
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.isAnonymous) {
        if (!formData.reporterName.trim()) {
          newErrors.reporterName = "Name is required for non-anonymous reports";
        }
        if (!formData.reporterPhone.trim() && !formData.reporterEmail.trim()) {
          newErrors.contact = "Either phone or email is required for non-anonymous reports";
        }
      }
    }

    if (step === 2) {
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.localGovernment.trim()) newErrors.localGovernment = "Local Government Area is required";
      if (!formData.reportTitle.trim()) newErrors.reportTitle = "Report title is required";
      if (!formData.description.trim() || formData.description.length < 10) {
        newErrors.description = "Description must be at least 10 characters";
      }
      if (!formData.threatType) newErrors.threatType = "Threat type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ReporterInfoStep
            data={{
              isAnonymous: formData.isAnonymous,
              reporterName: formData.reporterName,
              reporterPhone: formData.reporterPhone,
              reporterEmail: formData.reporterEmail,
            }}
            onDataChange={handleInputChange}
            onNext={handleNext}
            errors={errors}
          />
        );

      case 2:
        return (
          <CrimeDetailsStep
            data={{
              state: formData.state,
              localGovernment: formData.localGovernment,
              reportTitle: formData.reportTitle,
              description: formData.description,
              urgency: formData.urgency,
              threatType: formData.threatType,
            }}
            locationData={locationData}
            onDataChange={handleInputChange}
            onLocationRequest={requestLocationPermission}
            onNext={handleNext}
            onBack={handleBack}
            errors={errors}
          />
        );

      case 3:
        return (
          <EvidenceUploadStep
            data={{
              images: formData.images,
              videos: formData.videos,
            }}
            onDataChange={handleInputChange}
            onNext={handleNext}
            onBack={handleBack}
            uploading={uploading}
          />
        );

      case 4:
        return (
          <ReviewSubmissionStep
            data={formData}
            locationData={locationData}
            onBack={handleBack}
            onSuccess={onSuccess || (() => {})}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <img 
          src="/lovable-uploads/0300e6fb-5eb3-4bee-9542-d2935a35734c.png" 
          alt="Defence Headquarters Logo" 
          className="h-16 w-16 object-contain mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold text-green-800 mb-2">Submit Crime Report</h1>
        <p className="text-green-600">Secure & Confidential Reporting System</p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.number 
                  ? 'bg-green-600 border-green-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-600'
              }`}>
                {currentStep > step.number ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  step.number
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`h-1 w-20 mx-2 ${
                  currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {steps[currentStep - 1]?.title}
          </h2>
        </div>
        
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-gray-500 text-center mt-2">
          Step {currentStep} of {steps.length} • {Math.round(progress)}% complete
        </p>
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {renderStepContent()}
      </div>

      {/* Security Notice */}
      <div className="text-center mt-8">
        <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
          <Shield className="h-4 w-4" />
          <span>All data is encrypted and secure • Your privacy is protected</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressReportForm;
