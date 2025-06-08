
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Phone, Mail, MapPin, Smartphone, Globe, FileText, Lock, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/0300e6fb-5eb3-4bee-9542-d2935a35734c.png" 
                alt="Defence Headquarters Logo" 
                className="h-16 w-16 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-green-800">Defence Headquarters</h1>
                <p className="text-sm text-green-600">Crime Reporting Portal</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-green-700">
              <Lock className="h-4 w-4" />
              <span className="text-sm font-medium">Secure & Confidential</span>
            </div>
          </div>
        </div>
      </header>

      {/* Scrolling Security Assurance */}
      <div className="bg-green-800 text-white py-2 overflow-hidden">
        <div className="animate-scroll whitespace-nowrap">
          <span className="inline-block px-8">
            🔒 Your details are secure and protected • Anonymous reporting available • All reports are confidential • 
            Your safety is our priority • 24/7 secure reporting system • Identity protection guaranteed •
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">
            Report Crime Safely & Securely
          </h2>
          <p className="text-xl text-green-700 mb-8 leading-relaxed">
            The Nigerian Armed Forces is committed to maintaining security and protecting our citizens. 
            Your reports help us serve you better. Report incidents through multiple channels with complete confidentiality.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/report">
              <Button size="lg" className="bg-green-700 hover:bg-green-800 text-white px-8 py-3">
                <FileText className="mr-2 h-5 w-5" />
                Start Report
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-green-700 text-green-700 hover:bg-green-50 px-8 py-3">
              <Phone className="mr-2 h-5 w-5" />
              Emergency Hotline
            </Button>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-green-800 mb-2">100% Anonymous</h3>
                <p className="text-green-600 text-sm">Your identity is completely protected. Report without fear.</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-green-800 mb-2">24/7 Available</h3>
                <p className="text-green-600 text-sm">Report crimes anytime, anywhere through multiple channels.</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-green-800 mb-2">Expert Response</h3>
                <p className="text-green-600 text-sm">Trained professionals handle your reports with care and urgency.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reporting Channels */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-green-800 mb-8">Multiple Ways to Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="border-green-200 hover:border-green-400 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <Globe className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-green-800 mb-2">Web Portal</h4>
                <p className="text-sm text-green-600">Online form with file uploads</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 hover:border-green-400 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <Smartphone className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-green-800 mb-2">Mobile App</h4>
                <p className="text-sm text-green-600">iOS & Android compatible</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 hover:border-green-400 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-green-800 mb-2">SMS</h4>
                <p className="text-sm text-green-600">Text: 32123</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 hover:border-green-400 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-green-800 mb-2">Email</h4>
                <p className="text-sm text-green-600">reports@defencehq.gov.ng</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 hover:border-green-400 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-green-800 mb-2">Physical Office</h4>
                <p className="text-sm text-green-600">Visit nearest office</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-green-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">15,000+</div>
              <div className="text-green-200">Reports Processed</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-green-200">Response Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-green-200">Availability</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-green-200">Confidential</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-green-200 py-8">
        <div className="container mx-auto px-4 text-center text-green-600">
          <p className="mb-4">Nigerian Armed Forces - Defence Headquarters</p>
          <p className="text-sm">Emergency Hotline: 199 | Non-Emergency: +234-9-670-1000</p>
          <p className="text-xs mt-4">© 2024 Defence Headquarters. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
