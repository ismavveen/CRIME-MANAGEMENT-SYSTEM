
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Camera, Upload, Video, AlertTriangle, FileText, Info } from "lucide-react";
import MediaUploadSection from "../MediaUploadSection";
import LiveWitnessRecorder from "../LiveWitnessRecorder";

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
  const [showLiveWitness, setShowLiveWitness] = useState(false);
  const [hasWitnessVideo, setHasWitnessVideo] = useState(false);

  const handleWitnessVideoComplete = (videoBlob: Blob) => {
    setHasWitnessVideo(true);
    setShowLiveWitness(false);
    console.log('Witness video recorded:', videoBlob);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-lg">
          <Camera className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-green-800">Evidence & Media Upload</h2>
        <p className="text-lg text-green-600 max-w-3xl mx-auto leading-relaxed">
          Upload any evidence that supports your report. Photos, videos, and live witness recordings 
          can significantly strengthen your report and help in the investigation process.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Enhanced Guidelines */}
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-amber-100 rounded-full p-2">
                <Info className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-amber-800 mb-3 text-lg">Evidence Guidelines & Tips</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-amber-700 mb-2">📷 Photos & Videos</h5>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Clear images of the scene, people, or objects</li>
                      <li>• Multiple angles for better documentation</li>
                      <li>• Videos showing incident or aftermath</li>
                      <li>• Maximum 100MB per file</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-amber-700 mb-2">🎥 Live Witness Recording</h5>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Optional video testimony from witnesses</li>
                      <li>• Record yourself or others describing events</li>
                      <li>• Ensure good lighting and clear audio</li>
                      <li>• Can be anonymous (face not required)</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-amber-100 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Privacy Note:</strong> All uploads are encrypted and securely stored. 
                    Remove any personal identifying information unless it's directly relevant to the report.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Upload Section */}
        <Card className="border-green-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="flex items-center space-x-3 text-green-800">
              <Upload className="h-6 w-6" />
              <span className="text-xl">Upload Photos & Videos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <MediaUploadSection
              images={data.images}
              videos={data.videos}
              onImagesChange={(images) => onDataChange('images', images)}
              onVideosChange={(videos) => onDataChange('videos', videos)}
              uploading={uploading}
            />
          </CardContent>
        </Card>

        {/* Live Witness Recording Section */}
        <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center space-x-3 text-blue-800">
              <Video className="h-6 w-6" />
              <span className="text-xl">Live Witness Recording (Optional)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <p className="text-blue-700 leading-relaxed">
                Record a video testimony from yourself or witnesses. This is completely optional but can provide 
                valuable firsthand accounts of the incident.
              </p>
              
              {!showLiveWitness && !hasWitnessVideo && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="font-semibold text-blue-800 mb-2">What to include in your witness recording:</h5>
                    <ul className="text-sm text-blue-700 space-y-1 text-left">
                      <li>• Describe what you witnessed in detail</li>
                      <li>• Mention the time and location of the incident</li>
                      <li>• Include any important details you remember</li>
                      <li>• Speak clearly and at a comfortable pace</li>
                    </ul>
                  </div>
                  
                  <Button 
                    onClick={() => setShowLiveWitness(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                  >
                    <Video className="mr-3 h-5 w-5" />
                    Start Live Witness Recording
                  </Button>
                  
                  <p className="text-sm text-blue-600">
                    You can skip this step if you don't want to record a video testimony
                  </p>
                </div>
              )}

              {showLiveWitness && (
                <div className="border-2 border-blue-200 rounded-lg p-4">
                  <LiveWitnessRecorder 
                    onRecordingComplete={handleWitnessVideoComplete}
                    onCancel={() => setShowLiveWitness(false)}
                  />
                </div>
              )}

              {hasWitnessVideo && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2 text-green-700">
                    <Video className="h-5 w-5" />
                    <span className="font-semibold">Witness video recorded successfully!</span>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowLiveWitness(true);
                      setHasWitnessVideo(false);
                    }}
                    className="mt-3 border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    Record New Video
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upload Summary */}
        {(data.images.length > 0 || data.videos.length > 0 || hasWitnessVideo) && (
          <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
            <CardContent className="p-6">
              <h4 className="font-bold text-green-800 mb-4 text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Evidence Summary
              </h4>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-2xl font-bold text-green-600">{data.images.length}</div>
                  <div className="text-sm text-green-700">Photos uploaded</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-2xl font-bold text-blue-600">{data.videos.length}</div>
                  <div className="text-sm text-blue-700">Videos uploaded</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-2xl font-bold text-purple-600">{hasWitnessVideo ? 1 : 0}</div>
                  <div className="text-sm text-purple-700">Witness recordings</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-between items-center max-w-4xl mx-auto pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex items-center space-x-2 border-green-300 text-green-700 hover:bg-green-50 px-8 py-3"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Crime Details</span>
        </Button>

        <Button 
          onClick={onNext}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2 px-8 py-3 text-lg font-semibold"
        >
          <span>Review & Submit Report</span>
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default EvidenceUploadStep;
