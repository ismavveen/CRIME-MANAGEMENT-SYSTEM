
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, MapPin, FileText, AlertTriangle, Navigation, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CrimeDetailsStepProps {
  data: {
    state: string;
    localGovernment: string;
    reportTitle: string;
    description: string;
    urgency: string;
    threatType: string;
  };
  locationData: {
    latitude: number | null;
    longitude: number | null;
    hasPermission: boolean;
    isLoading: boolean;
  };
  onDataChange: (field: string, value: any) => void;
  onLocationRequest: () => void;
  onNext: () => void;
  onBack: () => void;
  errors: Record<string, string>;
}

const CrimeDetailsStep = ({ 
  data, 
  locationData, 
  onDataChange, 
  onLocationRequest, 
  onNext, 
  onBack, 
  errors 
}: CrimeDetailsStepProps) => {
  const { toast } = useToast();

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta',
    'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
    'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
    'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
  ];

  const threatTypes = [
    'Kidnapping', 'Banditry', 'Theft', 'Oil Vandalism', 'Intelligence',
    'Armed Robbery', 'Terrorism', 'Drug Trafficking', 'Human Trafficking',
    'Vandalism', 'Cybercrime', 'Fraud'
  ];

  const validateAndNext = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.state) newErrors.state = "State is required";
    if (!data.localGovernment.trim()) newErrors.localGovernment = "Local Government Area is required";
    if (!data.reportTitle.trim()) newErrors.reportTitle = "Report title is required";
    if (!data.description.trim() || data.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }
    if (!data.threatType) newErrors.threatType = "Threat type is required";

    if (Object.keys(newErrors).length === 0) {
      onNext();
    } else {
      toast({
        title: "Please complete all required fields",
        description: "Check the highlighted fields and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <FileText className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-800">Crime Details</h2>
        <p className="text-green-600 max-w-2xl mx-auto">
          Provide detailed information about the incident. The more specific you are, 
          the better we can respond and investigate.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Location Section */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <MapPin className="h-5 w-5" />
              <span>Location Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state" className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>State *</span>
                </Label>
                <Select value={data.state} onValueChange={(value) => onDataChange('state', value)}>
                  <SelectTrigger className={errors.state ? 'border-red-500' : 'border-green-300'}>
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    {nigerianStates.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && <p className="text-sm text-red-600">{errors.state}</p>}
              </div>

              <div>
                <Label htmlFor="localGovernment">Local Government Area *</Label>
                <Input
                  id="localGovernment"
                  value={data.localGovernment}
                  onChange={(e) => onDataChange('localGovernment', e.target.value)}
                  placeholder="Enter LGA name"
                  className={errors.localGovernment ? 'border-red-500' : 'border-green-300'}
                />
                {errors.localGovernment && <p className="text-sm text-red-600">{errors.localGovernment}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <Navigation className={`h-5 w-5 ${locationData.hasPermission ? 'text-green-600' : 'text-blue-600'}`} />
                <div>
                  <Label className="text-blue-800 font-semibold">Live Location Sharing</Label>
                  <p className="text-sm text-blue-700">
                    {locationData.hasPermission 
                      ? `Location enabled (precise coordinates captured)`
                      : 'Enable for precise incident location'
                    }
                  </p>
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                variant={locationData.hasPermission ? "secondary" : "default"}
                onClick={onLocationRequest}
                disabled={locationData.isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {locationData.isLoading ? "Acquiring..." : locationData.hasPermission ? "Enabled" : "Enable Location"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Incident Details */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <FileText className="h-5 w-5" />
              <span>Incident Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="reportTitle">Report Title *</Label>
              <Input
                id="reportTitle"
                value={data.reportTitle}
                onChange={(e) => onDataChange('reportTitle', e.target.value)}
                placeholder="Brief, descriptive title (e.g., 'Armed robbery at ABC Street')"
                className={errors.reportTitle ? 'border-red-500' : 'border-green-300'}
              />
              {errors.reportTitle && <p className="text-sm text-red-600">{errors.reportTitle}</p>}
            </div>

            <div>
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={(e) => onDataChange('description', e.target.value)}
                placeholder="Provide as much detail as possible: What happened? When? Who was involved? Any vehicles or weapons? Physical descriptions..."
                className={`min-h-[120px] ${errors.description ? 'border-red-500' : 'border-green-300'}`}
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-gray-500">{data.description.length}/1000 characters</p>
                <p className="text-sm text-gray-500">Minimum 10 characters</p>
              </div>
              {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="urgency">Priority Classification *</Label>
                <Select value={data.urgency} onValueChange={(value) => onDataChange('urgency', value)}>
                  <SelectTrigger className="border-green-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - General Information</SelectItem>
                    <SelectItem value="medium">Medium - Requires Attention</SelectItem>
                    <SelectItem value="high">High - Urgent Response</SelectItem>
                    <SelectItem value="critical">Critical - Immediate Action</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="threatType">Threat Classification *</Label>
                <Select value={data.threatType} onValueChange={(value) => onDataChange('threatType', value)}>
                  <SelectTrigger className={errors.threatType ? 'border-red-500' : 'border-green-300'}>
                    <SelectValue placeholder="Select threat category" />
                  </SelectTrigger>
                  <SelectContent>
                    {threatTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.threatType && <p className="text-sm text-red-600">{errors.threatType}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center max-w-2xl mx-auto">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex items-center space-x-2 border-green-300 text-green-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>

        <Button 
          onClick={validateAndNext}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
        >
          <span>Continue to Evidence</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CrimeDetailsStep;
