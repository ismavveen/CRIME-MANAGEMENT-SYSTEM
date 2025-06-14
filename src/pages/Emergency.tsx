
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
          <div className="bg-red-600 text-white p-6 rounded-lg mb-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">EMERGENCY SERVICES</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Are you in immediate danger? Call national emergency numbers below.
              This portal is for reporting crime; in urgent life-threatening emergencies, PLEASE CALL the numbers provided for direct assistance.
              The following services operate 24/7 for rapid response.
            </p>
          </div>
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
          <div className="max-w-3xl mx-auto text-center border-t border-red-100 pt-8 mt-8">
            <h2 className="text-2xl text-red-800 font-bold mb-2">When should I use these hotlines?</h2>
            <p className="text-red-700">
              Use these numbers only for immediate threats to life or property—armed attacks, fire, severe accident, or critical illness.
              The DHQ crime reporting system is best for cases where time is less urgent, ensuring intelligence is collected and forwarded for investigation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Emergency;
