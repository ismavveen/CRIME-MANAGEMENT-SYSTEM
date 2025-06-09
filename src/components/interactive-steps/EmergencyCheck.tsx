import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Phone, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { FormData } from "../../types/FormData";

interface EmergencyCheckProps {
  onNext: () => void;
  onBack: () => void;
  onUpdate: (data: Partial<FormData>) => void;
  data: FormData;
}

const EmergencyCheck = ({ onNext, onBack, onUpdate }: EmergencyCheckProps) => {
  const handleEmergencyChoice = (isEmergency: boolean) => {
    onUpdate({ isEmergency });
    if (!isEmergency) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-800">Before we begin...</h2>
        <p className="text-green-600">
          Let's make sure you get the right kind of help as quickly as possible.
        </p>
      </div>

      {/* Main Question */}
      <div className="text-center space-y-6">
        <h3 className="text-xl font-semibold text-green-800">
          Is this an emergency requiring immediate response?
        </h3>
        <p className="text-green-600">
          An emergency is when someone is in immediate danger or a crime is happening right now.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Emergency - Yes */}
          <Card 
            className="cursor-pointer border-2 border-red-200 hover:border-red-400 hover:shadow-lg transition-all duration-200 group"
            onClick={() => handleEmergencyChoice(true)}
          >
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4 group-hover:text-red-700 transition-colors" />
              <h4 className="font-semibold text-red-800 mb-2">Yes, this is an emergency</h4>
              <p className="text-sm text-red-600 mb-4">
                Someone is in immediate danger or a crime is happening now
              </p>
              <Button className="bg-red-600 hover:bg-red-700 w-full group-hover:shadow-md transition-all">
                <Phone className="mr-2 h-4 w-4" />
                Call 199 Now
              </Button>
            </CardContent>
          </Card>

          {/* Not Emergency */}
          <Card 
            className="cursor-pointer border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all duration-200 group"
            onClick={() => handleEmergencyChoice(false)}
          >
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 text-green-600 mx-auto mb-4 group-hover:text-green-700 transition-colors" />
              <h4 className="font-semibold text-green-800 mb-2">No, this can wait</h4>
              <p className="text-sm text-green-600 mb-4">
                This happened in the past or there's no immediate danger
              </p>
              <Button className="bg-green-700 hover:bg-green-800 w-full group-hover:shadow-md transition-all">
                Continue Report <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Emergency Instructions */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <h4 className="font-semibold text-red-800 mb-2 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            If this is an emergency:
          </h4>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• Call 199 immediately for emergency response</li>
            <li>• If safe to do so, move to a secure location</li>
            <li>• Stay on the line with emergency services</li>
            <li>• You can still file this report later for documentation</li>
          </ul>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="border-green-300 text-green-700">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    </div>
  );
};

export default EmergencyCheck;
