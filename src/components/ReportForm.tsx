
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Shield, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import BasicIncidentInfo from "./form-steps/BasicIncidentInfo";
import IncidentDetails from "./form-steps/IncidentDetails";
import SubmitAndChannels from "./form-steps/SubmitAndChannels";

const ReportForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    location: "",
    criminalAtScene: "",
    safetyStatus: "",
    hasMediaEvidence: false,
    mediaFiles: [],
    dateTime: null,
    crimeCategory: "",
    otherCategory: "",
    description: "",
    witnessInfo: "",
    isAnonymous: true,
    contactInfo: "",
    reportingChannel: "web"
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Basic Incident Information";
      case 2: return "Incident Details";
      case 3: return "Submit Report";
      default: return "";
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicIncidentInfo 
            data={formData} 
            onUpdate={updateFormData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <IncidentDetails 
            data={formData} 
            onUpdate={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <SubmitAndChannels 
            data={formData} 
            onUpdate={updateFormData}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
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
              </div>
            </Link>
            <div className="flex items-center space-x-2 text-green-700">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Secure & Anonymous</span>
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
          {/* Progress Section */}
          <Card className="mb-6 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-green-800">{getStepTitle()}</h2>
                <span className="text-sm text-green-600">Step {currentStep} of {totalSteps}</span>
              </div>
              <Progress value={progress} className="h-2 mb-2" />
              <p className="text-sm text-green-600">Progress: {Math.round(progress)}% complete</p>
            </CardContent>
          </Card>

          {/* Form Content */}
          <Card className="border-green-200">
            <CardContent className="p-6">
              {renderStep()}
            </CardContent>
          </Card>

          {/* Auto-save indicator */}
          <div className="mt-4 text-center">
            <p className="text-sm text-green-600 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Your progress is automatically saved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;
