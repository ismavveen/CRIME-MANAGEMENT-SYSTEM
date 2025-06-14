
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, FileText, MapPin, Clock, Camera, Shield, Phone } from "lucide-react";
import { FormData } from "../../types/FormData";
import { toast } from "@/hooks/use-toast";

interface FinalReviewProps {
  onBack: () => void;
  data: FormData;
}

const FinalReview = ({ onBack, data }: FinalReviewProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");

  const generateReferenceNumber = () => {
    const prefix = "DHQ";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const handleSubmit = async () => {
    console.log("Submitting report with data:", data);
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
      <div className="text-center space-y-6 animate-fade-in">
        <div className="flex justify-center">
          <CheckCircle className="h-20 w-20 text-green-600 animate-scale-in" />
        </div>
        
        <div>
          <h3 className="text-3xl font-bold text-green-800 mb-4">Report Submitted Successfully!</h3>
          <p className="text-green-600 text-lg mb-6">
            Thank you for taking the time to report this incident. Your information helps keep our communities safe.
          </p>
          
          <Card className="border-green-200 bg-green-50 max-w-md mx-auto">
            <CardContent className="p-6">
              <p className="font-semibold text-green-800 mb-3">Your Reference Number:</p>
              <p className="text-2xl font-mono bg-white px-4 py-3 rounded border border-green-300 text-green-800">
                {referenceNumber}
              </p>
              <p className="text-sm text-green-600 mt-3">
                Please save this number for future reference and follow-up.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 text-left max-w-lg mx-auto">
          <h4 className="font-semibold text-green-800 text-center">What happens next?</h4>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <p className="text-green-700">Your report will be reviewed by our security team within 24 hours</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <p className="text-green-700">If urgent, appropriate response units will be notified immediately</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <p className="text-green-700">Investigation will proceed according to standard protocols</p>
            </div>
            {!data.contact.isAnonymous && (
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <p className="text-green-700">You may be contacted for additional information if needed</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => window.location.href = "/"} className="bg-green-700 hover:bg-green-800 hover:scale-105 transition-all duration-200">
            Submit Another Report
          </Button>
          <Button variant="outline" onClick={() => window.location.href = "/"} className="border-green-300 text-green-700 hover:bg-green-50 transition-all duration-200">
            Return to Homepage
          </Button>
        </div>
      </div>
    );
  }

  const formatTimeDisplay = () => {
    if (data.incidentTime.when === "specific") {
      const parts = [];
      if (data.incidentTime.date) parts.push(new Date(data.incidentTime.date).toLocaleDateString());
      if (data.incidentTime.time) parts.push(data.incidentTime.time);
      return parts.join(' at ') || "Specific date/time provided";
    }
    return data.incidentTime.when.replace(/([A-Z])/g, ' $1').toLowerCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <FileText className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-800">Review Your Report</h2>
        <p className="text-green-600">
          Please review the information below before submitting your report.
        </p>
      </div>

      {/* Report Summary */}
      <div className="space-y-4">
        {/* Crime Type */}
        <Card className="border-green-200 hover:shadow-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold text-green-800">Incident Type</h4>
                <p className="text-green-700">{data.crimeType}</p>
                {data.crimeDetails && (
                  <p className="text-sm text-green-600 mt-1">{data.crimeDetails}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="border-green-200 hover:shadow-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <MapPin className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold text-green-800">Location</h4>
                <p className="text-green-700">
                  {data.location.state}
                  {data.location.lga && `, ${data.location.lga}`}
                </p>
                {data.location.specificArea && (
                  <p className="text-sm text-green-600 mt-1">{data.location.specificArea}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time */}
        <Card className="border-green-200 hover:shadow-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Clock className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold text-green-800">When it happened</h4>
                <p className="text-green-700 capitalize">{formatTimeDisplay()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="border-green-200 hover:shadow-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <FileText className="h-6 w-6 text-green-600 mt-1" />
              <div className="w-full">
                <h4 className="font-semibold text-green-800">Description</h4>
                <p className="text-green-700 whitespace-pre-wrap">{data.description}</p>
                {data.witnessInfo && (
                  <div className="mt-3">
                    <p className="font-medium text-green-800">Witness Information:</p>
                    <p className="text-green-700 text-sm">{data.witnessInfo}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evidence */}
        {data.evidence.files.length > 0 && (
          <Card className="border-green-200 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Camera className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-800">Evidence Files</h4>
                  <p className="text-green-700">{data.evidence.files.length} file(s) attached</p>
                  <div className="mt-2 text-sm text-green-600">
                    {data.evidence.files.map((file, index) => (
                      <div key={index}>• {file.name}</div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Preference */}
        <Card className="border-green-200 hover:shadow-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              {data.contact.isAnonymous ? (
                <Shield className="h-6 w-6 text-green-600 mt-1" />
              ) : (
                <Phone className="h-6 w-6 text-green-600 mt-1" />
              )}
              <div>
                <h4 className="font-semibold text-green-800">Contact Preference</h4>
                <p className="text-green-700">
                  {data.contact.isAnonymous ? "Anonymous report" : "Open to follow-up contact"}
                </p>
                {!data.contact.isAnonymous && data.contact.contactInfo && (
                  <p className="text-sm text-green-600 mt-1">Contact info provided</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Assurance */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-800">Final Security Reminder</span>
          </div>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Your report is encrypted and secure</li>
            <li>• Only authorized personnel will have access</li>
            <li>• Your privacy choices will be respected</li>
            <li>• You can reference this report using your confirmation number</li>
          </ul>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button 
          variant="outline" 
          onClick={onBack} 
          className="border-green-300 text-green-700 hover:bg-green-50 transition-all duration-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Edit
        </Button>
        
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="bg-green-700 hover:bg-green-800 px-8 hover:scale-105 transition-all duration-200"
        >
          {isSubmitting ? "Submitting Report..." : "Submit Report"}
          {!isSubmitting && <CheckCircle className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default FinalReview;
