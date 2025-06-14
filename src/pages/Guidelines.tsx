
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Phone, Shield, AlertTriangle, MapPin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";

const Guidelines = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">Crime Reporting Guidelines</h1>
          <p className="text-green-700 text-lg mb-4">
            Before you start: careful, accurate reporting makes a real difference. Provide as much detail as you can. Attach evidence. If your life may be at risk, always stay anonymous. Security teams process reports daily and prioritize credible tips for action.
          </p>
          <p className="text-green-700 mb-6">
            Every Nigerian has a role in building a safer community. Your report, no matter how small, could prevent a crime or help protect your neighbors and loved ones.
          </p>
        </div>
        {/* General Guidelines */}
        <div className="space-y-6 mb-8">
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                General Reporting Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-green-600">
                <li>Describe what happened, when, and where. Details help.</li>
                <li>Include addresses, landmarks, GPS—anything to locate the incident.</li>
                <li>Provide dates, times, and who/what was involved if known.</li>
                <li>Photos, videos, and documents are very helpful but never risk your safety to collect evidence.</li>
                <li>To stay anonymous, do not include your name or anything that shows your identity.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Anonymity & Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-green-600">
                <li>If you want to report anonymously, select the anonymous option on the report form.</li>
                <li>Leave out any personal or identifying information if you want full confidentiality.</li>
                <li>Never risk your safety or that of your loved ones—your security comes first.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Types of Incidents to Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-green-600">
                <li>Ongoing crimes and threats</li>
                <li>Suspicious people, items, or activities</li>
                <li>Corruption, violence, or arms/drug trafficking</li>
                <li>Any issues putting community safety at risk—including government or private sector wrongdoing</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Sending Evidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-green-600">
                <li>Attach only relevant, clear images or videos.</li>
                <li>Voice or document evidence is welcome if safe and available.</li>
                <li>All uploads go directly to secure Defence HQ servers—your data is protected.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Describe the Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-green-600">
                <li>State, local government, and specific address or area help us a lot.</li>
                <li>Add extra context: urban, rural, residential, school, market, etc.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                What Happens After Submission?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-green-600">
                <li>Your report is encrypted, stored securely, and reviewed by Defence HQ teams.</li>
                <li>If you give contact info, a team member may ask for more detail. Anonymous reporters are never contacted but your tip is always reviewed.</li>
                <li>Every submission contributes to national intelligence—even if you don’t receive an individual reply.</li>
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
          <Link to="/contact">
            <Button variant="outline" className="border-green-600 text-green-600">
              <Phone className="mr-2 h-4 w-4" />
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Guidelines;
