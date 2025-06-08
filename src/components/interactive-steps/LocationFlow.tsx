
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, ArrowLeft, ArrowRight, Info } from "lucide-react";
import { FormData } from "../InteractiveReportForm";

interface LocationFlowProps {
  onNext: () => void;
  onBack: () => void;
  onUpdate: (data: Partial<FormData>) => void;
  data: FormData;
}

const LocationFlow = ({ onNext, onBack, onUpdate, data }: LocationFlowProps) => {
  const [currentLocationStep, setCurrentLocationStep] = useState(0);

  const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
    "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano",
    "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
    "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
  ];

  const lgaByState: { [key: string]: string[] } = {
    "Lagos": [
      "Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe", "Eti-Osa", 
      "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", 
      "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"
    ],
    "FCT": [
      "Abaji", "Bwari", "Gwagwalada", "Kuje", "Municipal Area Council", "Kwali"
    ],
    "Kano": [
      "Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", 
      "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam", "Gaya", "Gezawa", 
      "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", 
      "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa", "Rano", "Rimin Gado", "Rogo", "Shanono", 
      "Sumaila", "Takai", "Tarauni", "Tofa", "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"
    ]
  };

  const handleLocationUpdate = (field: string, value: string) => {
    const newLocation = { ...data.location, [field]: value };
    if (field === "state") {
      newLocation.lga = ""; // Reset LGA when state changes
    }
    onUpdate({ location: newLocation });
  };

  const canProceedToNext = () => {
    switch (currentLocationStep) {
      case 0: return data.location.state !== "";
      case 1: return data.location.lga !== "";
      case 2: return true; // Specific area is optional
      default: return false;
    }
  };

  const handleStepNext = () => {
    if (currentLocationStep < 2) {
      setCurrentLocationStep(currentLocationStep + 1);
    } else {
      onNext();
    }
  };

  const renderLocationStep = () => {
    switch (currentLocationStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                In which state did this incident occur?
              </h3>
              <p className="text-green-600">
                This helps us route your report to the appropriate local authorities.
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <Select value={data.location.state} onValueChange={(value) => handleLocationUpdate("state", value)}>
                <SelectTrigger className="border-green-300 h-12 text-lg">
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  {nigerianStates.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Which Local Government Area in {data.location.state}?
              </h3>
              <p className="text-green-600">
                This helps us direct your report to the right local security team.
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <Select value={data.location.lga} onValueChange={(value) => handleLocationUpdate("lga", value)}>
                <SelectTrigger className="border-green-300 h-12 text-lg">
                  <SelectValue placeholder="Select your LGA" />
                </SelectTrigger>
                <SelectContent>
                  {lgaByState[data.location.state] ? (
                    lgaByState[data.location.state].map((lga) => (
                      <SelectItem key={lga} value={lga}>{lga}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="not-listed">My LGA is not listed</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Can you provide more specific location details?
              </h3>
              <p className="text-green-600">
                This step is optional but helps authorities locate the incident more precisely.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="specificArea" className="text-green-800 font-medium">
                  Specific Area Details (Optional)
                </Label>
                <Textarea
                  id="specificArea"
                  value={data.location.specificArea}
                  onChange={(e) => handleLocationUpdate("specificArea", e.target.value)}
                  placeholder="e.g., Near Unity Bank, Behind Central Market, Opposite Police Station, etc."
                  className="border-green-300 mt-2"
                  rows={3}
                />
              </div>
              
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-2">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Privacy Notice:</p>
                      <p>You can provide as much or as little location detail as you're comfortable with. Landmarks and general area descriptions are often sufficient.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <MapPin className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-800">Where did this incident occur?</h2>
      </div>

      {/* Location Step Indicator */}
      <div className="flex justify-center space-x-2 mb-6">
        {[0, 1, 2].map((step) => (
          <div
            key={step}
            className={`w-3 h-3 rounded-full transition-colors ${
              step <= currentLocationStep ? 'bg-green-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Current Step Content */}
      {renderLocationStep()}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button 
          variant="outline" 
          onClick={currentLocationStep === 0 ? onBack : () => setCurrentLocationStep(currentLocationStep - 1)}
          className="border-green-300 text-green-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        {canProceedToNext() && (
          <Button onClick={handleStepNext} className="bg-green-700 hover:bg-green-800">
            {currentLocationStep === 2 ? 'Continue' : 'Next'} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default LocationFlow;
