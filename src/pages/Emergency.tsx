import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield, Users, Siren, MapPin } from "lucide-react";
import Navigation from "../components/Navigation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Emergency = () => {
  const emergencyServices = [
    {
      name: "Police Emergency",
      number: "199",
      description: "Dial for immediate police assistance anywhere in Nigeria.",
      available: "24/7",
      icon: Shield
    },
    {
      name: "Fire Service",
      number: "112",
      description: "For all fire emergencies and rescue operations.",
      available: "24/7",
      icon: Siren
    },
    {
      name: "Medical Emergency",
      number: "112",
      description: "Ambulance and urgent medical emergencies.",
      available: "24/7",
      icon: AlertTriangle
    },
    {
      name: "DHQ Emergency Line",
      number: "+234-9-670-1000",
      description: "Reach the Defence HQ for urgent threats to national security.",
      available: "24/7",
      icon: Users
    }
  ];
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-600 text-white p-6 rounded-lg mb-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">EMERGENCY SERVICES & HOTLINES</h1>
            <p className="text-xl max-w-3xl mx-auto">
              If you are in immediate, life-threatening danger, dial the numbers below for the fastest emergency response. This page provides a directory for all urgent services. Do not use this section for intelligence or tip submissions—visit the Report Crime page for routine incidents or investigations.
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
          {/* Add link to Emergency Location Sharing */}
          <div className="mb-8 text-center">
            <Button
              className="bg-green-600 text-white text-lg font-semibold px-8 py-4 rounded shadow-lg inline-flex items-center"
              onClick={() => navigate("/emergency-location")}
            >
              <MapPin className="mr-2 h-6 w-6" />
              Emergency Location Sharing
            </Button>
          </div>
          <div className="max-w-3xl mx-auto text-center border-t border-red-100 pt-8 mt-8">
            <h2 className="text-2xl text-red-800 font-bold mb-2">When should I use these hotlines?</h2>
            <p className="text-red-700">
              These services are only for direct threats to life, property, or public safety. Report all other security concerns, intelligence tips, or routine crimes in the <b>Report Crime</b> section. Your information could still save lives!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Emergency;
