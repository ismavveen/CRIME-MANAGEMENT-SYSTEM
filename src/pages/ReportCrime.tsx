import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Video, Mic, Shield, Clock, AlertCircle, AlertTriangle, MessageSquare, Phone, Mail, MapPin } from 'lucide-react';
import ProgressReportForm from '@/components/ProgressReportForm';
import ReportSuccessModal from '@/components/ReportSuccessModal';
import Navigation from "@/components/Navigation";
import Marquee from '@/components/Marquee';
import AnimatedHeroHeadline from '@/components/AnimatedHeroHeadline';
import HeroImageCarousel from '@/components/HeroImageCarousel';
import { useNavigate } from 'react-router-dom';
import FAQSection from '@/components/FAQSection';
import SecurityInitiativesSection from '@/components/SecurityInitiativesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
// Security Shield SVG Animation Component
const SecurityShieldAnimation = () => (
  <div className="relative w-64 h-64 mx-auto">
    {/* Outer shield with pulse animation */}
    <svg 
      className="absolute inset-0 w-full h-full text-blue-600 opacity-20" 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M100 20C100 20 40 40 20 60C20 100 40 160 100 180C160 160 180 100 180 60C160 40 100 20 100 20Z" 
        stroke="currentColor" 
        strokeWidth="2"
        className="animate-pulse"
      />
    </svg>
    
    {/* Middle shield with slower pulse */}
    <svg 
      className="absolute inset-0 w-full h-full text-blue-500 opacity-40" 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{
        animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        animationDelay: '0.3s'
      }}
    >
      <path 
        d="M100 30C100 30 50 50 30 70C30 100 50 160 100 175C150 160 170 100 170 70C150 50 100 30 100 30Z" 
        stroke="currentColor" 
        strokeWidth="2"
      />
    </svg>
    
    {/* Main shield with fill */}
    <svg 
      className="relative w-full h-full text-blue-600" 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M100 40C100 40 60 56 40 72C40 100 60 160 100 170C140 160 160 100 160 72C140 56 100 40 100 40Z" 
        fill="currentColor" 
        fillOpacity="0.1"
        stroke="currentColor" 
        strokeWidth="3"
      />
      
      {/* Checkmark */}
      <path 
        d="M80 100L95 115L130 80" 
        stroke="#10B981" 
        strokeWidth="10" 
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-draw"
        style={{
          strokeDasharray: 100,
          strokeDashoffset: 100,
          animation: 'draw 2s ease-out forwards',
          animationDelay: '0.5s'
        }}
      />
    </svg>
    
    {/* Animation keyframes */}
    <style dangerouslySetInnerHTML={{
      __html: `
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
        .animate-draw {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: draw 2s ease-out forwards;
        }
      `
    }} />
  </div>
);

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
        <div>
          <div className="font-bold text-lg text-white">Defence Headquarters</div>
          <div className="text-sm text-gray-400">Armed Forces of Nigeria</div>
        </div>
      </div>
      <div className="text-sm text-gray-400 text-center md:text-left w-full">
        <div className="border-t border-gray-700 my-2"></div>
        <div className="mb-2">
          <span className="font-semibold text-white">Defence Headquarters – Armed Forces of the Federal Republic of Nigeria</span><br />
          Armed Forces Complex, Area 7, Muhammadu Buhari Way, Garki, Abuja, FCT
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <div className="mb-1">
              <span className="font-semibold">📞 Emergency:</span> 112 (Toll-free) | 199
            </div>
            <div className="mb-1">
              <span className="font-semibold">📞 Helpline:</span> +234 9 234 0142 | +234 9 234 0149
            </div>
            <div>
              <span className="font-semibold">✉️ Email:</span>{' '}
              <a href="mailto:report@defencehq.mil.ng" className="underline hover:text-cyan-300">report@defencehq.mil.ng</a>
            </div>
          </div>
          <div>
            <div className="mb-1">
              <span className="font-semibold">🌐 Website:</span>{' '}
              <a href="https://defencehq.mil.ng" className="underline hover:text-cyan-300" target="_blank" rel="noopener noreferrer">
                defencehq.mil.ng
              </a>
            </div>
            <div className="mb-1">
              <span className="font-semibold">🏢 Office Hours:</span> Mon–Fri 08:00–17:00 (Closed Sat–Sun & Public Holidays)
            </div>
          </div>
        </div>
        <div className="mb-2">
          <span className="font-semibold">🪖 Chief of Defence Staff:</span> General Christopher Gwabin Musa
        </div>
        <div className="mb-2">
          <span className="font-semibold">🔐 Secure Portal:</span>{' '}
          <a href="https://portal.defencehq.mil.ng" className="underline hover:text-cyan-300" target="_blank" rel="noopener noreferrer">
            portal.defencehq.mil.ng
          </a>
        </div>
        <div className="text-xs text-gray-500 mb-2">
          <span className="font-semibold">Key Departments:</span> Policy & Plans (DDPP), Training & Operations (DDTOPS), Administration (DDA), 
          Communications (DDC), Logistics (DDL), Standards & Evaluation (DDSE)
        </div>
        <div className="border-t border-gray-700 my-2"></div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Defence Headquarters, Armed Forces of Nigeria. All rights reserved.
          </div>
          <div className="flex gap-4 text-xs">
            <a href="https://defencehq.mil.ng/privacy" className="hover:text-cyan-300">Privacy Policy</a>
            <a href="https://defencehq.mil.ng/terms" className="hover:text-cyan-300">Terms of Service</a>
            <a href="https://defencehq.mil.ng/accessibility" className="hover:text-cyan-300">Accessibility</a>
          </div>
        </div>
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
  const [showParagraph, setShowParagraph] = useState(false);
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const navigate = useNavigate();

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
    navigate('/report-channels');
  };

  const channelOptions = [
    {
      key: 'livestream',
      title: 'Go Live (WebRTC)',
      icon: <Video className="h-8 w-8 text-red-500" />,
      description: 'Stream live video evidence directly to security personnel using secure WebRTC livestreaming.',
      onClick: () => window.location.href = '/webrtc-go-live',
    },
    {
      key: 'form',
      title: 'Crime Report Form',
      icon: <FileText className="h-8 w-8 text-blue-500" />,
      description: 'Fill out a detailed, step-by-step form to report a crime or suspicious activity.',
      onClick: () => setActiveChannel('form'),
    },
    {
      key: 'video',
      title: 'Record & Upload Video',
      icon: <Video className="h-8 w-8 text-yellow-500" />,
      description: 'Record a video and upload it as evidence for review by security teams.',
      onClick: () => setActiveChannel('video'),
    },
    {
      key: 'voice',
      title: 'Record & Upload Voice',
      icon: <Mic className="h-8 w-8 text-green-500" />,
      description: 'Send a voice message describing the incident for a quick, secure report.',
      onClick: () => setActiveChannel('voice'),
    },
    {
      key: 'sms',
      title: 'SMS/Text Message',
      icon: <MessageSquare className="h-8 w-8 text-indigo-500" />,
      description: 'Send a text message to our secure reporting line. Include location and details of the incident.',
      onClick: () => window.open('sms:933&body=Report%20a%20crime%20or%20suspicious%20activity%20(include%20location%20and%20details)'),
    },
    {
      key: 'phone',
      title: 'Phone Call',
      icon: <Phone className="h-8 w-8 text-teal-500" />,
      description: 'Speak directly with a security officer. Available 24/7 for immediate assistance.',
      onClick: () => window.open('tel:112'),
    },
    {
      key: 'email',
      title: 'Email Report',
      icon: <Mail className="h-8 w-8 text-orange-500" />,
      description: 'Send a detailed report via encrypted email. Attach photos or documents as evidence.',
      onClick: () => window.open('mailto:report@dhq.ng?subject=Crime%20Report&body=Please%20provide%20details%20of%20the%20incident%20including%20date,%20time,%20location,%20and%20description.'),
    },
    {
      key: 'physical',
      title: 'Physical Outlets',
      icon: <MapPin className="h-8 w-8 text-amber-500" />,
      description: 'Visit any military barracks, police station, or designated reporting center near you.',
      onClick: () => {
        // Show a modal or redirect to a page with locations
        alert('Please visit the nearest military or security facility to file a report in person.');
      },
    },
    {
      key: 'anonymous',
      title: 'Anonymous Reporting',
      icon: <Shield className="h-8 w-8 text-purple-500" />,
      description: 'Report a crime without revealing your identity. Your privacy is guaranteed.',
      onClick: () => setActiveChannel('anonymous'),
    },
  ];

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

  if (activeChannel === 'form' || activeChannel === 'anonymous') {
    return <ProgressReportForm onSuccess={handleReportSuccess} />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />
      <Marquee text={SCROLLING_TEXT} />
      
      {/* Hero Section - only reporting, no hotline */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Fading Hero Image Carousel */}
        <HeroImageCarousel />
        <div className="container mx-auto px-4 py-20 relative z-10 flex flex-col items-center justify-center">
          <AnimatedHeroHeadline />
          <p className={`text-lg md:text-xl text-green-100 mb-8 max-w-3xl mx-auto text-center leading-relaxed transition-opacity transition-transform duration-1000 ${showParagraph ? 'opacity-100 translate-y-0 animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            Use this secure portal to submit crime or security reports directly to Defence Headquarters. You can be completely anonymous, or share your details for follow-up. Every credible report helps protect lives and strengthen national security. Fill out the easy form and your tip will be sent instantly for review and action.
          </p>
          <div className="flex justify-center">
            <Button 
              onClick={handleStartReport}
              className="bg-green-700 hover:bg-green-800 text-white px-12 py-4 text-lg font-bold rounded-xl transition-all hover:scale-105 transform"
              size="lg"
            >
              <FileText className="h-5 w-5 mr-2" />
              Start Crime Report
            </Button>
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100/10 backdrop-blur-sm flex items-center justify-center text-white mb-1">
                  <Clock className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold text-white">24/7</span>
                <span className="text-gray-200 text-sm">Monitoring</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-100/10 backdrop-blur-sm flex items-center justify-center text-white mb-1">
                  <Shield className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold text-white">100%</span>
                <span className="text-gray-200 text-sm">Confidential</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-purple-100/10 backdrop-blur-sm flex items-center justify-center text-white mb-1">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold text-white">Rapid</span>
                <span className="text-gray-200 text-sm">Response</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* DHQ Commitment Section */}
      <div className="relative py-20 bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/3 flex justify-center">
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 transform hover:scale-105 transition-transform duration-300">
                  <img 
                    src="/lovable-uploads/170657b3-653f-4cd6-bbfe-c51ee743b13a.png" 
                    alt="Defence Headquarters Nigeria" 
                    className="h-48 w-auto mx-auto object-contain"
                  />
                </div>
              </div>
              <div className="md:w-2/3">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Our Unwavering Commitment to Your Safety
                  </span>
                </h2>
                <div className="prose prose-lg text-gray-700 space-y-4">
                  <p className="text-lg">
                    The Nigerian Armed Forces stand resolute in our mission to protect every citizen and secure our great nation. Every report you submit becomes a vital piece in our collective fight against insecurity.
                  </p>
                  <p className="text-lg font-medium">
                    <span className="text-red-600">Your courage in speaking up could save lives.</span> Behind every report is a team of dedicated professionals working around the clock to investigate, respond, and bring perpetrators to justice.
                  </p>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                    <p className="text-yellow-800 italic">
                      "We understand the risks you take in coming forward. That's why we've made this process secure, confidential, and accessible. Your voice matters, and we are listening."
                    </p>
                  </div>
                  <p className="text-lg">
                    Together, we are building a safer Nigeria. Your report today could be the key to preventing tomorrow's tragedy. The Defence Headquarters thanks you for your partnership in this critical mission.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Report Section */}
      <div className="bg-gray-50 py-12" id="why-report">
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

      {/* Security Animation Section */}
      <section className="py-12 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-6xl mx-auto">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Together, We Can Make Nigeria Safer
                </span>
              </h2>
              <div className="prose prose-lg text-gray-700 space-y-4">
                <p>
                  Every report you submit creates ripples of safety across our nation. Our advanced security network works around the clock to analyze and act on your tips, connecting dots that help prevent crimes before they happen.
                </p>
                <p className="font-medium text-green-700">
                  Your vigilance is the first line of defense in our collective security.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Real-time monitoring of all reports</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Secure and confidential handling</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Rapid response to critical threats</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center items-center">
              <div className="w-full max-w-xs">
                <SecurityShieldAnimation />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reporting Channels Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Reporting Method
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the most convenient and secure way to submit your report
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {channelOptions.map((opt, idx) => (
              <div
                key={opt.key}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                onClick={opt.onClick}
                onKeyPress={(e) => { if (e.key === 'Enter') opt.onClick(); }}
                tabIndex={0}
                role="button"
                aria-label={`Select ${opt.title}`}
              >
                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  <span className="text-blue-600 group-hover:scale-110 transition-transform">
                    {opt.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {opt.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {opt.description}
                </p>
                <div className="flex items-center text-blue-600 font-medium">
                  Select channel
                  <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Initiatives Section */}
      <SecurityInitiativesSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* FAQ Section */}
      <FAQSection />
      
      {/* Emergency Alert */}
      <div className="bg-yellow-50 border-t-2 border-yellow-300 py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-yellow-800 text-lg mb-1">Emergency? Call 112 or 199 Immediately</h4>
              <p className="text-yellow-700">
                If you are in immediate danger or witness a serious crime in progress, call emergency services right away. This web portal is for non-urgent tips and investigations.
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
