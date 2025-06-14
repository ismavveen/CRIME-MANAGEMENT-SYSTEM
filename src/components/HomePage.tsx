import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Phone, Mail, MapPin, Smartphone, Globe, FileText, Lock, Clock, Users, AlertTriangle, CheckCircle, Eye, Mic, Heart, Star, Award } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "./Navigation";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Navigation />
      
      {/* Security Assurance Bar */}
      <div className="bg-green-800 text-white py-3 overflow-hidden">
        <div className="animate-scroll whitespace-nowrap">
          <span className="inline-block px-8 text-sm">
            🔒 Your identity is protected • All information is encrypted • Anonymous reporting enabled • 
            Professional response guaranteed • Safe and secure reporting • 24/7 confidential service •
            Your contribution matters to national security • Together we keep Nigeria safe •
          </span>
        </div>
      </div>

      {/* Hero Section with New Military Background */}
      <section className="relative min-h-[80vh] flex items-center justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url('/lovable-uploads/a0aa57d1-084a-4b45-b6d0-f81232c49e50.png')`
          }}
        />
        
        {/* Content - Centered */}
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg leading-tight">
                Your Voice Protects Our Nation
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-green-200 mb-6 drop-shadow-md">
                Report Crime Safely & Securely
              </h2>
              <p className="text-lg md:text-xl text-green-100 mb-8 leading-relaxed drop-shadow-md max-w-4xl mx-auto">
                The Nigerian Armed Forces stands with you in the fight against crime. Your reports are not just information—they are 
                vital intelligence that helps us protect lives, secure communities, and strengthen our nation's defense. 
                Every report you submit contributes directly to national security and the safety of your fellow citizens.
              </p>
            </div>
            
            <div className="mb-10">
              <Link to="/report">
                <Button size="lg" className="bg-green-700 hover:bg-green-800 text-white px-16 py-6 text-xl font-bold shadow-2xl border-2 border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 rounded-xl">
                  <FileText className="mr-3 h-7 w-7" />
                  Report a Crime Now
                </Button>
              </Link>
              <p className="text-green-200 mt-4 text-sm font-medium">
                ✨ Takes less than 5 minutes • Completely anonymous • Immediate response
              </p>
            </div>

            {/* Emergency Hotline */}
            <div className="bg-red-600/95 backdrop-blur-sm rounded-xl p-6 max-w-sm mx-auto mb-10 border-2 border-white/20">
              <div className="text-white">
                <Phone className="h-8 w-8 mx-auto mb-3 animate-pulse" />
                <h3 className="text-xl font-bold mb-2">Emergency Hotline</h3>
                <p className="text-4xl font-bold mb-2">199</p>
                <p className="text-sm opacity-90">Available 24/7 • Toll-Free</p>
                <p className="text-xs mt-2 opacity-80">For immediate life-threatening situations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Your Report Matters Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-green-800 mb-6">Why Your Report Matters</h3>
            <p className="text-xl text-green-600 max-w-4xl mx-auto leading-relaxed">
              Every piece of information you share helps us build a comprehensive picture of security challenges across Nigeria. 
              Your contribution directly impacts our ability to respond effectively and protect communities nationwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-8 text-center">
                <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-4">National Security Intelligence</h3>
                <p className="text-green-600 leading-relaxed">
                  Your reports provide crucial intelligence that helps our forces identify patterns, predict threats, 
                  and deploy resources where they're needed most to protect our nation.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-8 text-center">
                <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-blue-800 mb-4">Community Protection</h3>
                <p className="text-blue-600 leading-relaxed">
                  Every report helps us protect families, schools, markets, and communities across Nigeria. 
                  Your vigilance directly contributes to the safety of your neighbors and loved ones.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-8 text-center">
                <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Award className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-purple-800 mb-4">Civic Duty & Patriotism</h3>
                <p className="text-purple-600 leading-relaxed">
                  Reporting suspicious activities is an act of patriotism. You become an active participant 
                  in defending our democracy and ensuring peace for future generations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Security Features */}
      <section className="bg-green-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-green-800 mb-6">Built on Trust & Security</h3>
            <p className="text-xl text-green-600 max-w-3xl mx-auto">
              We understand that reporting sensitive information requires absolute trust. That's why we've built 
              the most secure and anonymous reporting system in Nigeria.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <Card className="border-green-200 hover:shadow-lg transition-all duration-300 bg-white group hover:bg-green-50">
              <CardContent className="p-6 text-center">
                <Lock className="h-12 w-12 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-green-800 mb-2">100% Anonymous</h3>
                <p className="text-green-600 text-sm">Your identity is completely protected. Report without fear of retribution.</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 hover:shadow-lg transition-all duration-300 bg-white group hover:bg-green-50">
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-green-800 mb-2">24/7 Available</h3>
                <p className="text-green-600 text-sm">Report crimes anytime, anywhere through multiple secure channels.</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 hover:shadow-lg transition-all duration-300 bg-white group hover:bg-green-50">
              <CardContent className="p-6 text-center">
                <Eye className="h-12 w-12 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-green-800 mb-2">Expert Response</h3>
                <p className="text-green-600 text-sm">Trained professionals handle your reports with care and urgency.</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-all duration-300 bg-white group hover:bg-green-50">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-green-800 mb-2">Verified System</h3>
                <p className="text-green-600 text-sm">Government-certified secure infrastructure with end-to-end encryption.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What You Can Report Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-green-800 mb-6">What You Can Report</h3>
            <p className="text-xl text-green-600 max-w-3xl mx-auto">
              We handle all types of criminal activities and security concerns. Your report helps keep our communities safe.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="border-red-200 hover:border-red-400 transition-all duration-300 hover:shadow-lg group">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-10 w-10 text-red-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-red-800 mb-3">Violent Crimes</h4>
                <p className="text-sm text-red-600">Assault, robbery, kidnapping, and other violent incidents</p>
              </CardContent>
            </Card>
            
            <Card className="border-orange-200 hover:border-orange-400 transition-all duration-300 hover:shadow-lg group">
              <CardContent className="p-6 text-center">
                <Eye className="h-10 w-10 text-orange-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-orange-800 mb-3">Suspicious Activity</h4>
                <p className="text-sm text-orange-600">Unusual behavior, potential threats, or security concerns</p>
              </CardContent>
            </Card>
            
            <Card className="border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg group">
              <CardContent className="p-6 text-center">
                <FileText className="h-10 w-10 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-blue-800 mb-3">Fraud & Scams</h4>
                <p className="text-sm text-blue-600">Financial crimes, identity theft, and fraudulent activities</p>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-lg group">
              <CardContent className="p-6 text-center">
                <Shield className="h-10 w-10 text-purple-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-purple-800 mb-3">Other Crimes</h4>
                <p className="text-sm text-purple-600">Drug-related offenses, vandalism, and other criminal activities</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reporting Channels */}
      <section className="bg-green-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-green-800 mb-6">Multiple Ways to Report</h3>
            <p className="text-xl text-green-600 max-w-3xl mx-auto">
              Choose the reporting method that works best for you. All channels are secure and confidential.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 max-w-7xl mx-auto">
            <Card className="border-green-200 hover:border-green-400 transition-all duration-300 cursor-pointer hover:shadow-xl group hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <Globe className="h-10 w-10 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-green-800 mb-3">Web Portal</h4>
                <p className="text-sm text-green-600 mb-4">Secure online form with file uploads</p>
                <Link to="/report">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    Start Report
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="border-red-200 hover:border-red-400 transition-all duration-300 cursor-pointer hover:shadow-xl group hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <Phone className="h-10 w-10 text-red-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-red-800 mb-3">Emergency Hotline</h4>
                <p className="text-sm text-red-600 mb-2">24/7 Emergency Line</p>
                <p className="text-2xl font-bold text-red-800">199</p>
              </CardContent>
            </Card>
            
            <Card className="border-blue-200 hover:border-blue-400 transition-all duration-300 cursor-pointer hover:shadow-xl group hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <Smartphone className="h-10 w-10 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-blue-800 mb-3">SMS Reporting</h4>
                <p className="text-sm text-blue-600 mb-2">Text your report</p>
                <p className="text-xl font-bold text-blue-800">32123</p>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200 hover:border-purple-400 transition-all duration-300 cursor-pointer hover:shadow-xl group hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <Mail className="h-10 w-10 text-purple-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-purple-800 mb-3">Email Reports</h4>
                <p className="text-sm text-purple-600 mb-2">Secure email reporting</p>
                <p className="text-xs font-medium text-purple-800">reports@defencehq.gov.ng</p>
              </CardContent>
            </Card>
            
            <Card className="border-orange-200 hover:border-orange-400 transition-all duration-300 cursor-pointer hover:shadow-xl group hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <Mic className="h-10 w-10 text-orange-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-orange-800 mb-3">Voice Recording</h4>
                <p className="text-sm text-orange-600 mb-4">Record your testimony</p>
                <Link to="/report">
                  <Button size="sm" variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                    Record Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="border-gray-200 hover:border-gray-400 transition-all duration-300 cursor-pointer hover:shadow-xl group hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <MapPin className="h-10 w-10 text-gray-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-gray-800 mb-3">Walk-in Centers</h4>
                <p className="text-sm text-gray-600">Visit nearest office for in-person reporting</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-green-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold mb-4">Trusted by Citizens Nationwide</h3>
            <p className="text-green-200 text-lg">Making our communities safer, one report at a time</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-4xl mx-auto">
            <div className="group">
              <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">25,000+</div>
              <div className="text-green-200">Reports Processed</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">98%</div>
              <div className="text-green-200">Response Rate</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">24/7</div>
              <div className="text-green-200">Availability</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">100%</div>
              <div className="text-green-200">Confidential</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-4xl font-bold text-white mb-6">Ready to Make a Difference?</h3>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              Your report could be the key to preventing crime, saving lives, and protecting our nation. 
              Join thousands of patriots who actively contribute to Nigeria's security every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/report">
                <Button size="lg" className="bg-white text-green-800 hover:bg-green-50 px-12 py-4 text-lg font-bold shadow-xl hover:scale-105 transition-all duration-300">
                  <FileText className="mr-3 h-6 w-6" />
                  Submit Your Report
                </Button>
              </Link>
              <Link to="/emergency">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-800 px-12 py-4 text-lg font-bold">
                  <Phone className="mr-3 h-6 w-6" />
                  Emergency Contacts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-green-200 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-4 mb-6">
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
              <p className="text-green-600 text-sm leading-relaxed">
                Protecting our nation through community partnership and secure reporting. 
                Together, we build a safer Nigeria for all.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-green-800 mb-4">Emergency Contacts</h4>
              <div className="space-y-2 text-sm text-green-600">
                <p className="text-red-600 font-bold text-lg">Emergency: 199</p>
                <p><strong>Non-Emergency:</strong> +234-9-670-1000</p>
                <p><strong>Email:</strong> reports@defencehq.gov.ng</p>
                <p><strong>SMS:</strong> 32123</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-green-800 mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <Link to="/report" className="block text-green-600 hover:text-green-800 font-medium transition-colors">📝 File a Report</Link>
                <Link to="/faqs" className="block text-green-600 hover:text-green-800 transition-colors">❓ FAQs</Link>
                <Link to="/guidelines" className="block text-green-600 hover:text-green-800 transition-colors">📋 Guidelines</Link>
                <Link to="/contact" className="block text-green-600 hover:text-green-800 transition-colors">📞 Contact Us</Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-green-800 mb-4">Report Methods</h4>
              <div className="space-y-2 text-sm">
                <Link to="/report" className="block text-green-600 hover:text-green-800 transition-colors">🌐 Web Portal</Link>
                <p className="text-green-600">📱 SMS: 32123</p>
                <p className="text-green-600">📧 Email Reports</p>
                <p className="text-green-600">🎤 Voice Recording</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-green-200 mt-10 pt-6 text-center">
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
