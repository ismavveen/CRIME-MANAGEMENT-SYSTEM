import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff, Shield, Phone, Mail, ArrowLeft, ArrowRight } from "lucide-react";
import { FormData } from "../../types/FormData";

interface ContactPreferencesProps {
  onNext: () => void;
  onBack: () => void;
  onUpdate: (data: Partial<FormData>) => void;
  data: FormData;
}

const ContactPreferences = ({ onNext, onBack, onUpdate, data }: ContactPreferencesProps) => {
  const handleContactUpdate = (field: string, value: string | boolean) => {
    const newContact = { ...data.contact, [field]: value };
    onUpdate({ contact: newContact });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
          <Shield className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-800">How would you like us to handle your identity?</h2>
        <p className="text-green-600">
          You can choose to remain completely anonymous or provide contact information for follow-up.
        </p>
      </div>

      {/* Anonymity Toggle */}
      <Card className="border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {data.contact.isAnonymous ? (
                <EyeOff className="h-8 w-8 text-green-600" />
              ) : (
                <Eye className="h-8 w-8 text-green-600" />
              )}
              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  {data.contact.isAnonymous ? "Anonymous Report" : "Identifiable Report"}
                </h3>
                <p className="text-green-600">
                  {data.contact.isAnonymous 
                    ? "Your identity will remain completely protected" 
                    : "Allow follow-up contact from authorities"}
                </p>
              </div>
            </div>
            <Switch
              checked={!data.contact.isAnonymous}
              onCheckedChange={(checked) => handleContactUpdate("isAnonymous", !checked)}
              className="data-[state=checked]:bg-green-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* Anonymous Report Benefits */}
      {data.contact.isAnonymous && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Anonymous Report Benefits:
            </h4>
            <ul className="text-sm text-green-700 space-y-2">
              <li>• Complete privacy protection - no personal information stored</li>
              <li>• No risk of retaliation or unwanted contact</li>
              <li>• Still provides valuable intelligence to authorities</li>
              <li>• Helps prevent future crimes in your community</li>
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Contact Information - If not anonymous */}
      {!data.contact.isAnonymous && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6 space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Provide your contact information
              </h3>
              <p className="text-green-600 text-sm">
                This allows authorities to follow up with questions or updates about your report.
              </p>
            </div>

            <div>
              <Label htmlFor="contactInfo" className="text-green-800 font-medium">
                Contact Information
              </Label>
              <Textarea
                id="contactInfo"
                value={data.contact.contactInfo}
                onChange={(e) => handleContactUpdate("contactInfo", e.target.value)}
                placeholder="Phone number, email address, or preferred contact method..."
                rows={3}
                className="border-green-300 mt-2"
              />
              <p className="text-sm text-green-600 mt-2">
                Provide any contact method you're comfortable with. This information is secure and confidential.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center space-x-2 text-sm text-green-700">
                <Phone className="h-4 w-4" />
                <span>Phone number for quick contact</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-green-700">
                <Mail className="h-4 w-4" />
                <span>Email for detailed updates</span>
              </div>
            </div>

            {/* Contact Benefits */}
            <Card className="border-blue-200 bg-white">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-800 mb-2">Benefits of providing contact info:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Receive updates on the investigation progress</li>
                  <li>• Clarify details if needed for the case</li>
                  <li>• Get notified when the case is resolved</li>
                  <li>• Help with prosecution if applicable</li>
                </ul>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}

      {/* Alternative Reporting Channels */}
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <h4 className="font-semibold text-green-800 mb-4">Other Ways to Report Crimes:</h4>
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
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack} className="border-green-300 text-green-700">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <Button onClick={onNext} className="bg-green-700 hover:bg-green-800">
          Continue to Review <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ContactPreferences;
