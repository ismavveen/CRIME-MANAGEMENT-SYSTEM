
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Eye, Shield, FileText, Users, Car, Home, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";

const WhatToReport = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-800 mb-4">What You Can Report</h1>
            <p className="text-green-600">
              We handle all types of criminal activities and security concerns. Your report helps keep our communities safe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-green-200 hover:border-green-400 transition-colors">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-2 text-red-600" />
                  Violent Crimes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-green-600 text-sm">
                  <li>• Armed robbery and theft</li>
                  <li>• Assault and battery</li>
                  <li>• Kidnapping and abduction</li>
                  <li>• Sexual assault and harassment</li>
                  <li>• Domestic violence</li>
                  <li>• Murder and attempted murder</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:border-green-400 transition-colors">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center">
                  <Eye className="h-6 w-6 mr-2 text-orange-600" />
                  Suspicious Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-green-600 text-sm">
                  <li>• Unusual behavior in public places</li>
                  <li>• Potential terrorist activities</li>
                  <li>• Suspicious packages or vehicles</li>
                  <li>• Surveillance of sensitive areas</li>
                  <li>• Gatherings with weapons</li>
                  <li>• Threats to public safety</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:border-green-400 transition-colors">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-blue-600" />
                  Fraud & Financial Crimes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-green-600 text-sm">
                  <li>• Online scams and fraud</li>
                  <li>• Identity theft</li>
                  <li>• Credit card fraud</li>
                  <li>• Investment scams</li>
                  <li>• Advance fee fraud (419)</li>
                  <li>• Money laundering</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:border-green-400 transition-colors">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center">
                  <Smartphone className="h-6 w-6 mr-2 text-purple-600" />
                  Cybercrime
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-green-600 text-sm">
                  <li>• Hacking and data breaches</li>
                  <li>• Online harassment and bullying</li>
                  <li>• Phishing attempts</li>
                  <li>• Malware and virus attacks</li>
                  <li>• Social media crimes</li>
                  <li>• Digital extortion</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:border-green-400 transition-colors">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center">
                  <Shield className="h-6 w-6 mr-2 text-green-600" />
                  Corruption & Misconduct
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-green-600 text-sm">
                  <li>• Bribery and extortion</li>
                  <li>• Abuse of office</li>
                  <li>• Embezzlement</li>
                  <li>• Police misconduct</li>
                  <li>• Government corruption</li>
                  <li>• Contract fraud</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:border-green-400 transition-colors">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center">
                  <Users className="h-6 w-6 mr-2 text-pink-600" />
                  Human Trafficking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-green-600 text-sm">
                  <li>• Forced labor and slavery</li>
                  <li>• Sex trafficking</li>
                  <li>• Child trafficking</li>
                  <li>• Organ trafficking</li>
                  <li>• Illegal adoption</li>
                  <li>• Forced marriage</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
              <div>
                <h3 className="text-lg font-medium text-yellow-800">When to Call Emergency Services</h3>
                <p className="text-yellow-700 mt-1">
                  If you are witnessing a crime in progress or there is immediate danger to life or property, 
                  call <strong>199</strong> immediately. Do not use the online form for emergencies.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link to="/report">
              <Button className="bg-green-700 hover:bg-green-800 mr-4">
                <FileText className="mr-2 h-4 w-4" />
                Report a Crime
              </Button>
            </Link>
            <Link to="/how-to-report">
              <Button variant="outline" className="border-green-600 text-green-600">
                How to Report
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatToReport;
