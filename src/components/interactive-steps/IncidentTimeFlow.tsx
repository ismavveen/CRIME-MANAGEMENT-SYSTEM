
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import { FormData } from "../InteractiveReportForm";

interface IncidentTimeFlowProps {
  onNext: () => void;
  onBack: () => void;
  onUpdate: (data: Partial<FormData>) => void;
  data: FormData;
}

const IncidentTimeFlow = ({ onNext, onBack, onUpdate, data }: IncidentTimeFlowProps) => {
  const [showSpecificTime, setShowSpecificTime] = useState(false);

  const timeOptions = [
    { id: "now", label: "Right now", description: "This is happening as I type" },
    { id: "today", label: "Earlier today", description: "Within the last 24 hours" },
    { id: "yesterday", label: "Yesterday", description: "1-2 days ago" },
    { id: "week", label: "This week", description: "Within the last 7 days" },
    { id: "month", label: "This month", description: "Within the last 30 days" },
    { id: "specific", label: "Specific date/time", description: "I know exactly when it happened" }
  ];

  const handleTimeSelection = (when: string) => {
    const newIncidentTime = { ...data.incidentTime, when };
    onUpdate({ incidentTime: newIncidentTime });

    if (when === "specific") {
      setShowSpecificTime(true);
    } else {
      setShowSpecificTime(false);
      // Auto-proceed for non-specific time selections
      setTimeout(() => {
        onNext();
      }, 500);
    }
  };

  const handleSpecificTimeUpdate = (field: string, value: string) => {
    const newIncidentTime = { ...data.incidentTime, [field]: value };
    onUpdate({ incidentTime: newIncidentTime });
  };

  const canContinue = () => {
    if (data.incidentTime.when === "specific") {
      return data.incidentTime.date !== "";
    }
    return data.incidentTime.when !== "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Clock className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-800">When did this incident occur?</h2>
        <p className="text-green-600">
          Even an approximate timeframe helps us understand the urgency and context.
        </p>
      </div>

      {!showSpecificTime ? (
        /* Time Selection */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {timeOptions.map((option) => {
              const isSelected = data.incidentTime.when === option.id;
              
              return (
                <Card 
                  key={option.id}
                  className={`cursor-pointer border-2 transition-all duration-200 hover:shadow-lg ${
                    isSelected 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  onClick={() => handleTimeSelection(option.id)}
                >
                  <CardContent className="p-4">
                    <h4 className={`font-semibold mb-1 ${isSelected ? 'text-green-800' : 'text-gray-800'}`}>
                      {option.label}
                    </h4>
                    <p className={`text-sm ${isSelected ? 'text-green-600' : 'text-gray-600'}`}>
                      {option.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        /* Specific Date/Time Input */
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Please provide the specific date and time
              </h3>
              <p className="text-green-600 text-sm">
                Provide as much detail as you can remember
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="incidentDate" className="text-green-800 font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date
                </Label>
                <Input
                  id="incidentDate"
                  type="date"
                  value={data.incidentTime.date}
                  onChange={(e) => handleSpecificTimeUpdate("date", e.target.value)}
                  className="border-green-300 mt-2"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <Label htmlFor="incidentTime" className="text-green-800 font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Time (if known)
                </Label>
                <Input
                  id="incidentTime"
                  type="time"
                  value={data.incidentTime.time}
                  onChange={(e) => handleSpecificTimeUpdate("time", e.target.value)}
                  className="border-green-300 mt-2"
                />
              </div>
            </div>

            <div className="text-center">
              <Button 
                onClick={onNext}
                disabled={!canContinue()}
                className="bg-green-700 hover:bg-green-800"
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="border-green-300 text-green-700">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        {showSpecificTime && (
          <Button 
            variant="outline" 
            onClick={() => setShowSpecificTime(false)}
            className="border-green-300 text-green-700"
          >
            Choose Different Timeframe
          </Button>
        )}
      </div>
    </div>
  );
};

export default IncidentTimeFlow;
