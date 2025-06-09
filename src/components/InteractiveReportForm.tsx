import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Phone, Shield, Clock, FileText, AlertTriangle, Eye, Users, Mail, MapPin, Lock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "./Navigation";
import WelcomeStep from "./interactive-steps/WelcomeStep";
import EmergencyCheck from "./interactive-steps/EmergencyCheck";
import EmergencyLocationPrompt from "./interactive-steps/EmergencyLocationPrompt";
import CrimeTypeSelection from "./interactive-steps/CrimeTypeSelection";
import LocationFlow from "./interactive-steps/LocationFlow";
import IncidentTimeFlow from "./interactive-steps/IncidentTimeFlow";
import IncidentDescriptionFlow from "./interactive-steps/IncidentDescriptionFlow";
import EvidenceFlow from "./interactive-steps/EvidenceFlow";
import ContactPreferences from "./interactive-steps/ContactPreferences";
import VoiceReportStep from "./interactive-steps/VoiceReportStep";
import FinalReview from "./interactive-steps/FinalReview";

const InteractiveReportForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showInformation, setShowInformation] = useState(false);
  const [formData, setFormData] = useState({
    crimeType: "",
    location: "",
    incidentTime: "",
    description: "",
    evidence: [],
    contactPreference: "",
    voiceReport: null,
    isAnonymous: true,
  });

  const steps = [
    { component: WelcomeStep, title: "Welcome" },
    { component: EmergencyCheck, title: "Emergency Check" },
    { component: EmergencyLocationPrompt, title: "Emergency Location" },
    { component: CrimeTypeSelection, title: "Crime Type" },
    { component: LocationFlow, title: "Location" },
    { component: IncidentTimeFlow, title: "Time" },
    { component: IncidentDescriptionFlow, title: "Description" },
    { component: EvidenceFlow, title: "Evidence" },
    { component: ContactPreferences, title: "Contact" },
    { component: VoiceReportStep, title: "Voice Report" },
    { component: FinalReview, title: "Review" },
  ];

  const handleNext = (data: any) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const CurrentStepComponent = steps[currentStep]?.component;

  if (showInformation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <Navigation />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <img 
                  src="/lovable-uploads/0300e6fb-5eb3-4bee-9542-d2935a35734c.png" 
                  alt="Defence Headquarters Logo" 
                  className="h-16 w-16 object-contain mr-4"
                />
                <div>
                  <h1 className="text-3xl font-bold text-green-800">Crime Reporting Information</h1>
                  <p className="text-green-600">Everything you need to know about reporting crimes safely</p>
                </div>
              </div>
            </div>

            {/* Emergency Information */}
            <Card className="border-red-200 bg-red-50 mb-6">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-2" />
                  Emergency Situations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-red-700 font-medium">
                    If you are in immediate danger or witnessing a crime in progress, call <strong className="text-2xl">199</strong> immediately.
                  </p>
                  <p className="text-red-600">
                    Do not use the online reporting system for emergencies. Your safety is our priority.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* What You Can Report */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    What You Can Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-green-600 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Violent crimes (robbery, assault, kidnapping)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Suspicious activities and security threats
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Fraud and financial crimes
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Corruption and misconduct
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Drug-related offenses
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Cybercrime and online scams
                    </li>
                  </ul>
                  <div className="mt-3">
                    <Link to="/what-to-report">
                      <Button size="sm" variant="outline" className="border-green-600 text-green-600">
                        View Complete List
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Your Protection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-green-600 text-sm">
                    <li className="flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-green-500" />
                      100% Anonymous reporting available
                    </li>
                    <li className="flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-green-500" />
                      End-to-end encryption for all reports
                    </li>
                    <li className="flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-green-500" />
                      Whistleblower protection under law
                    </li>
                    <li className="flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-green-500" />
                      No personal information required
                    </li>
                    <li className="flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-green-500" />
                      Secure data handling protocols
                    </li>
                    <li className="flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-green-500" />
                      Professional investigation team
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Reporting Process */}
            <Card className="border-green-200 mb-6">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  How the Reporting Process Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-sm font-bold">1</div>
                    <h4 className="font-medium text-green-800 mb-1">Choose Method</h4>
                    <p className="text-xs text-green-600">Select your preferred reporting method</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-sm font-bold">2</div>
                    <h4 className="font-medium text-green-800 mb-1">Provide Details</h4>
                    <p className="text-xs text-green-600">Share incident information securely</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-sm font-bold">3</div>
                    <h4 className="font-medium text-green-800 mb-1">Submit Report</h4>
                    <p className="text-xs text-green-600">Your report is encrypted and sent</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-sm font-bold">4</div>
                    <h4 className="font-medium text-green-800 mb-1">Investigation</h4>
                    <p className="text-xs text-green-600">Professional team handles your case</p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Link to="/how-to-report">
                    <Button size="sm" variant="outline" className="border-green-600 text-green-600">
                      Detailed Guide
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Contact Methods */}
            <Card className="border-green-200 mb-6">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Alternative Contact Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border border-green-200 rounded-lg">
                    <Phone className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-medium text-green-800 mb-1">Phone</h4>
                    <p className="text-sm text-green-600 mb-1">Emergency: <strong>199</strong></p>
                    <p className="text-xs text-green-500">Non-emergency: +234-9-670-1000</p>
                  </div>
                  <div className="text-center p-4 border border-green-200 rounded-lg">
                    <Mail className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-medium text-green-800 mb-1">Email</h4>
                    <p className="text-sm text-green-600 mb-1">reports@defencehq.gov.ng</p>
                    <p className="text-xs text-green-500">Response within 24-48 hours</p>
                  </div>
                  <div className="text-center p-4 border border-green-200 rounded-lg">
                    <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-medium text-green-800 mb-1">SMS</h4>
                    <p className="text-sm text-green-600 mb-1">Text to: <strong>32123</strong></p>
                    <p className="text-xs text-green-500">Anonymous SMS available</p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Link to="/emergency-contacts">
                    <Button size="sm" variant="outline" className="border-green-600 text-green-600">
                      All Contact Methods
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Response Times */}
            <Card className="border-green-200 mb-6">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Response Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="text-red-800 font-medium">Emergency Cases</span>
                    <span className="text-red-600 font-bold">Immediate Response</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="text-orange-800 font-medium">High Priority Cases</span>
                    <span className="text-orange-600 font-bold">Within 24 Hours</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-green-800 font-medium">Standard Cases</span>
                    <span className="text-green-600 font-bold">Within 72 Hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center space-x-4">
              <Button 
                onClick={() => setShowInformation(false)}
                className="bg-green-700 hover:bg-green-800"
              >
                <FileText className="mr-2 h-4 w-4" />
                Start Report Now
              </Button>
              <Link to="/">
                <Button variant="outline" className="border-green-600 text-green-600">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Navigation />
      
      {/* Header with Logo */}
      <div className="bg-white border-b border-green-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <img 
              src="/lovable-uploads/0300e6fb-5eb3-4bee-9542-d2935a35734c.png" 
              alt="Defence Headquarters Logo" 
              className="h-12 w-12 object-contain mr-4"
            />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-green-800">Crime Reporting Portal</h1>
              <p className="text-green-600 text-sm">Secure & Confidential Reporting System</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {currentStep === 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Start Report Section */}
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800 text-center">
                    Start Anonymous Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-green-600 mb-6">
                    Begin the secure reporting process. Your identity will remain completely protected.
                  </p>
                  <Button 
                    onClick={() => handleNext({})}
                    className="bg-green-700 hover:bg-green-800 text-white font-bold px-8 py-3 text-lg"
                  >
                    <Shield className="mr-2 h-5 w-5" />
                    Report a Crime
                  </Button>
                </CardContent>
              </Card>

              {/* I Need Information Section */}
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800 text-center">
                    I Need Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-blue-600 mb-6">
                    Learn about the reporting process, your rights, and how we protect your identity.
                  </p>
                  <Button 
                    onClick={() => setShowInformation(true)}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 font-bold px-8 py-3 text-lg"
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    View Information
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            
            <div>
              {CurrentStepComponent && (
                <CurrentStepComponent
                  onNext={handleNext}
                  onBack={handleBack}
                  formData={formData}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveReportForm;
