
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Phone, Shield, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";

const HowToReport = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-800 mb-4">How to Report a Crime</h1>
            <p className="text-green-600">
              Step-by-step guide to submitting effective crime reports
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-6 mb-8">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center">
                  <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">1</span>
                  Ensure Your Safety First
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-green-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" />Move to a safe location if you're in immediate danger</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" />Call 199 for emergency assistance if needed</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" />Don't confront criminals or interfere with crime scenes</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center">
                  <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">2</span>
                  Gather Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-green-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" />Note the exact location and time of the incident</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" />Observe and remember details about suspects</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" />Take photos or videos if safe to do so</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" />Identify potential witnesses</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center">
                  <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">3</span>
                  Choose Your Reporting Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Online Portal</h4>
                    <p className="text-sm text-green-600">Secure web form with file upload capability</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Phone Call</h4>
                    <p className="text-sm text-green-600">Emergency: 199 | Non-emergency: +234-9-670-1000</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">SMS</h4>
                    <p className="text-sm text-green-600">Text your report to 32123</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Email</h4>
                    <p className="text-sm text-green-600">reports@defencehq.gov.ng</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center">
                  <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">4</span>
                  Submit Your Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-green-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" />Provide clear, factual information</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" />Include all relevant details and evidence</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" />Choose anonymous reporting if desired</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" />Keep any reference number provided</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link to="/report">
              <Button className="bg-green-700 hover:bg-green-800 mr-4">
                <FileText className="mr-2 h-4 w-4" />
                Start Reporting Now
              </Button>
            </Link>
            <Link to="/emergency-contacts">
              <Button variant="outline" className="border-green-600 text-green-600">
                <Phone className="mr-2 h-4 w-4" />
                Emergency Contacts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToReport;
