
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, ArrowRight, Phone, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import WelcomeStep from "./interactive-steps/WelcomeStep";
import EmergencyCheck from "./interactive-steps/EmergencyCheck";
import CrimeTypeSelection from "./interactive-steps/CrimeTypeSelection";
import LocationFlow from "./interactive-steps/LocationFlow";
import IncidentTimeFlow from "./interactive-steps/IncidentTimeFlow";
import IncidentDescriptionFlow from "./interactive-steps/IncidentDescriptionFlow";
import EvidenceFlow from "./interactive-steps/EvidenceFlow";
import ContactPreferences from "./interactive-steps/ContactPreferences";
import FinalReview from "./interactive-steps/FinalReview";
import { toast } from "@/hooks/use-toast";

export interface FormData {
  wantsToReport: boolean;
  isEmergency: boolean;
  crimeType: string;
  crimeDetails: string;
  location: {
    state: string;
    lga: string;
    specificArea: string;
  };
  incidentTime: {
    when: string;
    date: string;
    time: string;
  };
  description: string;
  witnessInfo: string;
  evidence: {
    hasEvidence: boolean;
    files: File[];
  };
  safety: {
    criminalPresent: string;
    currentlySafe: boolean;
  };
  contact: {
    isAnonymous: boolean;
    contactInfo: string;
  };
}

const InteractiveReportForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    wantsToReport: false,
    isEmergency: false,
    crimeType: "",
    crimeDetails: "",
    location: { state: "", lga: "", specificArea: "" },
    incidentTime: { when: "", date: "", time: "" },
    description: "",
    witnessInfo: "",
    evidence: { hasEvidence: false, files: [] },
    safety: { criminalPresent: "", currentlySafe: true },
    contact: { isAnonymous: true, contactInfo: "" }
  });

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const getStepComponent = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={nextStep} onUpdate={updateFormData} data={formData} />;
      case 1:
        return <EmergencyCheck onNext={nextStep} onBack={prevStep} onUpdate={updateFormData} data={formData} />;
      case 2:
        return <CrimeTypeSelection onNext={nextStep} onBack={prevStep} onUpdate={updateFormData} data={formData} />;
      case 3:
        return <LocationFlow onNext={nextStep} onBack={prevStep} onUpdate={updateFormData} data={formData} />;
      case 4:
        return <IncidentTimeFlow onNext={nextStep} onBack={prevStep} onUpdate={updateFormData} data={formData} />;
      case 5:
        return <IncidentDescriptionFlow onNext={nextStep} onBack={prevStep} onUpdate={updateFormData} data={formData} />;
      case 6:
        return <EvidenceFlow onNext={nextStep} onBack={prevStep} onUpdate={updateFormData} data={formData} />;
      case 7:
        return <ContactPreferences onNext={nextStep} onBack={prevStep} onUpdate={updateFormData} data={formData} />;
      case 8:
        return <FinalReview onBack={prevStep} data={formData} />;
      default:
        return <WelcomeStep onNext={nextStep} onUpdate={updateFormData} data={formData} />;
    }
  };

  const getProgressPercentage = () => {
    if (!formData.wantsToReport) return 0;
    if (formData.isEmergency) return 100; // Emergency flow is complete
    return ((currentStep) / 8) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/0300e6fb-5eb3-4bee-9542-d2935a35734c.png" 
                alt="Defence Headquarters Logo" 
                className="h-12 w-12 object-contain"
              />
              <div>
                <h1 className="text-lg font-bold text-green-800">Crime Reporting Portal</h1>
                <p className="text-sm text-green-600">Secure & Confidential</p>
              </div>
            </Link>
            <div className="flex items-center space-x-2 text-green-700">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Protected & Anonymous</span>
            </div>
          </div>
        </div>
      </header>

      {/* Security Assurance Bar */}
      <div className="bg-green-800 text-white py-2 overflow-hidden">
        <div className="animate-scroll whitespace-nowrap">
          <span className="inline-block px-8">
            🔒 Your identity is protected • All information is encrypted • Anonymous reporting enabled • 
            Professional response guaranteed • Safe and secure reporting •
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar - Only show if user wants to report and it's not emergency */}
          {formData.wantsToReport && !formData.isEmergency && (
            <div className="mb-6 bg-white rounded-lg p-4 border border-green-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-green-800">Progress</span>
                <span className="text-sm text-green-600">{Math.round(getProgressPercentage())}% complete</span>
              </div>
              <div className="w-full bg-green-100 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Main Content Card */}
          <Card className="border-green-200 shadow-lg">
            <CardContent className="p-8">
              {getStepComponent()}
            </CardContent>
          </Card>

          {/* Emergency Contact - Always visible */}
          <div className="mt-6 text-center">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-center space-x-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">Emergency? Call 199 immediately</span>
                  <Phone className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveReportForm;
