
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Camera, Upload, Video, AlertTriangle, FileText, Info, Play, Eye, Trash2 } from "lucide-react";
import MediaUploadSection from "../MediaUploadSection";
import LiveWitnessRecorder from "../LiveWitnessRecorder";

interface EvidenceUploadStepProps {
  data: {
    images: File[];
    videos: File[];
    liveWitnessVideos?: Blob[];
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
  const [liveWitnessVideos, setLiveWitnessVideos] = useState<Blob[]>(data.liveWitnessVideos || []);

  const handleWitnessVideoComplete = (videoBlob: Blob) => {
    const updatedVideos = [...liveWitnessVideos, videoBlob];
    setLiveWitnessVideos(updatedVideos);
    onDataChange('liveWitnessVideos', updatedVideos);
    setShowLiveWitness(false);
  };

  const handleDeleteWitnessVideo = (index: number) => {
    const updatedVideos = liveWitnessVideos.filter((_, i) => i !== index);
    setLiveWitnessVideos(updatedVideos);
    onDataChange('liveWitnessVideos', updatedVideos);
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
        <Card className="border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
            <CardTitle className="flex items-center space-x-3 text-purple-800">
              <Video className="h-6 w-6" />
              <span className="text-xl">Live Witness Recording</span>
              <Badge className="bg-purple-100 text-purple-700 text-xs">Special Evidence</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-purple-700 leading-relaxed">
                  Record live video testimony from yourself or witnesses. These recordings are specially tagged 
                  as "Live Witness" evidence and carry additional weight in investigations.
                </p>
                
                {!showLiveWitness && (
                  <div className="space-y-4">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h5 className="font-semibold text-purple-800 mb-2">Live Witness Recording Guidelines:</h5>
                      <ul className="text-sm text-purple-700 space-y-1 text-left">
                        <li>• Describe what you witnessed in chronological order</li>
                        <li>• Mention specific times, locations, and people involved</li>
                        <li>• Include any important details you remember</li>
                        <li>• Speak clearly and at a comfortable pace</li>
                        <li>• These recordings are tagged as "Live Witness" evidence</li>
                      </ul>
                    </div>
                    
                    <Button 
                      onClick={() => setShowLiveWitness(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
                    >
                      <Video className="mr-3 h-5 w-5" />
                      Start Live Witness Recording
                    </Button>
                  </div>
                )}

                {showLiveWitness && (
                  <div className="border-2 border-purple-200 rounded-lg p-4">
                    <LiveWitnessRecorder 
                      onRecordingComplete={handleWitnessVideoComplete}
                      onCancel={() => setShowLiveWitness(false)}
                    />
                  </div>
                )}
              </div>

              {/* Live Witness Videos Display */}
              {liveWitnessVideos.length > 0 && (
                <div className="space-y-4">
                  <h5 className="text-purple-800 font-semibold flex items-center">
                    <Video className="h-4 w-4 mr-2" />
                    Recorded Live Witness Videos ({liveWitnessVideos.length})
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {liveWitnessVideos.map((video, index) => (
                      <Card key={index} className="border-purple-200 bg-purple-50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-purple-600 text-white animate-pulse">
                                Live Witness #{index + 1}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteWitnessVideo(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <video 
                            src={URL.createObjectURL(video)}
                            className="w-full h-32 bg-gray-900 rounded object-cover"
                            controls
                          />
                          <p className="text-sm text-purple-700 mt-2">
                            Recorded: {new Date().toLocaleString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={() => setShowLiveWitness(true)}
                    variant="outline"
                    className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Record Additional Witness Video
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upload Summary */}
        {(data.images.length > 0 || data.videos.length > 0 || liveWitnessVideos.length > 0) && (
          <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
            <CardContent className="p-6">
              <h4 className="font-bold text-green-800 mb-4 text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Evidence Summary
              </h4>
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-2xl font-bold text-green-600">{data.images.length}</div>
                  <div className="text-sm text-green-700">Photos</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-2xl font-bold text-blue-600">{data.videos.length}</div>
                  <div className="text-sm text-blue-700">Videos</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">{liveWitnessVideos.length}</div>
                  <div className="text-sm text-purple-700">Live Witness</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl font-bold text-gray-600">
                    {data.images.length + data.videos.length + liveWitnessVideos.length}
                  </div>
                  <div className="text-sm text-gray-700">Total Files</div>
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
