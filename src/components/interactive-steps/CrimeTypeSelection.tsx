import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Shield, 
  CreditCard, 
  Smartphone, 
  Car, 
  Users, 
  AlertTriangle, 
  Building, 
  Globe,
  ArrowLeft, 
  ArrowRight,
  HelpCircle
} from "lucide-react";
import { FormData } from "../InteractiveReportForm";

interface CrimeTypeSelectionProps {
  onNext: () => void;
  onBack: () => void;
  onUpdate: (data: Partial<FormData>) => void;
  data: FormData;
}

const CrimeTypeSelection = ({ onNext, onBack, onUpdate, data }: CrimeTypeSelectionProps) => {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherDescription, setOtherDescription] = useState("");

  const crimeTypes = [
    {
      id: "theft",
      title: "Theft/Robbery",
      description: "Stealing, burglary, armed robbery",
      icon: Shield,
      color: "red"
    },
    {
      id: "assault",
      title: "Assault/Violence",
      description: "Physical violence, threats, harassment",
      icon: AlertTriangle,
      color: "orange"
    },
    {
      id: "fraud",
      title: "Fraud/Scam",
      description: "Financial fraud, scams, identity theft",
      icon: CreditCard,
      color: "blue"
    },
    {
      id: "cyber",
      title: "Cybercrime",
      description: "Online fraud, hacking, cyber threats",
      icon: Smartphone,
      color: "purple"
    },
    {
      id: "vehicle",
      title: "Vehicle Crime",
      description: "Car theft, vandalism, traffic incidents",
      icon: Car,
      color: "green"
    },
    {
      id: "drugs",
      title: "Drug-related",
      description: "Drug dealing, substance abuse",
      icon: Building,
      color: "yellow"
    },
    {
      id: "trafficking",
      title: "Human Trafficking",
      description: "Forced labor, sexual exploitation",
      icon: Users,
      color: "red"
    },
    {
      id: "terrorism",
      title: "Security Threat",
      description: "Terrorism, suspicious packages/activities",
      icon: Globe,
      color: "red"
    }
  ];

  const handleCrimeTypeSelect = (crimeType: string) => {
    if (crimeType === "other") {
      setShowOtherInput(true);
      onUpdate({ crimeType: "other" });
    } else {
      const selectedType = crimeTypes.find(type => type.id === crimeType);
      onUpdate({ 
        crimeType: selectedType?.title || crimeType,
        crimeDetails: selectedType?.description || ""
      });
      setShowOtherInput(false);
    }
  };

  const handleOtherSubmit = () => {
    if (otherDescription.trim()) {
      onUpdate({ 
        crimeType: "Other",
        crimeDetails: otherDescription.trim()
      });
      onNext();
    }
  };

  const handleContinue = () => {
    if (data.crimeType && data.crimeType !== "other") {
      onNext();
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      red: "border-red-200 hover:border-red-400 text-red-700",
      orange: "border-orange-200 hover:border-orange-400 text-orange-700",
      blue: "border-blue-200 hover:border-blue-400 text-blue-700",
      purple: "border-purple-200 hover:border-purple-400 text-purple-700",
      green: "border-green-200 hover:border-green-400 text-green-700",
      yellow: "border-yellow-200 hover:border-yellow-400 text-yellow-700"
    };
    return colorMap[color as keyof typeof colorMap] || "border-gray-200 hover:border-gray-400 text-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-green-800">What type of incident would you like to report?</h2>
        <p className="text-green-600">
          Select the category that best describes what happened. This helps us route your report to the right team.
        </p>
      </div>

      {/* Crime Type Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {crimeTypes.map((type) => {
          const IconComponent = type.icon;
          const isSelected = data.crimeType === type.title;
          
          return (
            <Card 
              key={type.id}
              className={`cursor-pointer border-2 transition-all duration-200 hover:shadow-lg ${
                isSelected 
                  ? 'border-green-400 bg-green-50' 
                  : getColorClasses(type.color)
              }`}
              onClick={() => handleCrimeTypeSelect(type.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <IconComponent className={`h-8 w-8 mt-1 ${isSelected ? 'text-green-600' : ''}`} />
                  <div className="flex-1">
                    <h4 className={`font-semibold mb-1 ${isSelected ? 'text-green-800' : ''}`}>
                      {type.title}
                    </h4>
                    <p className={`text-sm ${isSelected ? 'text-green-600' : 'text-gray-600'}`}>
                      {type.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Other Option */}
        <Card 
          className={`cursor-pointer border-2 transition-all duration-200 hover:shadow-lg ${
            data.crimeType === "Other" || showOtherInput
              ? 'border-green-400 bg-green-50' 
              : 'border-gray-200 hover:border-gray-400'
          }`}
          onClick={() => handleCrimeTypeSelect("other")}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <HelpCircle className={`h-8 w-8 mt-1 ${showOtherInput ? 'text-green-600' : 'text-gray-600'}`} />
              <div className="flex-1">
                <h4 className={`font-semibold mb-1 ${showOtherInput ? 'text-green-800' : ''}`}>
                  Other
                </h4>
                <p className={`text-sm ${showOtherInput ? 'text-green-600' : 'text-gray-600'}`}>
                  Something else not listed above
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Other Crime Type Input */}
      {showOtherInput && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 space-y-4">
            <div>
              <Label htmlFor="otherType" className="text-green-800 font-medium">
                Please describe the type of incident:
              </Label>
              <Input
                id="otherType"
                value={otherDescription}
                onChange={(e) => setOtherDescription(e.target.value)}
                placeholder="e.g., Vandalism, Noise complaint, etc."
                className="mt-2 border-green-300"
                autoFocus
              />
            </div>
            <Button 
              onClick={handleOtherSubmit}
              disabled={!otherDescription.trim()}
              className="bg-green-700 hover:bg-green-800"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="border-green-300 text-green-700">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        {data.crimeType && data.crimeType !== "other" && !showOtherInput && (
          <Button onClick={handleContinue} className="bg-green-700 hover:bg-green-800">
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CrimeTypeSelection;
