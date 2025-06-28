import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Video, Mic, Shield, Clock, AlertCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Marquee from '@/components/Marquee';
import ChatHelpButton from '@/components/ChatHelpButton';
import WebRTCStreamer from '../components/WebRTCStreamer';
import ProgressReportForm from '@/components/reports/ProgressReportForm';
import VoiceRecorder from '@/components/VoiceRecorder';
import LiveWitnessRecorder from '@/components/LiveWitnessRecorder';
import FAQSection from '@/components/FAQSection';
import SecurityInitiativesSection from '@/components/SecurityInitiativesSection';
import HowItWorksSection from '@/components/HowItWorksSection';

const SAFETY_MESSAGE = "Your safety is our priority. All reports are confidential and securely processed. Anonymous reporting is available to ensure your privacy. Together, we build a safer nation.";

const ReportChannels = () => {
  // Local state to control which report flow is active
  const [activeChannel, setActiveChannel] = useState<string | null>(null);

  // Channel options with local handlers
  const channelOptions = [
    {
      key: 'livestream',
      title: 'Go Live (WebRTC)',
      icon: <Video className="h-8 w-8 text-red-500" />,
      description:
        'Stream live video evidence directly to security personnel using secure WebRTC livestreaming.',
      onClick: () => window.location.href = '/webrtc-go-live',
    },
    {
      key: 'form',
      title: 'Crime Report Form',
      icon: <FileText className="h-8 w-8 text-blue-500" />,
      description:
        'Fill out a detailed, step-by-step form to report a crime or suspicious activity.',
      onClick: () => setActiveChannel('form'),
    },
    {
      key: 'video',
      title: 'Record & Upload Video',
      icon: <Video className="h-8 w-8 text-yellow-500" />,
      description:
        'Record a video and upload it as evidence for review by security teams.',
      onClick: () => setActiveChannel('video'),
    },
    {
      key: 'voice',
      title: 'Record & Upload Voice',
      icon: <Mic className="h-8 w-8 text-green-500" />,
      description:
        'Send a voice message describing the incident for a quick, secure report.',
      onClick: () => setActiveChannel('voice'),
    },
    {
      key: 'anonymous',
      title: 'Anonymous Reporting',
      icon: <Shield className="h-8 w-8 text-purple-500" />,
      description:
        'Report a crime without revealing your identity. Your privacy is guaranteed.',
      onClick: () => setActiveChannel('anonymous'),
    },
  ];

  // Render the correct flow based on activeChannel
  // You can replace these stubs with the actual flows/components

  if (activeChannel === 'livestream') {
    const [roomName, setRoomName] = useState("");
    const [started, setStarted] = useState(false);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
          <h1 className="text-2xl font-bold mb-4 text-green-900">Go Live (WebRTC)</h1>
          {!started ? (
            <form onSubmit={e => { e.preventDefault(); if (roomName.trim()) setStarted(true); }}>
              <label className="block mb-2 font-semibold text-green-800">Room Name</label>
              <input
                className="border border-green-300 rounded-lg px-4 py-2 w-full mb-4"
                value={roomName}
                onChange={e => setRoomName(e.target.value)}
                placeholder="Enter room name to stream"
                required
              />
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold w-full"
                type="submit"
              >
                Start Livestream
              </button>
            </form>
          ) : (
            <WebRTCStreamer roomName={roomName} />
          )}
        </div>
      </div>
    );
  }
  if (activeChannel === 'form' || activeChannel === 'anonymous') {
    return <ProgressReportForm />;
  }
  if (activeChannel === 'video') {
    // Render the LiveWitnessRecorder for video recording/upload
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-gray-900">
            Record & Upload Video Evidence
          </h1>
          <LiveWitnessRecorder
            onRecordingComplete={(videoBlob) => {
              // You can handle the videoBlob here, e.g., upload or pass to report flow
              // For now, show a toast or log
              console.log('Recorded video:', videoBlob);
            }}
            className="my-8"
          />
          <div className="mt-8 flex justify-center">
            <Button onClick={() => setActiveChannel(null)} variant="outline">
              Back to Channels
            </Button>
          </div>
        </div>
      </div>
    );
  }
  if (activeChannel === 'voice') {
    return <VoiceRecorder />;
  }

  return (
    <>
      <Navigation />
      <Marquee text={SAFETY_MESSAGE} />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10 -z-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Report Security Concerns
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Your voice matters. Choose the most secure and convenient way to report incidents and help us build a safer Nigeria.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-12">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
                  <Clock className="w-8 h-8" />
                </div>
                <span className="text-3xl font-bold text-gray-800">24/7</span>
                <span className="text-gray-600">Monitoring</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                  <Shield className="w-8 h-8" />
                </div>
                <span className="text-3xl font-bold text-gray-800">100%</span>
                <span className="text-gray-600">Confidential</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-2">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <span className="text-3xl font-bold text-gray-800">Rapid</span>
                <span className="text-gray-600">Response</span>
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
      
      <ChatHelpButton onClick={() => {
        const topElement = document.documentElement;
        topElement.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }} />
    </>
  );
};

export default ReportChannels;
