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
            To ensure your report is processed promptly and accurately, please review the following guidelines.
            Well-prepared and precise reports help security teams act swiftly and appropriately.
          </p>
          <p className="text-green-700 mb-6">
            Reporting is open to all Nigerians—anonymity is guaranteed if you want it. Attach evidence where possible, and give as much location detail as you can.
          </p>
        </div>
        {/* General Guidelines */}
        <div className="space-y-6 mb-8">
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                General Reporting Principles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-green-600">
                <li>Be as specific and detailed as possible when describing the incident.</li>
                <li>Provide accurate location information, including addresses or landmarks.</li>
                <li>Include dates and times of the event.</li>
                <li>Attach any supporting evidence, such as photos or videos, if available and safe to collect.</li>
                <li>If you choose to remain anonymous, ensure you do not include any personally identifiable information in the report details.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Anonymity */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Maintaining Anonymity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-green-600">
                <li>When submitting a report, select the anonymous option if you wish to remain unidentified.</li>
                <li>Do not include your name, contact information, or any other personal details in the report description.</li>
                <li>Be aware that providing too much detail may inadvertently reveal your identity.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Types of Incidents */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                What Types of Incidents to Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-green-600">
                <li>Crimes in progress or those that have already occurred.</li>
                <li>Suspicious activities that may indicate potential threats.</li>
                <li>Security breaches or vulnerabilities.</li>
                <li>Acts of violence or threats to public safety.</li>
                <li>Corruption or illegal activities within government or private sectors.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Evidence */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Submitting Evidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-green-600">
                <li>Photos and videos should be clear and directly relevant to the incident.</li>
                <li>Ensure that any audio recordings are audible and understandable.</li>
                <li>Documents should be scanned or photographed clearly.</li>
                <li>All evidence should be submitted through secure channels to protect its integrity and confidentiality.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Providing Location Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-green-600">
                <li>Include the full address, if known.</li>
                <li>Provide nearby landmarks or recognizable features.</li>
                <li>Use GPS coordinates if available for precise locations.</li>
                <li>Describe the environment (e.g., urban, rural, residential).</li>
              </ul>
            </CardContent>
          </Card>

          {/* Follow-Up */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                What to Expect After Submitting a Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-green-600">
                <li>After submission, your report will be reviewed by security personnel.</li>
                <li>If you provided contact information, you may be contacted for additional details.</li>
                <li>Due to the volume of reports, not all submissions may receive an individual response.</li>
                <li>All reports are taken seriously and contribute to overall security intelligence.</li>
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
