import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Shield, Clock, FileText, AlertTriangle, Users, Mail, MapPin, Lock, CheckCircle, Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProgressReportForm from '@/components/ProgressReportForm';
import ReportSuccessModal from '@/components/ReportSuccessModal';
import Navigation from "@/components/Navigation"; // Use navigation bar

const ReportCrime = () => {
  // ... keep React states as before ...
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
        <Navigation />
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
      <Navigation />
      {/* Hero Section - focus on report, no hotline */}
      <section className="relative bg-cover bg-center bg-no-repeat min-h-[70vh] flex items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/lovable-uploads/a0aa57d1-084a-4b45-b6d0-f81232c49e50.png')"
        }}>
        <div className="container mx-auto px-4 py-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
            Report Security Issues and Crime — Securely and Easily
          </h1>
          <p className="text-lg md:text-xl text-green-100 mb-8 max-w-3xl mx-auto text-center leading-relaxed">
            Your reports help defend Nigeria. Submit tips, crime details, or threats—anonymously or with your details. 
            We treat every report with utmost confidentiality and urgency. Instant investigation begins once you file.
          </p>
          <div className="flex justify-center">
            <Button 
              onClick={handleStartReport}
              className="bg-green-700 hover:bg-green-800 text-white px-12 py-4 text-lg font-bold rounded-xl"
              size="lg"
            >
              <FileText className="h-5 w-5 mr-2" />
              Start Crime Report
            </Button>
          </div>
        </div>
      </section>
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Why Report?</h2>
          <p className="text-green-700 font-medium mb-6">
            Your voice is crucial to national security and keeping communities across Nigeria safe. 
            Every piece of information helps us build intelligence, respond faster, and stop crime.
          </p>
          <ul className="list-disc text-left max-w-2xl mx-auto space-y-3 text-green-700">
            <li>Remain completely anonymous or include your contact for follow-up.</li>
            <li>Attach evidence such as images or videos for better investigation.</li>
            <li>Every report is treated confidentially and securely by the Defence Headquarters.</li>
            <li>Reporting crime could save lives!</li>
          </ul>
        </div>
      </div>
      <div className="bg-red-50 border-t border-red-200 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-8 h-8 text-red-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-red-800 text-lg mb-2">Emergency Situations</h4>
              <p className="text-red-700">
                For life-threatening emergencies, please contact emergency services directly.
                This platform is primarily for reporting intelligence or crimes that require DHQ follow-up—NOT for urgent rescue!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReportCrime;
