
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, AlertTriangle } from 'lucide-react';
import ProgressReportForm from '@/components/ProgressReportForm';
import ReportSuccessModal from '@/components/ReportSuccessModal';
import Navigation from "@/components/Navigation";

const ReportCrime = () => {
  const [showForm, setShowForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [reportId, setReportId] = useState('');
  const [serialNumber, setSerialNumber] = useState('');

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
      {/* Hero Section - only reporting, no hotline */}
      <section className="relative bg-cover bg-center bg-no-repeat min-h-[70vh] flex items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/lovable-uploads/a0aa57d1-084a-4b45-b6d0-f81232c49e50.png')"
        }}>
        <div className="container mx-auto px-4 py-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
            Report a Crime or Threat – Join the Mission For a Safer Nigeria
          </h1>
          <p className="text-lg md:text-xl text-green-100 mb-8 max-w-3xl mx-auto text-center leading-relaxed">
            Use this secure portal to submit crime or security reports directly to Defence Headquarters. You can be completely anonymous, or share your details for follow-up. Every credible report helps protect lives and strengthen national security. Fill out the easy form and your tip will be sent instantly for review and action.
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
          <h2 className="text-2xl font-bold text-green-800 mb-4">Why Should You Report?</h2>
          <p className="text-green-700 font-medium mb-6">
            Play your part in building a safer community. Each report could save lives, help prevent crime, and ensure justice. Anonymity is guaranteed when you want it, and all information is handled securely by the Nigerian Defence Headquarters.
          </p>
          <ul className="list-disc text-left max-w-2xl mx-auto space-y-3 text-green-700">
            <li>Stay anonymous or provide contact for updates – you decide.</li>
            <li>Easily attach photos, videos, or documents as evidence.</li>
            <li>Help security forces rapidly prioritize and respond to real incidents.</li>
            <li>Your tip makes a real difference in the fight against crime and insecurity.</li>
          </ul>
        </div>
      </div>
      <div className="bg-yellow-50 border-t border-yellow-200 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-yellow-800 text-lg mb-2">When To Call Emergency Services?</h4>
              <p className="text-yellow-700">
                If you are in immediate danger or witness a serious crime in progress, call national emergency services instead of waiting. This web portal is for non-urgent tips and investigations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReportCrime;
