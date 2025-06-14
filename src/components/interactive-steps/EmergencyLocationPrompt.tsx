
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Shield, AlertTriangle, ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { FormData } from "../../types/FormData";
import { toast } from "@/hooks/use-toast";

interface EmergencyLocationPromptProps {
  onNext: () => void;
  onBack: () => void;
  onUpdate: (data: Partial<FormData>) => void;
  data: FormData;
}

const EmergencyLocationPrompt = ({ onNext, onBack, onUpdate, data }: EmergencyLocationPromptProps) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationShared, setLocationShared] = useState(false);

  const handleLocationShare = async () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Location not available",
        description: "Your device doesn't support location sharing. You can still continue with your report.",
        variant: "destructive"
      });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Location shared:", { latitude, longitude });
        
        onUpdate({ 
          emergencyLocation: {
            latitude,
            longitude,
            timestamp: new Date().toISOString(),
            accuracy: position.coords.accuracy
          }
        });
        
        setLocationShared(true);
        setIsGettingLocation(false);
        
        toast({
          title: "Location shared successfully",
          description: "Emergency responders can now locate you faster.",
        });
      },
      (error) => {
        console.error("Location error:", error);
        setIsGettingLocation(false);
        
        toast({
          title: "Couldn't get location",
          description: "Please check your location permissions or continue without sharing location.",
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSkipLocation = () => {
    onUpdate({ emergencyLocation: null });
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-red-800">Emergency Assistance</h2>
        <p className="text-red-600">
          Are you currently in danger and require immediate assistance?
        </p>
      </div>

      {/* Main Question */}
      <div className="text-center space-y-6">
        <h3 className="text-xl font-semibold text-red-800">
          Sharing your location helps responders find and assist you faster
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {/* Share Location - Emergency */}
          <Card className="border-2 border-red-300 bg-red-50">
            <CardContent className="p-6 text-center">
              <MapPin className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h4 className="font-semibold text-red-800 mb-2">Share My Location Now</h4>
              <p className="text-sm text-red-600 mb-4">
                This will immediately alert emergency responders to your exact location
              </p>
              <Button 
                onClick={handleLocationShare}
                disabled={isGettingLocation || locationShared}
                className="bg-red-600 hover:bg-red-700 w-full text-white font-semibold"
              >
                {isGettingLocation ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Getting Location...
                  </>
                ) : locationShared ? (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Location Shared ✓
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-4 w-4" />
                    Share Location
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Continue Without Location */}
          <Card className="border-2 border-gray-300 hover:border-gray-400 cursor-pointer" onClick={handleSkipLocation}>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-600 mb-2">I'll provide my location manually</p>
              <Button variant="outline" className="w-full">
                Continue Without Location <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Privacy & Security Information */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <h4 className="font-semibold text-green-800 mb-2 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Your Privacy & Security:
          </h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Location data is encrypted and only shared with emergency responders</li>
            <li>• Your exact coordinates are not stored permanently</li>
            <li>• Location sharing can be disabled at any time</li>
            <li>• This helps responders reach you faster in critical situations</li>
          </ul>
        </CardContent>
      </Card>

      {/* Success State - Continue Button */}
      {locationShared && (
        <div className="text-center">
          <Button onClick={onNext} className="bg-green-700 hover:bg-green-800 text-white px-8">
            Continue Report <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="border-green-300 text-green-700">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    </div>
  );
};

export default EmergencyLocationPrompt;
