
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileText, Users, Shield, AlertTriangle, ArrowLeft, ArrowRight } from "lucide-react";
import { FormData } from "../InteractiveReportForm";

interface IncidentDescriptionFlowProps {
  onNext: () => void;
  onBack: () => void;
  onUpdate: (data: Partial<FormData>) => void;
  data: FormData;
}

const IncidentDescriptionFlow = ({ onNext, onBack, onUpdate, data }: IncidentDescriptionFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleSafetyUpdate = (field: string, value: string | boolean) => {
    const newSafety = { ...data.safety, [field]: value };
    onUpdate({ safety: newSafety });
  };

  const canProceedFromSafety = () => {
    return data.safety.criminalPresent !== "";
  };

  const canProceedFromDescription = () => {
    return data.description.trim().length >= 10;
  };

  const handleStepNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      onNext();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                First, let's check on your safety
              </h3>
              <p className="text-green-600">
                Is the person who committed this crime still at the location?
              </p>
            </div>

            <RadioGroup 
              value={data.safety.criminalPresent} 
              onValueChange={(value) => handleSafetyUpdate("criminalPresent", value)}
              className="space-y-3"
            >
              <Card className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="yes" id="criminal-yes" />
                  <Label htmlFor="criminal-yes" className="flex-1 cursor-pointer">
                    <div className="font-medium text-red-700">Yes, they're still here</div>
                    <div className="text-sm text-red-600">The suspect is still at the scene</div>
                  </Label>
                </div>
              </Card>

              <Card className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="no" id="criminal-no" />
                  <Label htmlFor="criminal-no" className="flex-1 cursor-pointer">
                    <div className="font-medium text-green-700">No, they left</div>
                    <div className="text-sm text-green-600">The suspect is no longer at the scene</div>
                  </Label>
                </div>
              </Card>

              <Card className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="unknown" id="criminal-unknown" />
                  <Label htmlFor="criminal-unknown" className="flex-1 cursor-pointer">
                    <div className="font-medium text-gray-700">I don't know</div>
                    <div className="text-sm text-gray-600">I'm not sure about the suspect's location</div>
                  </Label>
                </div>
              </Card>
            </RadioGroup>

            {data.safety.criminalPresent === "yes" && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-800">Are you currently safe?</span>
                  </div>
                  <RadioGroup 
                    value={data.safety.currentlySafe ? "safe" : "unsafe"} 
                    onValueChange={(value) => handleSafetyUpdate("currentlySafe", value === "safe")}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="safe" id="safety-safe" />
                      <Label htmlFor="safety-safe" className="text-red-700">Yes, I'm in a safe location</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unsafe" id="safety-unsafe" />
                      <Label htmlFor="safety-unsafe" className="text-red-700">No, I need immediate help</Label>
                    </div>
                  </RadioGroup>
                  
                  {data.safety.currentlySafe === false && (
                    <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded">
                      <p className="text-red-800 text-sm font-medium">
                        ⚠️ Please call 199 immediately if you're in danger. Move to a safe location if possible.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Tell us what happened
              </h3>
              <p className="text-green-600">
                Describe the incident in your own words. Include as much detail as you feel comfortable sharing.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="description" className="text-green-800 font-medium">
                  Incident Description
                </Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  placeholder="Describe what happened... Who was involved? What did you see or hear? What actions were taken?"
                  rows={6}
                  className="border-green-300 mt-2"
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="text-sm text-green-600">
                    {data.description.length} characters
                    {data.description.length < 10 && " (minimum 10 characters)"}
                  </div>
                  {data.description.length >= 10 && (
                    <div className="text-sm text-green-600 flex items-center">
                      <Shield className="h-4 w-4 mr-1" />
                      Auto-saved
                    </div>
                  )}
                </div>
              </div>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Helpful Tips:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Include what you saw, heard, or experienced</li>
                    <li>• Describe any people involved (appearance, clothing, etc.)</li>
                    <li>• Mention any vehicles, weapons, or objects involved</li>
                    <li>• Note the sequence of events if relevant</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Were there any witnesses?
              </h3>
              <p className="text-green-600">
                This information is optional but can be helpful for the investigation.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="witnessInfo" className="text-green-800 font-medium">
                  Witness Information (Optional)
                </Label>
                <Textarea
                  id="witnessInfo"
                  value={data.witnessInfo}
                  onChange={(e) => onUpdate({ witnessInfo: e.target.value })}
                  placeholder="If there were witnesses, please provide their details only if they have given permission to be contacted..."
                  rows={4}
                  className="border-green-300 mt-2"
                />
              </div>

              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">Important Note:</h4>
                  <p className="text-sm text-yellow-700">
                    Only include witness contact information if you have their explicit permission. 
                    You can also just describe that witnesses were present without providing their details.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return canProceedFromSafety();
      case 1: return canProceedFromDescription();
      case 2: return true; // Witness info is optional
      default: return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex justify-center space-x-2 mb-6">
        {[0, 1, 2].map((step) => (
          <div
            key={step}
            className={`w-3 h-3 rounded-full transition-colors ${
              step <= currentStep ? 'bg-green-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Current Step Content */}
      {renderStep()}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button 
          variant="outline" 
          onClick={currentStep === 0 ? onBack : () => setCurrentStep(currentStep - 1)}
          className="border-green-300 text-green-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        {canProceed() && (
          <Button onClick={handleStepNext} className="bg-green-700 hover:bg-green-800">
            {currentStep === 2 ? 'Continue' : 'Next'} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default IncidentDescriptionFlow;
