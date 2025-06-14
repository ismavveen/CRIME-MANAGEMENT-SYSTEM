
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowRight, Shield, User, Phone, Mail, AlertTriangle } from "lucide-react";

interface ReporterInfoStepProps {
  data: {
    isAnonymous: boolean;
    reporterName: string;
    reporterPhone: string;
    reporterEmail: string;
  };
  onDataChange: (field: string, value: any) => void;
  onNext: () => void;
  errors: Record<string, string>;
}

const ReporterInfoStep = ({ data, onDataChange, onNext, errors }: ReporterInfoStepProps) => {
  const [showDetails, setShowDetails] = useState(!data.isAnonymous);

  const handleAnonymousToggle = (checked: boolean) => {
    onDataChange('isAnonymous', checked);
    setShowDetails(!checked);
    if (checked) {
      onDataChange('reporterName', '');
      onDataChange('reporterPhone', '');
      onDataChange('reporterEmail', '');
    }
  };

  const validateAndNext = () => {
    if (!data.isAnonymous) {
      if (!data.reporterName.trim()) {
        return;
      }
      if (!data.reporterPhone.trim() && !data.reporterEmail.trim()) {
        return;
      }
    }
    onNext();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <User className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-800">Reporter Information</h2>
        <p className="text-green-600 max-w-2xl mx-auto">
          Your safety is our priority. You can choose to report anonymously or provide contact details 
          for potential follow-up. All information is encrypted and protected.
        </p>
      </div>

      <Card className="border-green-200 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <Shield className="h-5 w-5" />
            <span>Privacy Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <Label className="text-green-800 font-semibold">Anonymous Reporting</Label>
                <p className="text-sm text-green-700">Recommended for your safety and security</p>
              </div>
            </div>
            <Switch
              checked={data.isAnonymous}
              onCheckedChange={handleAnonymousToggle}
            />
          </div>

          {data.isAnonymous && (
            <div className="text-center p-6 bg-gray-50 rounded-lg animate-fade-in">
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Anonymous Reporting Enabled</h3>
              <p className="text-gray-600">
                Your identity will be completely protected. No personal information is required.
              </p>
            </div>
          )}

          {!data.isAnonymous && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Contact Information Guidelines</p>
                    <ul className="text-sm text-blue-700 mt-1 space-y-1">
                      <li>• Provide at least one contact method (phone or email)</li>
                      <li>• Your information will only be used for report follow-up</li>
                      <li>• All data is encrypted and stored securely</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="reporterName" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Full Name *</span>
                </Label>
                <Input
                  id="reporterName"
                  value={data.reporterName}
                  onChange={(e) => onDataChange('reporterName', e.target.value)}
                  placeholder="Enter your full name"
                  className={errors.reporterName ? 'border-red-500' : 'border-green-300 focus:border-green-500'}
                />
                {errors.reporterName && (
                  <p className="text-sm text-red-600 mt-1">{errors.reporterName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="reporterPhone" className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Phone Number</span>
                </Label>
                <Input
                  id="reporterPhone"
                  value={data.reporterPhone}
                  onChange={(e) => onDataChange('reporterPhone', e.target.value)}
                  placeholder="e.g., +234 803 123 4567"
                  className="border-green-300 focus:border-green-500"
                />
              </div>

              <div>
                <Label htmlFor="reporterEmail" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email Address</span>
                </Label>
                <Input
                  id="reporterEmail"
                  type="email"
                  value={data.reporterEmail}
                  onChange={(e) => onDataChange('reporterEmail', e.target.value)}
                  placeholder="your.email@example.com"
                  className="border-green-300 focus:border-green-500"
                />
              </div>

              {errors.contact && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{errors.contact}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button 
          onClick={validateAndNext}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
        >
          Continue to Crime Details
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ReporterInfoStep;
