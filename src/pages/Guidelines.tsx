
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, FileText, AlertTriangle, Camera, Phone, CheckCircle, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";

const Guidelines = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-800 mb-4">Crime Reporting Guidelines</h1>
            <p className="text-green-600 text-lg">
              Your safety is our priority. Follow these guidelines to report crimes effectively and securely.
            </p>
          </div>

          {/* How to Report */}
          <Card className="mb-8 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center text-2xl">
                <FileText className="h-6 w-6 mr-3" />
                How to Report a Crime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-green-600">1</span>
                  </div>
                  <h3 className="font-semibold text-green-800 mb-2">Choose Your Method</h3>
                  <p className="text-gray-600 text-sm">Online form, SMS, phone call, or in-person reporting</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-green-600">2</span>
                  </div>
                  <h3 className="font-semibold text-green-800 mb-2">Provide Details</h3>
                  <p className="text-gray-600 text-sm">Accurate information about the incident and location</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-green-600">3</span>
                  </div>
                  <h3 className="font-semibold text-green-800 mb-2">Submit Evidence</h3>
                  <p className="text-gray-600 text-sm">Photos, videos, or audio recordings if available</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-green-600">4</span>
                  </div>
                  <h3 className="font-semibold text-green-800 mb-2">Track Progress</h3>
                  <p className="text-gray-600 text-sm">Use your reference number to monitor the report</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What to Report */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  What to Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">High Priority Crimes</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Terrorism and insurgency activities</li>
                      <li>• Kidnapping and hostage situations</li>
                      <li>• Armed robbery and banditry</li>
                      <li>• Cyber crimes and fraud</li>
                      <li>• Drug trafficking</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">Infrastructure Threats</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Oil pipeline vandalism</li>
                      <li>• Attacks on government facilities</li>
                      <li>• Threats to military installations</li>
                      <li>• Critical infrastructure damage</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">Community Security</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Ethnic or religious conflicts</li>
                      <li>• Illegal arms possession</li>
                      <li>• Suspicious activities</li>
                      <li>• Border security issues</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Safety Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-orange-700 mb-2">Personal Safety</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Do not confront criminals directly</li>
                      <li>• Report from a safe location</li>
                      <li>• Use anonymous reporting when necessary</li>
                      <li>• Do not share sensitive information publicly</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-700 mb-2">Evidence Collection</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Only collect evidence if safe to do so</li>
                      <li>• Do not tamper with crime scenes</li>
                      <li>• Take photos/videos from a safe distance</li>
                      <li>• Note important details immediately</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-700 mb-2">Information Accuracy</h4>
                    <ul className="space-y-1 text-gray-700 text-sm">
                      <li>• Provide accurate time and location</li>
                      <li>• Describe what you actually witnessed</li>
                      <li>• Avoid speculation or assumptions</li>
                      <li>• Include all relevant details</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reporting Channels */}
          <Card className="mb-8 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800 flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Available Reporting Channels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-purple-800 mb-1">Online Form</h4>
                  <p className="text-gray-600 text-sm">Secure web-based reporting with file uploads</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Phone className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-purple-800 mb-1">Hotline</h4>
                  <p className="text-gray-600 text-sm">24/7 emergency number: 199</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <span className="text-2xl text-purple-600 mx-auto mb-2 block">SMS</span>
                  <h4 className="font-semibold text-purple-800 mb-1">Text Message</h4>
                  <p className="text-gray-600 text-sm">Send reports via SMS to 32123</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-purple-800 mb-1">In Person</h4>
                  <p className="text-gray-600 text-sm">Visit Defense HQ offices directly</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card className="mb-8 border-teal-200">
            <CardHeader>
              <CardTitle className="text-teal-800 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Best Practices for Effective Reporting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-teal-700 mb-3 flex items-center">
                    <Camera className="h-4 w-4 mr-2" />
                    Evidence Documentation
                  </h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Take clear, well-lit photos</li>
                    <li>• Record videos with stable footage</li>
                    <li>• Include timestamp and location data</li>
                    <li>• Capture multiple angles if possible</li>
                    <li>• Keep original files unedited</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-teal-700 mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Timing and Details
                  </h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Report incidents as soon as possible</li>
                    <li>• Provide exact time and date</li>
                    <li>• Include weather conditions if relevant</li>
                    <li>• Note the number of people involved</li>
                    <li>• Describe vehicles, clothing, or weapons</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Report?</h3>
            <p className="text-gray-600 mb-6">Choose your preferred reporting method below</p>
            <div className="space-x-4">
              <Link to="/report">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                  File Online Report
                </Button>
              </Link>
              <Link to="/emergency-contacts">
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3">
                  Emergency Contacts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guidelines;
