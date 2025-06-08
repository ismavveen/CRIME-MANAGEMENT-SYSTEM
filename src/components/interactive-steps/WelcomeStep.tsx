
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, FileText, Phone, ArrowRight } from "lucide-react";
import { FormData } from "../InteractiveReportForm";

interface WelcomeStepProps {
  onNext: () => void;
  onUpdate: (data: Partial<FormData>) => void;
  data: FormData;
}

const WelcomeStep = ({ onNext, onUpdate }: WelcomeStepProps) => {
  const handleReportChoice = (wantsToReport: boolean) => {
    onUpdate({ wantsToReport });
    if (wantsToReport) {
      onNext();
    }
  };

  return (
    <div className="text-center space-y-6">
      {/* Welcome Header */}
      <div className="space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Shield className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-800">Welcome to the Crime Reporting Portal</h2>
        <p className="text-green-600 text-lg">
          Your safety and security matter to us. We're here to help you report incidents safely and confidentially.
        </p>
      </div>

      {/* Main Question */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-green-800">
          Would you like to report a crime or suspicious activity?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Yes - Report a Crime */}
          <Card 
            className="cursor-pointer border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all duration-200 group"
            onClick={() => handleReportChoice(true)}
          >
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 text-green-600 mx-auto mb-4 group-hover:text-green-700 transition-colors" />
              <h4 className="font-semibold text-green-800 mb-2">Yes, I want to report something</h4>
              <p className="text-sm text-green-600">
                Start a secure and confidential report about a crime or suspicious activity
              </p>
              <Button className="mt-4 bg-green-700 hover:bg-green-800 w-full group-hover:shadow-md transition-all">
                Start Report <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* No - Just Looking for Information */}
          <Card 
            className="cursor-pointer border-2 border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all duration-200 group"
            onClick={() => handleReportChoice(false)}
          >
            <CardContent className="p-6 text-center">
              <Phone className="h-12 w-12 text-gray-600 mx-auto mb-4 group-hover:text-gray-700 transition-colors" />
              <h4 className="font-semibold text-gray-800 mb-2">No, I need information</h4>
              <p className="text-sm text-gray-600">
                Looking for contact information, reporting options, or general guidance
              </p>
              <Button variant="outline" className="mt-4 w-full group-hover:shadow-md transition-all">
                View Information <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Security Assurances */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
        <h4 className="font-semibold text-green-800 mb-3">Your Security & Privacy</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-700">
          <div className="text-center">
            <Shield className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <span className="font-medium">End-to-End Encryption</span>
            <p className="text-xs text-green-600 mt-1">All data is securely encrypted</p>
          </div>
          <div className="text-center">
            <FileText className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <span className="font-medium">Anonymous Options</span>
            <p className="text-xs text-green-600 mt-1">Report without revealing identity</p>
          </div>
          <div className="text-center">
            <Phone className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <span className="font-medium">Professional Response</span>
            <p className="text-xs text-green-600 mt-1">Trained security personnel</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeStep;
