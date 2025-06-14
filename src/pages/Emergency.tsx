
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MapPin, Mail, Clock, AlertTriangle, Shield, Users, Siren } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";

const Emergency = () => {
  const emergencyServices = [
    {
      name: "Police Emergency",
      number: "199",
      description: "For immediate police assistance",
      available: "24/7",
      icon: Shield
    },
    {
      name: "Fire Service",
      number: "112",
      description: "Fire emergencies and rescue operations",
      available: "24/7",
      icon: Siren
    },
    {
      name: "Medical Emergency",
      number: "112",
      description: "Medical emergencies and ambulance services",
      available: "24/7",
      icon: AlertTriangle
    },
    {
      name: "DHQ Emergency Line",
      number: "+234-9-670-1000",
      description: "Defense Headquarters emergency response",
      available: "24/7",
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Emergency Alert Banner */}
          <div className="bg-red-600 text-white p-6 rounded-lg mb-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">EMERGENCY SERVICES</h1>
            <p className="text-xl">If you are in immediate danger, call emergency services now!</p>
          </div>

          {/* Quick Emergency Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {emergencyServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="border-red-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <Icon className="h-12 w-12 text-red-600 mx-auto mb-2" />
                    <CardTitle className="text-red-800">{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">{service.number}</div>
                    <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                    <p className="text-green-600 text-xs font-semibold">{service.available}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Emergency Guidelines */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  What Constitutes an Emergency?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li>• Life-threatening situations</li>
                  <li>• Ongoing crimes in progress</li>
                  <li>• Security threats to national infrastructure</li>
                  <li>• Armed conflicts or terrorist activities</li>
                  <li>• Kidnapping or hostage situations</li>
                  <li>• Major accidents with casualties</li>
                  <li>• Natural disasters requiring immediate response</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  How to Make an Emergency Call
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-gray-700">
                  <li>1. Stay calm and speak clearly</li>
                  <li>2. Provide your exact location</li>
                  <li>3. Describe the nature of the emergency</li>
                  <li>4. Give details about injuries or damages</li>
                  <li>5. Stay on the line for instructions</li>
                  <li>6. Do not hang up until told to do so</li>
                  <li>7. Follow any instructions given by the operator</li>
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Preparedness */}
          <Card className="border-green-200 mb-8">
            <CardHeader>
              <CardTitle className="text-green-800">Emergency Preparedness Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">Before an Emergency</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Keep emergency numbers saved</li>
                    <li>• Have a family emergency plan</li>
                    <li>• Maintain emergency supplies</li>
                    <li>• Know evacuation routes</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">During an Emergency</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Call emergency services immediately</li>
                    <li>• Follow official instructions</li>
                    <li>• Stay informed through official channels</li>
                    <li>• Help others if safe to do so</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">After an Emergency</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Check for injuries and damages</li>
                    <li>• Report the incident officially</li>
                    <li>• Document everything</li>
                    <li>• Seek support if needed</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Need to Report a Non-Emergency?</h3>
            <p className="text-gray-600 mb-6">For non-urgent matters, use our online reporting system</p>
            <Link to="/report">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                File a Report Online
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
