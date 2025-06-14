
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Clock, Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import { FormData } from "../../types/FormData";

interface IncidentTimeFlowProps {
  onNext: () => void;
  onBack: () => void;
  onUpdate: (data: Partial<FormData>) => void;
  data: FormData;
}

const IncidentTimeFlow = ({ onNext, onBack, onUpdate, data }: IncidentTimeFlowProps) => {
  const [specificDate, setSpecificDate] = useState(data.incidentTime.date || "");
  const [specificTime, setSpecificTime] = useState(data.incidentTime.time || "");

  const handleTimeUpdate = (field: string, value: string) => {
    onUpdate({
      incidentTime: {
        ...data.incidentTime,
        [field]: value,
      },
    });
  };

  const handleWhenChange = (value: string) => {
    onUpdate({
      incidentTime: {
        ...data.incidentTime,
        when: value as "specific" | "today" | "yesterday" | "lastWeek" | "lastMonth" | "notSure",
        date: undefined,
        time: undefined,
      },
    });
  };

  const handleSpecificDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setSpecificDate(dateValue);
    handleTimeUpdate("date", dateValue);
  };

  const handleSpecificTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    setSpecificTime(timeValue);
    handleTimeUpdate("time", timeValue);
  };

  const canProceed = () => {
    if (data.incidentTime.when === "specific") {
      return specificDate !== "" && specificTime !== "";
    }
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Clock className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-800">When did this happen?</h2>
        <p className="text-green-600">
          Please provide the approximate date and time of the incident.
        </p>
      </div>

      {/* Time Selection */}
      <div className="space-y-4">
        <RadioGroup onValueChange={handleWhenChange} defaultValue={data.incidentTime.when}>
          <Card className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="today" id="time-today" />
              <Label htmlFor="time-today" className="flex-1 cursor-pointer">
                <div className="font-medium text-green-700">Today</div>
                <div className="text-sm text-green-600">Sometime today</div>
              </Label>
            </div>
          </Card>

          <Card className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="yesterday" id="time-yesterday" />
              <Label htmlFor="time-yesterday" className="flex-1 cursor-pointer">
                <div className="font-medium text-green-700">Yesterday</div>
                <div className="text-sm text-green-600">Sometime yesterday</div>
              </Label>
            </div>
          </Card>

          <Card className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="lastWeek" id="time-last-week" />
              <Label htmlFor="time-last-week" className="flex-1 cursor-pointer">
                <div className="font-medium text-green-700">Last Week</div>
                <div className="text-sm text-green-600">Sometime in the last week</div>
              </Label>
            </div>
          </Card>

          <Card className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="lastMonth" id="time-last-month" />
              <Label htmlFor="time-last-month" className="flex-1 cursor-pointer">
                <div className="font-medium text-green-700">Last Month</div>
                <div className="text-sm text-green-600">Sometime in the last month</div>
              </Label>
            </div>
          </Card>

          <Card className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="specific" id="time-specific" />
              <Label htmlFor="time-specific" className="flex-1 cursor-pointer">
                <div className="font-medium text-green-700">Specific Date & Time</div>
                <div className="text-sm text-green-600">I know the exact date and time</div>
              </Label>
            </div>
          </Card>

          <Card className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="notSure" id="time-not-sure" />
              <Label htmlFor="time-not-sure" className="flex-1 cursor-pointer">
                <div className="font-medium text-gray-700">Not Sure</div>
                <div className="text-sm text-gray-600">I'm not sure when it happened</div>
              </Label>
            </div>
          </Card>
        </RadioGroup>
      </div>

      {/* Specific Date and Time Inputs */}
      {data.incidentTime.when === "specific" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="specificDate" className="text-green-800 font-medium">
              Date
            </Label>
            <Input
              type="date"
              id="specificDate"
              value={specificDate}
              onChange={handleSpecificDateChange}
              className="border-green-300 mt-2"
            />
          </div>
          <div>
            <Label htmlFor="specificTime" className="text-green-800 font-medium">
              Time
            </Label>
            <Input
              type="time"
              id="specificTime"
              value={specificTime}
              onChange={handleSpecificTimeChange}
              className="border-green-300 mt-2"
            />
          </div>
        </div>
      )}

      {/* Helpful Tips */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-800 mb-2 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Tips for Estimating Time:
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Think about your last known location or activity</li>
            <li>• Consider any events that might help you remember</li>
            <li>• If unsure, provide your best guess</li>
            <li>• An approximate time is better than no time</li>
          </ul>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack} className="border-green-300 text-green-700">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={onNext} disabled={!canProceed()} className="bg-green-700 hover:bg-green-800">
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default IncidentTimeFlow;
