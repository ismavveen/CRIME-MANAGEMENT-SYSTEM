
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Upload, MapPin, AlertTriangle, ArrowRight, Calendar, Clock, CheckCircle } from "lucide-react";
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

  // Sample LGAs for major states - in a real app, this would be comprehensive
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
    ],
    "Rivers": [
      "Abua/Odual", "Ahoada East", "Ahoada West", "Akuku-Toru", "Andoni", "Asari-Toru", "Bonny", 
      "Degema", "Eleme", "Emuoha", "Etche", "Gokana", "Ikwerre", "Khana", "Obio/Akpor", "Ogba/Egbema/Ndoni", 
      "Ogu/Bolo", "Okrika", "Omuma", "Opobo/Nkoro", "Oyigbo", "Port Harcourt", "Tai"
    ],
    // Add more states and their LGAs as needed
  };

  const crimeCategories = [
    "Violent Crime", "Property Crime", "Drug-related", "Fraud/Scam", 
    "Cybercrime", "Suspicious Activity", "Terrorism/Security Threat", "Other"
  ];

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!data.location) {
      newErrors.location = "Please select your state";
    }
    
    if (!data.lga) {
      newErrors.lga = "Please select your local government area";
    }
    
    if (!data.crimeCategory) {
      newErrors.crimeCategory = "Please select a crime category";
    }
    
    if (!data.criminalAtScene) {
      newErrors.criminalAtScene = "Please indicate if the criminal is still at the scene";
    }

    if (!data.dateTime) {
      newErrors.dateTime = "Please specify when the incident occurred";
    }

    if (data.crimeCategory === "Other" && !data.otherCategory) {
      newErrors.otherCategory = "Please specify the type of crime";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      toast({
        title: "Basic information saved",
        description: "Proceeding to incident details..."
      });
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
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024); // 10MB limit
    
    if (validFiles.length !== files.length) {
      toast({
        title: "Some files were too large",
        description: "Files must be under 10MB. Large files were not uploaded.",
        variant: "destructive"
      });
    }
    
    onUpdate({ 
      mediaFiles: validFiles,
      hasMediaEvidence: validFiles.length > 0 
    });
    
    if (validFiles.length > 0) {
      toast({
        title: "Files uploaded successfully",
        description: `${validFiles.length} file(s) ready for submission.`
      });
    }
  };

  const handleStateChange = (value: string) => {
    onUpdate({ 
      location: value,
      lga: "", // Reset LGA when state changes
      specificArea: "" // Reset specific area when state changes
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Basic Incident Information</h3>
        <p className="text-green-600">Help us understand the nature and urgency of your report</p>
      </div>

      {/* Crime Category */}
      <div className="space-y-2">
        <Label htmlFor="crimeCategory" className="text-green-800 font-medium">
          Type of Crime/Incident <span className="text-red-500">*</span>
        </Label>
        <Select value={data.crimeCategory} onValueChange={(value) => onUpdate({ crimeCategory: value })}>
          <SelectTrigger className={`${errors.crimeCategory ? 'border-red-500' : 'border-green-300'}`}>
            <SelectValue placeholder="Select the type of crime or incident" />
          </SelectTrigger>
          <SelectContent>
            {crimeCategories.map((category) => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.crimeCategory && <p className="text-red-500 text-sm">{errors.crimeCategory}</p>}
        
        {/* Other category specification */}
        {data.crimeCategory === "Other" && (
          <div className="mt-3">
            <Label htmlFor="otherCategory" className="text-green-800 font-medium">
              Please specify <span className="text-red-500">*</span>
            </Label>
            <Input
              id="otherCategory"
              placeholder="Describe the type of crime or incident"
              value={data.otherCategory || ""}
              onChange={(e) => onUpdate({ otherCategory: e.target.value })}
              className={errors.otherCategory ? 'border-red-500' : 'border-green-300'}
            />
            {errors.otherCategory && <p className="text-red-500 text-sm">{errors.otherCategory}</p>}
          </div>
        )}
      </div>

      {/* Location Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-2">
          <MapPin className="h-5 w-5 text-green-600" />
          <Label className="text-green-800 font-medium text-base">Incident Location</Label>
        </div>
        
        {/* State Selection */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-green-800 font-medium">
            State <span className="text-red-500">*</span>
          </Label>
          <Select value={data.location} onValueChange={handleStateChange}>
            <SelectTrigger className={`${errors.location ? 'border-red-500' : 'border-green-300'}`}>
              <SelectValue placeholder="Select your state" />
            </SelectTrigger>
            <SelectContent>
              {nigerianStates.map((state) => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
        </div>

        {/* Local Government Area Selection */}
        {data.location && (
          <div className="space-y-2">
            <Label htmlFor="lga" className="text-green-800 font-medium">
              Local Government Area <span className="text-red-500">*</span>
            </Label>
            <Select value={data.lga} onValueChange={(value) => onUpdate({ lga: value })}>
              <SelectTrigger className={`${errors.lga ? 'border-red-500' : 'border-green-300'}`}>
                <SelectValue placeholder="Select your local government area" />
              </SelectTrigger>
              <SelectContent>
                {lgaByState[data.location] ? (
                  lgaByState[data.location].map((lga) => (
                    <SelectItem key={lga} value={lga}>{lga}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="other">Other (Please specify in area details below)</SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.lga && <p className="text-red-500 text-sm">{errors.lga}</p>}
          </div>
        )}

        {/* Specific Area/Address */}
        <div className="space-y-2">
          <Label htmlFor="specificArea" className="text-green-800 font-medium">
            Specific Area/Address
          </Label>
          <Textarea
            id="specificArea"
            placeholder="Provide specific location details (e.g., street name, landmark, neighborhood, etc.)"
            value={data.specificArea || ""}
            onChange={(e) => onUpdate({ specificArea: e.target.value })}
            className="border-green-300 min-h-[60px]"
            maxLength={200}
          />
          <p className="text-xs text-green-600">
            {(data.specificArea || "").length}/200 characters • This helps authorities locate the incident precisely
          </p>
        </div>
      </div>

      {/* Date and Time */}
      <div className="space-y-2">
        <Label htmlFor="dateTime" className="text-green-800 font-medium">
          When did this incident occur? <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="incidentDate" className="text-sm text-green-700">Date</Label>
            <Input
              id="incidentDate"
              type="date"
              value={data.incidentDate || ""}
              onChange={(e) => onUpdate({ incidentDate: e.target.value, dateTime: e.target.value })}
              className={errors.dateTime ? 'border-red-500' : 'border-green-300'}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <Label htmlFor="incidentTime" className="text-sm text-green-700">Time (if known)</Label>
            <Input
              id="incidentTime"
              type="time"
              value={data.incidentTime || ""}
              onChange={(e) => onUpdate({ incidentTime: e.target.value })}
              className="border-green-300"
            />
          </div>
        </div>
        {errors.dateTime && <p className="text-red-500 text-sm">{errors.dateTime}</p>}
      </div>

      {/* Criminal at Scene */}
      <div className="space-y-3">
        <Label className="text-green-800 font-medium">
          Is the criminal/suspect still at the scene? <span className="text-red-500">*</span>
        </Label>
        <RadioGroup 
          value={data.criminalAtScene} 
          onValueChange={(value) => onUpdate({ criminalAtScene: value })}
          className="flex flex-wrap gap-6"
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
                <Label htmlFor="safety-unsafe">No, I need immediate help</Label>
              </div>
            </RadioGroup>
            {data.safetyStatus === "unsafe" && (
              <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded">
                <p className="text-red-800 text-sm font-medium">
                  ⚠️ If you're in immediate danger, please call 199 immediately or visit the nearest police station. 
                  Do not rely solely on this form for emergency assistance.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Brief Description */}
      <div className="space-y-2">
        <Label htmlFor="briefDescription" className="text-green-800 font-medium">
          Brief Description of Incident
        </Label>
        <Textarea
          id="briefDescription"
          placeholder="Provide a brief summary of what happened (you can add more details in the next step)"
          value={data.briefDescription || ""}
          onChange={(e) => onUpdate({ briefDescription: e.target.value })}
          className="border-green-300 min-h-[80px]"
          maxLength={500}
        />
        <p className="text-xs text-green-600">
          {(data.briefDescription || "").length}/500 characters
        </p>
      </div>

      {/* Media Evidence Upload */}
      <div className="space-y-3">
        <Label className="text-green-800 font-medium">
          Evidence Files (Photos, Videos, Documents)
        </Label>
        <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
          <Upload className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-green-700 mb-2">Click to upload or drag and drop files here</p>
          <p className="text-sm text-green-600 mb-3">
            Supports: JPG, PNG, MP4, PDF, DOC, DOCX (Max 10MB per file)
          </p>
          <Input
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="cursor-pointer"
          />
        </div>
        {data.mediaFiles && data.mediaFiles.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <div className="flex items-center space-x-2 text-sm text-green-700">
              <CheckCircle className="h-4 w-4" />
              <span>{data.mediaFiles.length} file(s) uploaded successfully</span>
            </div>
            <ul className="mt-2 text-xs text-green-600">
              {data.mediaFiles.map((file: File, index: number) => (
                <li key={index} className="flex justify-between">
                  <span>{file.name}</span>
                  <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Auto-save notice */}
      <div className="bg-blue-50 border border-blue-200 rounded p-3">
        <div className="flex items-center space-x-2 text-sm text-blue-700">
          <CheckCircle className="h-4 w-4" />
          <span>Your progress is automatically saved as you type</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-6 border-t border-green-200">
        <Button onClick={handleNext} className="bg-green-700 hover:bg-green-800 px-6">
          Continue to Details <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default BasicIncidentInfo;
