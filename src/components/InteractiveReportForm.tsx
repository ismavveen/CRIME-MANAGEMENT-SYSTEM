
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import WelcomeStep from './interactive-steps/WelcomeStep';
import EmergencyCheck from './interactive-steps/EmergencyCheck';
import EmergencyLocationPrompt from './interactive-steps/EmergencyLocationPrompt';
import CrimeTypeSelection from './interactive-steps/CrimeTypeSelection';
import LocationFlow from './interactive-steps/LocationFlow';
import IncidentTimeFlow from './interactive-steps/IncidentTimeFlow';
import IncidentDescriptionFlow from './interactive-steps/IncidentDescriptionFlow';
import EvidenceFlow from './interactive-steps/EvidenceFlow';
import ContactPreferences from './interactive-steps/ContactPreferences';
import FinalReview from './interactive-steps/FinalReview';

export interface FormData {
  // Basic info
  crimeType: string;
  isEmergency: boolean;
  emergencyLocation?: {
    latitude: number;
    longitude: number;
    timestamp: string;
    accuracy?: number;
  } | null;
  
  // Location details
  state: string;
  lga: string;
  specificLocation: string;
  locationDescription: string;
  
  // Time details
  incidentDate: string;
  incidentTime: string;
  timeFrame: string;
  
  // Incident details
  incidentDescription: string;
  suspectDescription: string;
  witnessAvailable: boolean;
  
  // Evidence
  hasEvidence: boolean;
  evidenceFiles: File[];
  evidenceDescription: string;
  
  // Contact preferences
  wantsContact: boolean;
  contactMethod: string;
  contactInfo: string;
  anonymousReport: boolean;
}

const InteractiveReportForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    crimeType: '',
    isEmergency: false,
    emergencyLocation: null,
    state: '',
    lga: '',
    specificLocation: '',
    locationDescription: '',
    incidentDate: '',
    incidentTime: '',
    timeFrame: '',
    incidentDescription: '',
    suspectDescription: '',
    witnessAvailable: false,
    hasEvidence: false,
    evidenceFiles: [],
    evidenceDescription: '',
    wantsContact: false,
    contactMethod: '',
    contactInfo: '',
    anonymousReport: true,
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const steps = [
    <WelcomeStep key="welcome" onNext={nextStep} />,
    <EmergencyCheck 
      key="emergency-check" 
      onNext={nextStep} 
      onBack={prevStep} 
      onUpdate={updateFormData}
      data={formData}
    />,
    ...(formData.isEmergency ? [
      <EmergencyLocationPrompt
        key="emergency-location"
        onNext={nextStep}
        onBack={prevStep}
        onUpdate={updateFormData}
        data={formData}
      />
    ] : []),
    <CrimeTypeSelection 
      key="crime-type" 
      onNext={nextStep} 
      onBack={prevStep} 
      onUpdate={updateFormData}
      data={formData}
    />,
    <LocationFlow 
      key="location" 
      onNext={nextStep} 
      onBack={prevStep} 
      onUpdate={updateFormData}
      data={formData}
    />,
    <IncidentTimeFlow 
      key="time" 
      onNext={nextStep} 
      onBack={prevStep} 
      onUpdate={updateFormData}
      data={formData}
    />,
    <IncidentDescriptionFlow 
      key="description" 
      onNext={nextStep} 
      onBack={prevStep} 
      onUpdate={updateFormData}
      data={formData}
    />,
    <EvidenceFlow 
      key="evidence" 
      onNext={nextStep} 
      onBack={prevStep} 
      onUpdate={updateFormData}
      data={formData}
    />,
    <ContactPreferences 
      key="contact" 
      onNext={nextStep} 
      onBack={prevStep} 
      onUpdate={updateFormData}
      data={formData}
    />,
    <FinalReview 
      key="review" 
      onBack={prevStep} 
      data={formData}
    />,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            {steps[currentStep]}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InteractiveReportForm;
