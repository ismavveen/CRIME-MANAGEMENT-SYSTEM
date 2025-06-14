
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Video, BookOpen, Shield, Users, AlertTriangle, Globe, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";

const Resources = () => {
  const downloads = [
    {
      title: "Crime Reporting Guide",
      description: "Complete guide on how to report crimes effectively",
      type: "PDF",
      size: "2.5 MB",
      icon: FileText,
      downloadUrl: "#"
    },
    {
      title: "Security Awareness Handbook",
      description: "Personal and community security best practices",
      type: "PDF",
      size: "4.1 MB",
      icon: Shield,
      downloadUrl: "#"
    },
    {
      title: "Emergency Contact List",
      description: "Comprehensive list of emergency services nationwide",
      type: "PDF",
      size: "1.2 MB",
      icon: Phone,
      downloadUrl: "#"
    },
    {
      title: "Community Safety Toolkit",
      description: "Resources for community safety initiatives",
      type: "ZIP",
      size: "15.7 MB",
      icon: Users,
      downloadUrl: "#"
    }
  ];

  const videoResources = [
    {
      title: "How to Report Crime Online",
      description: "Step-by-step video tutorial for online crime reporting",
      duration: "5:32",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop"
    },
    {
      title: "Personal Safety Tips",
      description: "Essential safety tips for personal protection",
      duration: "8:15",
      thumbnail: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=300&h=200&fit=crop"
    },
    {
      title: "Recognizing Security Threats",
      description: "Learn to identify potential security threats in your area",
      duration: "12:20",
      thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop"
    }
  ];

  const educationalResources = [
    {
      title: "Understanding Crime Types",
      description: "Learn about different types of crimes and how to identify them",
      icon: AlertTriangle,
      color: "red"
    },
    {
      title: "Digital Security Guide",
      description: "Protect yourself from cyber crimes and online threats",
      icon: Globe,
      color: "blue"
    },
    {
      title: "Community Watch Programs",
      description: "How to establish and participate in neighborhood watch initiatives",
      icon: Users,
      color: "green"
    },
    {
      title: "Legal Rights & Procedures",
      description: "Understanding your rights when reporting crimes",
      icon: BookOpen,
      color: "purple"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-purple-800 mb-4">Resources & Downloads</h1>
            <p className="text-purple-600 text-lg">
              Access educational materials, guides, and tools to enhance your security awareness and reporting capabilities.
            </p>
          </div>

          {/* Downloads Section */}
          <Card className="mb-8 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800 flex items-center text-2xl">
                <Download className="h-6 w-6 mr-3" />
                Downloadable Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {downloads.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="border border-purple-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{item.type} • {item.size}</span>
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Video Resources */}
          <Card className="mb-8 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center text-2xl">
                <Video className="h-6 w-6 mr-3" />
                Video Tutorials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {videoResources.map((video, index) => (
                  <div key={index} className="border border-green-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                        {video.duration}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-700 transition-colors">
                          <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2">{video.title}</h3>
                      <p className="text-gray-600 text-sm">{video.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Educational Resources */}
          <Card className="mb-8 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center text-2xl">
                <BookOpen className="h-6 w-6 mr-3" />
                Educational Materials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {educationalResources.map((resource, index) => {
                  const Icon = resource.icon;
                  const colorClasses = {
                    red: "border-red-200 bg-red-50 text-red-600",
                    blue: "border-blue-200 bg-blue-50 text-blue-600",
                    green: "border-green-200 bg-green-50 text-green-600",
                    purple: "border-purple-200 bg-purple-50 text-purple-600"
                  };
                  
                  return (
                    <div key={index} className={`border rounded-lg p-6 ${colorClasses[resource.color as keyof typeof colorClasses]}`}>
                      <div className="flex items-start space-x-4">
                        <Icon className={`h-8 w-8 flex-shrink-0 ${resource.color === 'red' ? 'text-red-600' : resource.color === 'blue' ? 'text-blue-600' : resource.color === 'green' ? 'text-green-600' : 'text-purple-600'}`} />
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-2">{resource.title}</h3>
                          <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                          <Button variant="outline" size="sm" className={`${resource.color === 'red' ? 'border-red-600 text-red-600 hover:bg-red-50' : resource.color === 'blue' ? 'border-blue-600 text-blue-600 hover:bg-blue-50' : resource.color === 'green' ? 'border-green-600 text-green-600 hover:bg-green-50' : 'border-purple-600 text-purple-600 hover:bg-purple-50'}`}>
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-teal-200 text-center">
              <CardContent className="p-6">
                <FileText className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <h3 className="font-semibold text-teal-800 mb-2">Report a Crime</h3>
                <p className="text-gray-600 text-sm mb-4">Start reporting a crime using our secure online form</p>
                <Link to="/report">
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    Start Report
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-orange-200 text-center">
              <CardContent className="p-6">
                <Phone className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold text-orange-800 mb-2">Emergency Contacts</h3>
                <p className="text-gray-600 text-sm mb-4">Access emergency numbers and contact information</p>
                <Link to="/emergency-contacts">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    View Contacts
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-indigo-200 text-center">
              <CardContent className="p-6">
                <Mail className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="font-semibold text-indigo-800 mb-2">Get Support</h3>
                <p className="text-gray-600 text-sm mb-4">Contact our support team for assistance</p>
                <Link to="/contact">
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    Contact Us
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Newsletter Signup */}
          <Card className="border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Stay Updated</h3>
              <p className="text-gray-600 mb-6">Subscribe to receive security alerts, updates, and new resources</p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                />
                <Button className="bg-purple-600 hover:bg-purple-700 px-6">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Resources;
