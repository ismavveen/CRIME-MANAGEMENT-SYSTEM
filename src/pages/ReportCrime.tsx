import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, AlertTriangle } from 'lucide-react';
import ProgressReportForm from '@/components/ProgressReportForm';
import ReportSuccessModal from '@/components/ReportSuccessModal';
import Navigation from "@/components/Navigation";

// Typewriter component with fix
const Typewriter: React.FC<{ text: string; speed?: number; loopDelay?: number; onLoop?: () => void }> = ({ text, speed = 45, loopDelay = 10000, onLoop }) => {
  const [displayed, setDisplayed] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const i = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let typing = true;
    setDisplayed('');
    i.current = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    intervalRef.current = setInterval(() => {
      if (typing && i.current < text.length) {
        setDisplayed((prev) => prev + text[i.current]);
        i.current += 1;
        if (i.current >= text.length) {
          typing = false;
          if (intervalRef.current) clearInterval(intervalRef.current);
          timeoutRef.current = setTimeout(() => {
            setDisplayed('');
            i.current = 0;
            typing = true;
            if (onLoop) onLoop();
            intervalRef.current = setInterval(() => {
              if (typing && i.current < text.length) {
                setDisplayed((prev) => prev + text[i.current]);
                i.current += 1;
                if (i.current >= text.length) {
                  typing = false;
                  if (intervalRef.current) clearInterval(intervalRef.current);
                  timeoutRef.current = setTimeout(() => {
                    setDisplayed('');
                    i.current = 0;
                    typing = true;
                    if (onLoop) onLoop();
                  }, loopDelay - text.length * speed);
                }
              }
            }, speed);
          }, loopDelay - text.length * speed);
        }
      }
    }, speed);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed, loopDelay, onLoop]);

  useEffect(() => {
    const cursorInterval = setInterval(() => setShowCursor((c) => !c), 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span>
      {displayed}
      <span className="text-cyan-400">{showCursor && '|'}</span>
    </span>
  );
};

const ReportFooter = () => (
  <footer className="bg-gray-900 text-gray-300 py-8 border-t border-gray-800 mt-12">
    <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 mb-4 md:mb-0">
        <img src="/lovable-uploads/170657b3-653f-4cd6-bbfe-c51ee743b13a.png" alt="Defence HQ Logo" className="h-12 w-12 object-contain rounded-full bg-white p-1" />
        <span className="font-bold text-lg text-white">Defence HQ Portal</span>
      </div>
      <div className="text-sm text-gray-400 text-center md:text-left w-full">
        <div className="border-t border-gray-700 my-2"></div>
        <div className="mb-2">
          <span className="font-semibold text-white">Defence Headquarters – Armed Forces of the Federal Republic of Nigeria</span><br />
          Armed Forces Complex, Area 7, Muhammadu Buhari Way, Garki, Abuja, FCT
        </div>
        <div className="mb-2">
          <span className="font-semibold">📞</span> +234 9 234 0142 | +234 9 234 0149 | 01 295 2003<br />
          <span className="font-semibold">✉️</span> Ministry of Defence: <a href="mailto:contact@defence.gov.ng" className="underline hover:text-cyan-300">contact@defence.gov.ng</a><br />
          <span className="font-semibold">🌐</span> DHQ Website: <a href="https://defenceinfo.mil.ng" className="underline hover:text-cyan-300" target="_blank" rel="noopener noreferrer">defenceinfo.mil.ng</a> | MoD: <a href="https://defence.gov.ng" className="underline hover:text-cyan-300" target="_blank" rel="noopener noreferrer">defence.gov.ng</a><br />
          <span className="font-semibold">🕒</span> Office Hours: Mon–Fri 08:00–17:00 (Closed Sat–Sun)
        </div>
        <div className="mb-2">
          <span className="font-semibold">🪖 Chief of Defence Staff:</span> General Christopher Gwabin Musa
        </div>
        <div>
          <span className="font-semibold">Departments:</span> Policy & Plans (DDPP), Training & Operations (DDTOPS), Administration (DDA), Communications (DDC), Logistics (DDL), Standards & Evaluation (DDSE), Transformation & Innovation (DDTI), Accounts & Budget (DDAB), Civil‑Military Relations (DDCMR)
        </div>
        <div className="border-t border-gray-700 my-2"></div>
        <div className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Defence Headquarters, Nigeria. All rights reserved.</div>
      </div>
    </div>
  </footer>
);

const SCROLLING_TEXT = "Your safety is our priority. All reports are confidential and securely processed. Anonymous reporting is available to ensure your privacy. Together, we build a safer nation.";

const ReportCrime = () => {
  const [showForm, setShowForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [reportId, setReportId] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  // Animation state for the paragraph
  const [showParagraph, setShowParagraph] = useState(false);

  // Sync paragraph animation with typewriter loop
  const handleTypewriterLoop = () => {
    setShowParagraph(false);
    setTimeout(() => setShowParagraph(true), 500);
  };

  useEffect(() => {
    setShowParagraph(true);
  }, []);

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
        <ReportFooter />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Scrolling Marquee - only on /report homepage */}
      <div className="w-full bg-cyan-900 py-2 border-b border-cyan-700 overflow-hidden">
        <div className="animate-marquee text-cyan-100 font-medium text-sm px-4">
          {SCROLLING_TEXT}
        </div>
      </div>
      <Navigation />
      {/* Hero Section - only reporting, no hotline */}
      <section className="relative bg-cover bg-center bg-no-repeat min-h-[70vh] flex items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/lovable-uploads/a0aa57d1-084a-4b45-b6d0-f81232c49e50.png')"
        }}>
        <div className="container mx-auto px-4 py-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
            <Typewriter text="Report a Crime or Threat – Join the Mission For a Safer Nigeria" loopDelay={10000} onLoop={handleTypewriterLoop} />
          </h1>
          <p className={`text-lg md:text-xl text-green-100 mb-8 max-w-3xl mx-auto text-center leading-relaxed transition-opacity transition-transform duration-1000 ${showParagraph ? 'opacity-100 translate-y-0 animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
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
      <ReportFooter />
    </div>
  );
};

// Add the fade-in-up animation to your global CSS if not present:
// @keyframes fade-in-up {
//   0% { opacity: 0; transform: translateY(30px); }
//   100% { opacity: 1; transform: translateY(0); }
// }
// .animate-fade-in-up { animation: fade-in-up 1.2s cubic-bezier(0.23,1,0.32,1) both; }

// Add this CSS to your global styles if not present:
// @keyframes marquee {
//   0% { transform: translateX(0%); }
//   100% { transform: translateX(-50%); }
// }
// .animate-marquee {
//   display: inline-block;
//   min-width: 200%;
//   animation: marquee 30s linear infinite;
// }

export default ReportCrime;
