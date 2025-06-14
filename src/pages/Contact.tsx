
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, Globe, Users } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "../components/Navigation";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We'll respond within 24-48 hours.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-800 mb-4">Contact Defense Headquarters</h1>
            <p className="text-blue-600 text-lg">
              Get in touch with us for inquiries, support, or general information about our services.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Contact Form */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="border-blue-300 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      className="border-blue-300 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      placeholder="Brief description of your inquiry"
                      required
                      className="border-blue-300 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="Please provide detailed information about your inquiry..."
                      rows={5}
                      required
                      className="border-blue-300 focus:border-blue-500"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    Phone Numbers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-gray-800">Emergency Hotline</p>
                      <p className="text-red-600 font-bold text-lg">199</p>
                      <p className="text-sm text-gray-600">24/7 Emergency Response</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-gray-800">General Inquiries</p>
                      <p className="text-green-600 font-bold">+234-9-670-1000</p>
                      <p className="text-sm text-gray-600">Monday - Friday: 8AM - 6PM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-gray-800">Media Relations</p>
                      <p className="text-blue-600 font-bold">+234-9-670-1050</p>
                      <p className="text-sm text-gray-600">Press & Media Inquiries</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="text-purple-800 flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Email Addresses
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-800">Crime Reports</p>
                    <p className="text-purple-600">reports@defencehq.gov.ng</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">General Information</p>
                    <p className="text-purple-600">info@defencehq.gov.ng</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Media & Press</p>
                    <p className="text-purple-600">media@defencehq.gov.ng</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Technical Support</p>
                    <p className="text-purple-600">support@defencehq.gov.ng</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Physical Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-800">Defence Headquarters</p>
                    <p className="text-gray-700">Ship House, Area 10</p>
                    <p className="text-gray-700">Garki, Abuja</p>
                    <p className="text-gray-700">Federal Capital Territory, Nigeria</p>
                    <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Office Hours: Monday - Friday, 8:00 AM - 6:00 PM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Services */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-teal-200 text-center">
              <CardContent className="p-6">
                <Globe className="h-12 w-12 text-teal-600 mx-auto mb-3" />
                <h3 className="font-semibold text-teal-800 mb-2">Online Services</h3>
                <p className="text-gray-600 text-sm">Access our digital services and online reporting platform 24/7</p>
              </CardContent>
            </Card>

            <Card className="border-indigo-200 text-center">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-indigo-600 mx-auto mb-3" />
                <h3 className="font-semibold text-indigo-800 mb-2">Community Outreach</h3>
                <p className="text-gray-600 text-sm">Participate in community programs and security awareness initiatives</p>
              </CardContent>
            </Card>

            <Card className="border-pink-200 text-center">
              <CardContent className="p-6">
                <MessageSquare className="h-12 w-12 text-pink-600 mx-auto mb-3" />
                <h3 className="font-semibold text-pink-800 mb-2">Feedback & Suggestions</h3>
                <p className="text-gray-600 text-sm">Help us improve our services by sharing your feedback and suggestions</p>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Link */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Have Questions?</h3>
            <p className="text-gray-600 mb-6">Check our frequently asked questions for quick answers</p>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              <MessageSquare className="h-4 w-4 mr-2" />
              View FAQ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
