
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, FileText, Mic } from "lucide-react";
import VoiceRecorder from '../VoiceRecorder';
import { FormData } from '../InteractiveReportForm';

interface VoiceReportStepProps {
  onNext: () => void;
  onBack: () => void;
  onUpdate: (data: Partial<FormData>) => void;
  data: FormData;
}

const VoiceReportStep: React.FC<VoiceReportStepProps> = ({ onNext, onBack, onUpdate, data }) => {
  const [hasVoiceRecording, setHasVoiceRecording] = useState(false);
  const [voiceRecordingBlob, setVoiceRecordingBlob] = useState<Blob | null>(null);
  const [reportingMethod, setReportingMethod] = useState<'text' | 'voice'>('text');

  const handleVoiceRecordingComplete = (audioBlob: Blob, duration: number) => {
    setVoiceRecordingBlob(audioBlob);
    setHasVoiceRecording(true);
    
    // Update form data with voice recording info
    onUpdate({
      hasEvidence: true,
      evidenceDescription: `Voice recording - Duration: ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`
    });
  };

  const handleNext = () => {
    if (reportingMethod === 'voice' && !hasVoiceRecording) {
      alert('Please complete your voice recording before proceeding.');
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-green-800 mb-4">Report Method</h2>
        <p className="text-green-600 text-lg">
          Choose how you'd like to submit your crime report
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card 
          className={`cursor-pointer transition-all duration-200 ${
            reportingMethod === 'text' 
              ? 'border-green-500 bg-green-50' 
              : 'border-green-200 hover:border-green-300'
          }`}
          onClick={() => setReportingMethod('text')}
        >
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-green-800 mb-2">Text Report</h3>
            <p className="text-green-600 text-sm">
              Fill out detailed forms with text descriptions and upload files
            </p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all duration-200 ${
            reportingMethod === 'voice' 
              ? 'border-green-500 bg-green-50' 
              : 'border-green-200 hover:border-green-300'
          }`}
          onClick={() => setReportingMethod('voice')}
        >
          <CardContent className="p-6 text-center">
            <Mic className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-green-800 mb-2">Voice Report</h3>
            <p className="text-green-600 text-sm">
              Record your report using voice - ideal for detailed narratives
            </p>
          </CardContent>
        </Card>
      </div>

      {reportingMethod === 'voice' && (
        <div className="mb-8">
          <VoiceRecorder 
            onRecordingComplete={handleVoiceRecordingComplete}
            className="max-w-md mx-auto"
          />
          
          {hasVoiceRecording && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 text-center">
                ✓ Voice recording completed successfully
              </p>
            </div>
          )}
        </div>
      )}

      {reportingMethod === 'text' && (
        <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
          <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-blue-800">
            You'll continue with the standard text-based reporting form
          </p>
        </div>
      )}

      <div className="flex justify-between pt-6">
        <Button 
          onClick={onBack} 
          variant="outline" 
          className="border-green-600 text-green-600 hover:bg-green-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button 
          onClick={handleNext}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default VoiceReportStep;
