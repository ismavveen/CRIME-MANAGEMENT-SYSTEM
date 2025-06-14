
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Shield, Clock, FileText, AlertTriangle, Users, Mail, MapPin, Lock, CheckCircle, Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProgressReportForm from '@/components/ProgressReportForm';
import ReportSuccessModal from '@/components/ReportSuccessModal';

const ReportCrime = () => {
  const [showForm, setShowForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [reportId, setReportId] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleReportSuccess = (id: string, serial: string) => {
    setReportId(id);
    setSerialNumber(serial);
    setShowSuccessModal(true);
    setShowForm(false);
  };

  const handleStartReport = () => {
    setShowForm(true);
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <ProgressReportForm onSuccess={handleReportSuccess} />
        <ReportSuccessModal 
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          reportId={reportId}
          serialNumber={serialNumber}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/0300e6fb-5eb3-4bee-9542-d2935a35734c.png" 
                alt="Defence Headquarters Logo" 
                className="h-10 w-10 object-contain"
              />
              <div>
                <h1 className="text-lg font-bold text-green-800">Defence HQ</h1>
                <p className="text-sm text-green-600">Crime Portal</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-green-600 font-medium">
                  <span>Report Crime</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-green-600 font-medium">
                  <span>Emergency</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-green-600 font-medium">
                  <span>Guidelines</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-green-600 font-medium">
                  <span>Contact</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-green-600 font-medium">
                  <span>Resources</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <Link to="/faqs" className="text-gray-700 hover:text-green-600 font-medium">
                FAQs
              </Link>
            </nav>

            {/* Emergency Button & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold">
                <Phone className="h-4 w-4 mr-2" />
                199
              </Button>
              
              {/* Mobile menu button */}
              <button 
                className="lg:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-4">
              <a href="#" className="block text-gray-700 hover:text-green-600 font-medium">Report Crime</a>
              <a href="#" className="block text-gray-700 hover:text-green-600 font-medium">Emergency</a>
              <a href="#" className="block text-gray-700 hover:text-green-600 font-medium">Guidelines</a>
              <a href="#" className="block text-gray-700 hover:text-green-600 font-medium">Contact</a>
              <a href="#" className="block text-gray-700 hover:text-green-600 font-medium">Resources</a>
              <Link to="/faqs" className="block text-gray-700 hover:text-green-600 font-medium">FAQs</Link>
            </div>
          </div>
        )}
      </header>

      {/* Security Notice */}
      <div className="bg-green-800 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <Lock className="h-4 w-4" />
            <span>Your identity is protected • All information is encrypted • Anonymous reporting enabled</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2000')`,
          minHeight: '500px'
        }}
      >
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Report Crime Safely & Securely
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed">
            The Nigerian Armed Forces is committed to maintaining security and protecting our citizens. 
            Your reports help us serve you better. Report incidents through multiple channels with complete confidentiality.
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={handleStartReport}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-lg"
              size="lg"
            >
              <FileText className="h-5 w-5 mr-2" />
              Report a Crime
            </Button>
            
            <div className="bg-red-600 text-white px-6 py-4 rounded-lg inline-block">
              <div className="flex items-center space-x-3">
                <Phone className="h-6 w-6" />
                <div>
                  <div className="text-xl font-bold">Emergency Hotline</div>
                  <div className="text-3xl font-bold">199</div>
                  <div className="text-sm">Available 24/7</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center bg-white border-0 shadow-lg">
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">100% Anonymous</h3>
              <p className="text-gray-600">Your identity is completely protected. Report without fear of retribution.</p>
            </Card>
            
            <Card className="p-6 text-center bg-white border-0 shadow-lg">
              <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">24/7 Available</h3>
              <p className="text-gray-600">Report crimes anytime, anywhere through multiple secure channels.</p>
            </Card>
            
            <Card className="p-6 text-center bg-white border-0 shadow-lg">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Expert Response</h3>
              <p className="text-gray-600">Trained professionals handle your reports with care and urgency.</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Emergency Notice */}
      <div className="bg-red-50 border-t border-red-200 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-8 h-8 text-red-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-red-800 text-lg mb-2">Emergency Situations</h4>
              <p className="text-red-700">
                For immediate threats or life-threatening emergencies, contact local emergency services (199, 112) 
                or the nearest security agency directly before submitting this report. This portal is for intelligence 
                gathering and non-emergency incident reporting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCrime;
