import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MapPin, Mail, Clock, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";

const EmergencyContacts = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-800 mb-4">Emergency Contacts</h1>
            <p className="text-green-600">
              Quick access to emergency services and important contact information
            </p>
          </div>

          {/* Emergency Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Emergency Hotline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-4xl font-bold text-red-600 mb-2">199</p>
                  <p className="text-red-700">For immediate emergency assistance</p>
                  <p className="text-sm text-red-600 mt-2">Available 24/7 - Free from all networks</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Non-Emergency Line
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-green-700">+234-9-670-1000</p>
                  <p className="text-green-600">For general inquiries and non-urgent reports</p>
                  <p className="text-sm text-green-500">Monday - Friday: 8:00 AM - 6:00 PM</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Other Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-green-200">
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-green-800 mb-2">Email Reports</h3>
                <p className="text-sm text-green-600 mb-3">reports@defencehq.gov.ng</p>
                <p className="text-xs text-green-500">Response within 24-48 hours</p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-green-800 mb-2">SMS Reports</h3>
                <p className="text-sm text-green-600 mb-3">Send to: 32123</p>
                <p className="text-xs text-green-500">Anonymous SMS reporting available</p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-green-800 mb-2">Visit Office</h3>
                <p className="text-sm text-green-600 mb-3">Defence Headquarters, Abuja</p>
                <p className="text-xs text-green-500">In-person reporting available</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Link to="/report">
              <Button className="bg-green-700 hover:bg-green-800">
                File a Report Online
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContacts;
