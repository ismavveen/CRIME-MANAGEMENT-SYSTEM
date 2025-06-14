import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, ArrowRight, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface IncidentDetailsProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const IncidentDetails = ({ data, onUpdate, onNext, onBack }: IncidentDetailsProps) => {
  const [errors, setErrors] = useState<any>({});

  const crimeCategories = [
    "Theft/Robbery",
    "Assault/Violence",
    "Fraud/Scam",
    "Drug-related",
    "Vandalism",
    "Cybercrime",
    "Kidnapping",
    "Terrorism/Security Threat",
    "Corruption",
    "Human Trafficking",
    "Other"
  ];

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!data.dateTime) {
      newErrors.dateTime = "Please select when the incident occurred";
    }
    
    if (!data.crimeCategory) {
      newErrors.crimeCategory = "Please select a crime category";
    }

    if (data.crimeCategory === "Other" && !data.otherCategory) {
      newErrors.otherCategory = "Please specify the crime type";
    }

    if (!data.description || data.description.trim().length < 10) {
      newErrors.description = "Please provide a description (at least 10 characters)";
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Tell us more about the incident</h3>
        <p className="text-green-600">Detailed information helps us respond more effectively.</p>
      </div>

      {/* Date and Time */}
      <div className="space-y-2">
        <Label className="text-green-800 font-medium">
          When did this incident occur? <span className="text-red-500">*</span>
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !data.dateTime && "text-muted-foreground",
                errors.dateTime && "border-red-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {data.dateTime ? format(data.dateTime, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={data.dateTime}
              onSelect={(date) => onUpdate({ dateTime: date })}
              disabled={(date) => date > new Date()}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        {errors.dateTime && <p className="text-red-500 text-sm">{errors.dateTime}</p>}
        
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <Label htmlFor="time" className="text-green-800">Approximate Time</Label>
            <Input
              id="time"
              type="time"
              value={data.incidentTime || ""}
              onChange={(e) => onUpdate({ incidentTime: e.target.value })}
              className="border-green-300"
            />
          </div>
        </div>
      </div>

      {/* Crime Category */}
      <div className="space-y-2">
        <Label className="text-green-800 font-medium">
          Crime Category <span className="text-red-500">*</span>
        </Label>
        <Select value={data.crimeCategory} onValueChange={(value) => onUpdate({ crimeCategory: value })}>
          <SelectTrigger className={`${errors.crimeCategory ? 'border-red-500' : 'border-green-300'}`}>
            <SelectValue placeholder="Select the type of crime" />
          </SelectTrigger>
          <SelectContent>
            {crimeCategories.map((category) => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.crimeCategory && <p className="text-red-500 text-sm">{errors.crimeCategory}</p>}
      </div>

      {/* Other Category - Conditional */}
      {data.crimeCategory === "Other" && (
        <div className="space-y-2">
          <Label htmlFor="otherCategory" className="text-green-800 font-medium">
            Please specify <span className="text-red-500">*</span>
          </Label>
          <Input
            id="otherCategory"
            value={data.otherCategory || ""}
            onChange={(e) => onUpdate({ otherCategory: e.target.value })}
            placeholder="Describe the type of crime"
            className={`${errors.otherCategory ? 'border-red-500' : 'border-green-300'}`}
          />
          {errors.otherCategory && <p className="text-red-500 text-sm">{errors.otherCategory}</p>}
        </div>
      )}

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-green-800 font-medium">
          Incident Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          value={data.description || ""}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Please provide a detailed description of what happened. Include who, what, when, where, and how if possible."
          rows={6}
          className={`${errors.description ? 'border-red-500' : 'border-green-300'}`}
        />
        <div className="flex justify-between items-center">
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          <p className="text-sm text-green-600">
            {data.description ? data.description.length : 0} characters
          </p>
        </div>
      </div>

      {/* Witness Information */}
      <div className="space-y-2">
        <Label htmlFor="witnessInfo" className="text-green-800 font-medium">
          Witness Information <span className="text-green-600">(Optional)</span>
        </Label>
        <Textarea
          id="witnessInfo"
          value={data.witnessInfo || ""}
          onChange={(e) => onUpdate({ witnessInfo: e.target.value })}
          placeholder="If there were witnesses, please provide their details (names, contact information) if available and if they consent to being contacted."
          rows={3}
          className="border-green-300"
        />
        <p className="text-sm text-green-600">
          Only include witness information if you have their permission.
        </p>
      </div>

      {/* Additional Location Details */}
      <div className="space-y-2">
        <Label htmlFor="locationDetails" className="text-green-800 font-medium">
          Specific Location Details <span className="text-green-600">(Optional)</span>
        </Label>
        <Input
          id="locationDetails"
          value={data.locationDetails || ""}
          onChange={(e) => onUpdate({ locationDetails: e.target.value })}
          placeholder="Street address, landmark, or specific location details"
          className="border-green-300"
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-green-200">
        <Button variant="outline" onClick={onBack} className="border-green-300 text-green-700">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={handleNext} className="bg-green-700 hover:bg-green-800">
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default IncidentDetails;
