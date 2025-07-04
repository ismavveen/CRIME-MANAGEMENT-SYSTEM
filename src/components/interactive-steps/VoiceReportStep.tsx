
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, FileText, Mic } from "lucide-react";
import VoiceRecorder from '../VoiceRecorder';
import { FormData } from '../../types/FormData';

interface VoiceReportStepProps {
  onNext: (data: Partial<FormData>) => void;
  onBack: () => void;
  onUpdate: (data: Partial<FormData>) => void;
  data: FormData;
}

const VoiceReportStep: React.FC<VoiceReportStepProps> = ({ onNext, onBack, onUpdate, data }) => {
  const [hasVoiceRecording, setHasVoiceRecording] = useState(false);
  const [voiceRecordingBlob, setVoiceRecordingBlob] = useState<Blob | null>(null);

  const handleVoiceRecordingComplete = (audioBlob: Blob, duration: number) => {
    console.log("Voice recording completed:", { duration });
    setVoiceRecordingBlob(audioBlob);
    setHasVoiceRecording(true);
    
    // Update form data with voice recording info
    onUpdate({
      evidence: {
        ...data.evidence,
        hasEvidence: true
      }
    });
  };

  const handleNext = () => {
    console.log("VoiceReportStep - handleNext called", { reportingMethod: data.reportingMethod, hasVoiceRecording });
    
    if (data.reportingMethod === 'voice' && !hasVoiceRecording) {
      alert('Please complete your voice recording before proceeding.');
      return;
    }
    
    onNext({ reportingMethod: data.reportingMethod });
  };

  const setReportingMethod = (method: 'text' | 'voice') => {
    console.log("Setting reporting method to:", method);
    onUpdate({ reportingMethod: method });
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
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            data.reportingMethod === 'text' 
              ? 'border-green-500 bg-green-50 ring-2 ring-green-500' 
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
            {data.reportingMethod === 'text' && (
              <div className="mt-3 text-green-700 font-medium">
                ✓ Selected
              </div>
            )}
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            data.reportingMethod === 'voice' 
              ? 'border-green-500 bg-green-50 ring-2 ring-green-500' 
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
            {data.reportingMethod === 'voice' && (
              <div className="mt-3 text-green-700 font-medium">
                ✓ Selected
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {data.reportingMethod === 'voice' && (
        <div className="mb-8">
          <VoiceRecorder 
            onRecordingComplete={handleVoiceRecordingComplete}
            className="max-w-md mx-auto"
          />
          
          {hasVoiceRecording && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200 animate-fade-in">
              <p className="text-green-800 text-center font-medium">
                ✓ Voice recording completed successfully
              </p>
            </div>
          )}
        </div>
      )}

      {data.reportingMethod === 'text' && (
        <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in">
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
          className="border-green-600 text-green-600 hover:bg-green-50 transition-all duration-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button 
          onClick={handleNext}
          disabled={!data.reportingMethod}
          className={`transition-all duration-200 ${
            data.reportingMethod 
              ? 'bg-green-600 hover:bg-green-700 text-white hover:scale-105' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default VoiceReportStep;
