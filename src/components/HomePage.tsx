
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Phone, Mail, MapPin, Smartphone, Globe, FileText, Lock, Clock, Users, AlertTriangle, CheckCircle, Eye, Mic } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "./Navigation";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Navigation />
      
      {/* Security Assurance Bar */}
      <div className="bg-green-800 text-white py-2 overflow-hidden">
        <div className="animate-scroll whitespace-nowrap">
          <span className="inline-block px-8">
            🔒 Your identity is protected • All information is encrypted • Anonymous reporting enabled • 
            Professional response guaranteed • Safe and secure reporting • 24/7 confidential service •
          </span>
        </div>
      </div>

      {/* Hero Section with Military Background */}
      <section className="relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('/lovable-uploads/34adc360-453d-4e8e-84ab-90dad7513fb3.png')`
          }}
        />
        
        {/* Content */}
        <div className="relative container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
            <div className="text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
                Report Crime Safely & Securely
              </h2>
              <p className="text-xl text-green-100 mb-8 leading-relaxed drop-shadow-md">
                The Nigerian Armed Forces is committed to maintaining security and protecting our citizens. 
                Your reports help us serve you better. Report incidents through multiple channels with complete confidentiality.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/report">
                  <Button size="lg" className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 shadow-lg">
                    <FileText className="mr-2 h-5 w-5" />
                    Start Anonymous Report
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/20 px-8 py-3 backdrop-blur-sm">
                  <Phone className="mr-2 h-5 w-5" />
                  Emergency Hotline: 199
                </Button>
              </div>
            </div>
            
            <div className="lg:flex justify-end hidden">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-md">
                <h3 className="text-xl font-bold text-white mb-4">Quick Access</h3>
                <div className="space-y-3">
                  <Link to="/report" className="block">
                    <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20">
                      <FileText className="mr-3 h-4 w-4" />
                      File New Report
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20">
                    <Phone className="mr-3 h-4 w-4" />
                    Call Emergency: 199
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20">
                    <Mic className="mr-3 h-4 w-4" />
                    Voice Report
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features Grid - moved below hero */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="border-green-200 hover:shadow-lg transition-shadow bg-white/95 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-green-800 mb-2">100% Anonymous</h3>
                <p className="text-green-600 text-sm">Your identity is completely protected. Report without fear of retribution.</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 hover:shadow-lg transition-shadow bg-white/95 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-green-800 mb-2">24/7 Available</h3>
                <p className="text-green-600 text-sm">Report crimes anytime, anywhere through multiple secure channels.</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 hover:shadow-lg transition-shadow bg-white/95 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-green-800 mb-2">Expert Response</h3>
                <p className="text-green-600 text-sm">Trained professionals handle your reports with care and urgency.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What You Can Report Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-green-800 mb-4">What You Can Report</h3>
            <p className="text-green-600 max-w-2xl mx-auto">
              We handle all types of criminal activities and security concerns. Your report helps keep our communities safe.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-green-200 hover:border-green-400 transition-colors">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-green-800 mb-2">Violent Crimes</h4>
                <p className="text-sm text-green-600">Assault, robbery, kidnapping, and other violent incidents</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 hover:border-green-400 transition-colors">
              <CardContent className="p-6 text-center">
                <Eye className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-green-800 mb-2">Suspicious Activity</h4>
                <p className="text-sm text-green-600">Unusual behavior, potential threats, or security concerns</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 hover:border-green-400 transition-colors">
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-green-800 mb-2">Fraud & Scams</h4>
                <p className="text-sm text-green-600">Financial crimes, identity theft, and fraudulent activities</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 hover:border-green-400 transition-colors">
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-green-800 mb-2">Other Crimes</h4>
                <p className="text-sm text-green-600">Drug-related offenses, vandalism, and other criminal activities</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reporting Channels */}
      <section className="bg-green-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-green-800 mb-4">Multiple Ways to Report</h3>
            <p className="text-green-600 max-w-2xl mx-auto">
              Choose the reporting method that works best for you. All channels are secure and confidential.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            <Card className="border-green-200 hover:border-green-400 transition-colors cursor-pointer hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <Globe className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-green-800 mb-2">Web Portal</h4>
                <p className="text-sm text-green-600">Secure online form with file uploads</p>
                <div className="mt-3">
                  <Link to="/report">
                    <Button size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                      Start Report
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 hover:border-green-400 transition-colors cursor-pointer hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-green-800 mb-2">Hotline</h4>
                <p className="text-sm text-green-600 mb-2">24/7 Emergency Line</p>
                <p className="text-lg font-bold text-green-800">199</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 hover:border-green-400 transition-colors cursor-pointer hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <Smartphone className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-green-800 mb-2">SMS</h4>
                <p className="text-sm text-green-600 mb-2">Text your report</p>
                <p className="text-lg font-bold text-green-800">32123</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 hover:border-green-400 transition-colors cursor-pointer hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-green-800 mb-2">Email</h4>
                <p className="text-sm text-green-600 mb-2">Secure email reporting</p>
                <p className="text-xs font-medium text-green-800">reports@defencehq.gov.ng</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 hover:border-green-400 transition-colors cursor-pointer hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <Mic className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-green-800 mb-2">Voice Recording</h4>
                <p className="text-sm text-green-600 mb-2">Record your report</p>
                <div className="mt-3">
                  <Link to="/report">
                    <Button size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                      Record Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 hover:border-green-400 transition-colors cursor-pointer hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-green-800 mb-2">Walk-in</h4>
                <p className="text-sm text-green-600">Visit nearest office for in-person reporting</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy & Security Assurance */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-green-800 mb-4">Your Privacy & Security</h3>
            <p className="text-green-600 max-w-3xl mx-auto">
              We take your privacy seriously. Here's how we protect you and your information.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-green-800 mb-2">End-to-End Encryption</h4>
              <p className="text-green-600 text-sm">All reports are encrypted from your device to our secure servers</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-green-800 mb-2">Anonymous Reporting</h4>
              <p className="text-green-600 text-sm">No personal information required. Your identity remains completely anonymous</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-green-800 mb-2">Whistleblower Protection</h4>
              <p className="text-green-600 text-sm">Full legal protection for those reporting crimes and misconduct</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-green-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Trusted by Citizens Nationwide</h3>
            <p className="text-green-200">Making our communities safer, one report at a time</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
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
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <img 
                  src="/lovable-uploads/0300e6fb-5eb3-4bee-9542-d2935a35734c.png" 
                  alt="Defence Headquarters Logo" 
                  className="h-12 w-12 object-contain"
                />
                <div>
                  <h4 className="font-bold text-green-800">Defence Headquarters</h4>
                  <p className="text-sm text-green-600">Crime Reporting Portal</p>
                </div>
              </div>
              <p className="text-green-600 text-sm">
                Protecting our nation through community partnership and secure reporting.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-green-800 mb-4">Emergency Contacts</h4>
              <div className="space-y-2 text-sm text-green-600">
                <p><strong>Emergency Hotline:</strong> 199</p>
                <p><strong>Non-Emergency:</strong> +234-9-670-1000</p>
                <p><strong>Email:</strong> reports@defencehq.gov.ng</p>
                <p><strong>SMS:</strong> 32123</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-green-800 mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <Link to="/report" className="block text-green-600 hover:text-green-800">File a Report</Link>
                <Link to="/faqs" className="block text-green-600 hover:text-green-800">FAQs</Link>
                <a href="#" className="block text-green-600 hover:text-green-800">Privacy Policy</a>
                <a href="#" className="block text-green-600 hover:text-green-800">Contact Us</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-green-200 mt-8 pt-6 text-center">
            <p className="text-xs text-green-600">
              © 2024 Defence Headquarters, Federal Republic of Nigeria. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
