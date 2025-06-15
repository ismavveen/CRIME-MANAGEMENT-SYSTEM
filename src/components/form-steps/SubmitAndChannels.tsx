import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Phone, Mail, MapPin, Smartphone, Globe, Shield, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SubmitAndChannelsProps {
  data: any;
  onUpdate: (data: any) => void;
  onBack: () => void;
}

const SubmitAndChannels = ({ data, onUpdate, onBack }: SubmitAndChannelsProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");

  const generateReferenceNumber = () => {
    const year = new Date().getFullYear();
    const randomNumber = Math.floor(Math.random() * 1000000);
    return `DHQ-${year}-${String(randomNumber).padStart(6, '0')}`;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const refNumber = generateReferenceNumber();
    setReferenceNumber(refNumber);
    setIsSubmitted(true);
    setIsSubmitting(false);

    toast({
      title: "Report submitted successfully",
      description: `Your reference number is ${refNumber}`,
    });
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-green-800 mb-2">Report Submitted Successfully</h3>
          <p className="text-green-600 mb-4">Thank you for reporting this incident. Your information helps keep our communities safe.</p>
          
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <p className="font-semibold text-green-800 mb-2">Your Reference Number:</p>
              <p className="text-xl font-mono bg-white px-4 py-2 rounded border border-green-300 text-green-800">
                {referenceNumber}
              </p>
              <p className="text-sm text-green-600 mt-2">
                Please save this number for future reference and follow-up.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-green-800">What happens next?</h4>
          <div className="text-sm text-green-700 space-y-2">
            <p>• Your report will be reviewed by our security team within 24 hours</p>
            <p>• If urgent, appropriate response units will be notified immediately</p>
            <p>• You may be contacted for additional information if needed</p>
            <p>• Follow-up can be done through any of our reporting channels</p>
          </div>
        </div>

        <Button onClick={() => window.location.href = "/"} className="bg-green-700 hover:bg-green-800">
          Submit Another Report
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Review and Submit Your Report</h3>
        <p className="text-green-600">Almost done! Choose your privacy preference and review submission options.</p>
      </div>

      {/* Security Assurance */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-800">Your Security is Our Priority</span>
          </div>
          <p className="text-sm text-green-700">
            All reports are encrypted and stored securely. Your identity is protected throughout the process.
          </p>
        </CardContent>
      </Card>

      {/* Anonymity Toggle */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            {data.isAnonymous ? <EyeOff className="h-5 w-5 text-green-600" /> : <Eye className="h-5 w-5 text-green-600" />}
            <div>
              <Label className="text-green-800 font-medium">
                {data.isAnonymous ? "Anonymous Report" : "Provide Contact Information"}
              </Label>
              <p className="text-sm text-green-600">
                {data.isAnonymous 
                  ? "Your identity will remain completely anonymous" 
                  : "Allow follow-up contact (optional)"}
              </p>
            </div>
          </div>
          <Switch
            checked={!data.isAnonymous}
            onCheckedChange={(checked) => onUpdate({ isAnonymous: !checked })}
          />
        </div>

        {/* Contact Information - Conditional */}
        {!data.isAnonymous && (
          <div className="space-y-2">
            <Label htmlFor="contactInfo" className="text-green-800 font-medium">
              Contact Information <span className="text-green-600">(Optional)</span>
            </Label>
            <Textarea
              id="contactInfo"
              value={data.contactInfo || ""}
              onChange={(e) => onUpdate({ contactInfo: e.target.value })}
              placeholder="Phone number, email, or preferred contact method for follow-up"
              rows={3}
              className="border-green-300"
            />
            <p className="text-sm text-green-600">
              This information will only be used for follow-up regarding your report.
            </p>
          </div>
        )}
      </div>

      {/* Reporting Channels */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Alternative Reporting Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-600 mb-4">You can also report crimes through these channels:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 border border-green-200 rounded-lg">
              <Phone className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">SMS</p>
                <p className="text-sm text-green-600">Text: 32123</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border border-green-200 rounded-lg">
              <Mail className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Email</p>
                <p className="text-sm text-green-600">reports@defencehq.gov.ng</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border border-green-200 rounded-lg">
              <Smartphone className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Mobile App</p>
                <p className="text-sm text-green-600">iOS & Android</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border border-green-200 rounded-lg">
              <MapPin className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Physical Office</p>
                <p className="text-sm text-green-600">Visit nearest location</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Notice */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <p className="text-orange-800 font-medium mb-2">Emergency Situations</p>
          <p className="text-sm text-orange-700">
            If this is an emergency requiring immediate response, please call 199 or visit the nearest police station.
          </p>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-green-200">
        <Button variant="outline" onClick={onBack} className="border-green-300 text-green-700">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="bg-green-700 hover:bg-green-800"
        >
          {isSubmitting ? "Submitting..." : "Submit Report"}
          {!isSubmitting && <CheckCircle className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default SubmitAndChannels;
