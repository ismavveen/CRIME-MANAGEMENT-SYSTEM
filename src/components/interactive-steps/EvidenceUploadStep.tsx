
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Camera, Upload, Video, AlertTriangle } from "lucide-react";
import MediaUploadSection from "../MediaUploadSection";
import VoiceRecorder from "../VoiceRecorder";

interface EvidenceUploadStepProps {
  data: {
    images: File[];
    videos: File[];
  };
  onDataChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
  uploading: boolean;
}

const EvidenceUploadStep = ({ 
  data, 
  onDataChange, 
  onNext, 
  onBack, 
  uploading 
}: EvidenceUploadStepProps) => {
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);

  const handleAudioRecord = (audioBlob: Blob, duration: number) => {
    setRecordedAudio(audioBlob);
    console.log(`Audio recorded: ${duration} seconds`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Camera className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-800">Evidence & Media</h2>
        <p className="text-green-600 max-w-2xl mx-auto">
          Upload any evidence that supports your report. Photos, videos, and audio recordings 
          can significantly help in the investigation process.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Guidelines */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-2">Evidence Guidelines</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Photos: Clear images of the scene, people, or objects involved</li>
                  <li>• Videos: Recordings of incidents or aftermath (max 100MB per file)</li>
                  <li>• Audio: Voice recordings, conversations, or ambient sounds</li>
                  <li>• Ensure files don't contain personal identifying information unless necessary</li>
                  <li>• All uploads are encrypted and securely stored</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Upload */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <Upload className="h-5 w-5" />
              <span>Upload Photos & Videos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MediaUploadSection
              images={data.images}
              videos={data.videos}
              onImagesChange={(images) => onDataChange('images', images)}
              onVideosChange={(videos) => onDataChange('videos', videos)}
              uploading={uploading}
            />
          </CardContent>
        </Card>

        {/* Voice Recording */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <Video className="h-5 w-5" />
              <span>Voice Recording</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <VoiceRecorder 
              onRecordingComplete={handleAudioRecord}
              className="border-0 shadow-none p-0"
            />
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Voice recordings can capture details you might forget to write. 
                Describe what you saw, heard, or experienced in your own words.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Upload Summary */}
        {(data.images.length > 0 || data.videos.length > 0 || recordedAudio) && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-green-800 mb-2">Evidence Summary</h4>
              <div className="space-y-1 text-sm text-green-700">
                <p>📷 Photos: {data.images.length} file(s)</p>
                <p>🎥 Videos: {data.videos.length} file(s)</p>
                <p>🎵 Audio: {recordedAudio ? '1 recording' : 'No recording'}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-between items-center max-w-2xl mx-auto">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex items-center space-x-2 border-green-300 text-green-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>

        <Button 
          onClick={onNext}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
        >
          <span>Review & Submit</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EvidenceUploadStep;
