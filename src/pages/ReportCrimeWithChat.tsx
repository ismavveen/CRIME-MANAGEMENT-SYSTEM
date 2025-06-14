
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AIChatInterface from '@/components/AIChatInterface';
import { Shield, Phone, MessageSquare, AlertTriangle } from 'lucide-react';

const ReportCrimeWithChat = () => {
  return (
    <div className="min-h-screen bg-dhq-dark-bg">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8 border-b border-gray-700/50 pb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-white p-2 mr-6">
              <img 
                src="/lovable-uploads/170657b3-653f-4cd6-bbfe-c51ee743b13a.png" 
                alt="Defense Headquarters Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-white mb-2">DEFENSE HEADQUARTERS</h1>
              <p className="text-xl text-gray-300">Crime Reporting Portal</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center text-green-400 text-sm">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>SECURE & ANONYMOUS</span>
                </div>
                <div className="flex items-center text-blue-400 text-sm">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  <span>24/7 MONITORING</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="bg-gray-800/50 border-gray-700/50 p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-3 text-red-400" />
                REPORT A CRIME
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  className="h-20 bg-red-600 hover:bg-red-700 flex flex-col items-center justify-center space-y-2"
                  onClick={() => window.location.href = '/report-crime'}
                >
                  <AlertTriangle className="w-8 h-8" />
                  <span className="font-bold">EMERGENCY REPORT</span>
                  <span className="text-xs">Critical incidents requiring immediate response</span>
                </Button>

                <Button 
                  variant="outline"
                  className="h-20 border-gray-600 hover:bg-gray-700 flex flex-col items-center justify-center space-y-2"
                  onClick={() => window.location.href = '/report-crime'}
                >
                  <MessageSquare className="w-8 h-8" />
                  <span className="font-bold">STANDARD REPORT</span>
                  <span className="text-xs">General crime reporting</span>
                </Button>

                <Button 
                  variant="outline"
                  className="h-20 border-gray-600 hover:bg-gray-700 flex flex-col items-center justify-center space-y-2"
                  onClick={() => window.location.href = '/track-report'}
                >
                  <Shield className="w-8 h-8" />
                  <span className="font-bold">TRACK REPORT</span>
                  <span className="text-xs">Check status of submitted reports</span>
                </Button>

                <Button 
                  variant="outline"
                  className="h-20 border-gray-600 hover:bg-gray-700 flex flex-col items-center justify-center space-y-2"
                  onClick={() => window.open('tel:199', '_self')}
                >
                  <Phone className="w-8 h-8" />
                  <span className="font-bold">EMERGENCY HOTLINE</span>
                  <span className="text-xs">Call 199 for immediate assistance</span>
                </Button>
              </div>
            </Card>

            {/* Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700/50 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Your Safety is Guaranteed</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-green-400" />
                    Anonymous reporting available
                  </li>
                  <li className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-green-400" />
                    End-to-end encryption
                  </li>
                  <li className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-green-400" />
                    Identity protection protocols
                  </li>
                  <li className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-green-400" />
                    Secure data handling
                  </li>
                </ul>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700/50 p-6">
                <h3 className="text-lg font-bold text-white mb-4">What Can You Report?</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Terrorism and security threats</li>
                  <li>• Armed robbery and theft</li>
                  <li>• Kidnapping incidents</li>
                  <li>• Drug trafficking</li>
                  <li>• Suspicious activities</li>
                  <li>• Any crime or threat to public safety</li>
                </ul>
              </Card>
            </div>
          </div>

          {/* AI Chat Assistant */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <AIChatInterface 
                userType="user" 
                context="Crime reporting portal - helping users report crimes and understand the process"
                title="DHQ Support Assistant"
                className="h-[600px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCrimeWithChat;
