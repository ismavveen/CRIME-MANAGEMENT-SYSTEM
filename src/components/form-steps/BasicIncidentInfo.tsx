
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, MapPin, AlertTriangle, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BasicIncidentInfoProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const BasicIncidentInfo = ({ data, onUpdate, onNext }: BasicIncidentInfoProps) => {
  const [errors, setErrors] = useState<any>({});

  const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
    "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano",
    "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
    "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
  ];

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!data.location) {
      newErrors.location = "Please select your location";
    }
    
    if (!data.criminalAtScene) {
      newErrors.criminalAtScene = "Please indicate if the criminal is still at the scene";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    } else {
      toast({
        title: "Please complete required fields",
        description: "Some required information is missing.",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onUpdate({ 
      mediaFiles: files,
      hasMediaEvidence: files.length > 0 
    });
    
    if (files.length > 0) {
      toast({
        title: "Files uploaded successfully",
        description: `${files.length} file(s) ready for submission.`
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Let's start with the basics</h3>
        <p className="text-green-600">This information helps us respond appropriately to your report.</p>
      </div>

      {/* Location Selection */}
      <div className="space-y-2">
        <Label htmlFor="location" className="text-green-800 font-medium">
          Where are you reporting from? <span className="text-red-500">*</span>
        </Label>
        <Select value={data.location} onValueChange={(value) => onUpdate({ location: value })}>
          <SelectTrigger className={`${errors.location ? 'border-red-500' : 'border-green-300'}`}>
            <SelectValue placeholder="Select your state/location" />
          </SelectTrigger>
          <SelectContent>
            {nigerianStates.map((state) => (
              <SelectItem key={state} value={state}>{state}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
        
        <div className="flex items-center space-x-2 text-sm text-green-600 mt-2">
          <MapPin className="h-4 w-4" />
          <span>Optional: More specific location can be provided in the next step</span>
        </div>
      </div>

      {/* Criminal at Scene */}
      <div className="space-y-3">
        <Label className="text-green-800 font-medium">
          Is the criminal still at the scene? <span className="text-red-500">*</span>
        </Label>
        <RadioGroup 
          value={data.criminalAtScene} 
          onValueChange={(value) => onUpdate({ criminalAtScene: value })}
          className="flex space-x-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="criminal-yes" />
            <Label htmlFor="criminal-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="criminal-no" />
            <Label htmlFor="criminal-no">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unknown" id="criminal-unknown" />
            <Label htmlFor="criminal-unknown">Unknown</Label>
          </div>
        </RadioGroup>
        {errors.criminalAtScene && <p className="text-red-500 text-sm">{errors.criminalAtScene}</p>}
      </div>

      {/* Safety Check - Conditional */}
      {data.criminalAtScene === "yes" && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <Label className="text-orange-800 font-medium">Are you currently safe?</Label>
            </div>
            <RadioGroup 
              value={data.safetyStatus} 
              onValueChange={(value) => onUpdate({ safetyStatus: value })}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="safe" id="safety-safe" />
                <Label htmlFor="safety-safe">Yes, I'm safe</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unsafe" id="safety-unsafe" />
                <Label htmlFor="safety-unsafe">No, I need help</Label>
              </div>
            </RadioGroup>
            {data.safetyStatus === "unsafe" && (
              <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded">
                <p className="text-red-800 text-sm font-medium">
                  If you're in immediate danger, please call 199 or visit the nearest police station.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Media Evidence Upload */}
      <div className="space-y-3">
        <Label className="text-green-800 font-medium">
          Do you have media evidence? (Photos, Videos, Documents)
        </Label>
        <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
          <Upload className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-green-700 mb-2">Click to upload or drag and drop files here</p>
          <p className="text-sm text-green-600">Supports: JPG, PNG, MP4, PDF (Max 10MB per file)</p>
          <Input
            type="file"
            multiple
            accept="image/*,video/*,.pdf"
            onChange={handleFileUpload}
            className="mt-3"
          />
        </div>
        {data.mediaFiles && data.mediaFiles.length > 0 && (
          <div className="text-sm text-green-600">
            ✓ {data.mediaFiles.length} file(s) selected
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-6 border-t border-green-200">
        <Button onClick={handleNext} className="bg-green-700 hover:bg-green-800">
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default BasicIncidentInfo;
