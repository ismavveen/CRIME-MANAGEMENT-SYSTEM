
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Send, FileText, MapPin, User, AlertTriangle, Calendar, Phone, Mail, Image, Video, CheckCircle, Loader2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ReviewSubmissionStepProps {
  data: {
    isAnonymous: boolean;
    reporterName: string;
    reporterPhone: string;
    reporterEmail: string;
    state: string;
    localGovernment: string;
    reportTitle: string;
    description: string;
    urgency: string;
    threatType: string;
    images: File[];
    videos: File[];
    liveWitnessVideos?: Blob[];
  };
  locationData: {
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    hasPermission: boolean;
  };
  onBack: () => void;
  onSuccess: (reportId: string, serialNumber: string) => void;
}

const ReviewSubmissionStep = ({ data, locationData, onBack, onSuccess }: ReviewSubmissionStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      console.log('Starting report submission...');
      
      // Prepare form data for submission
      const reportData = {
        description: data.description,
        threatType: data.threatType,
        urgency: data.urgency,
        state: data.state,
        localGovernment: data.localGovernment,
        location: `${data.state}, ${data.localGovernment}`,
        isAnonymous: data.isAnonymous,
        reporterName: data.isAnonymous ? null : data.reporterName,
        reporterPhone: data.isAnonymous ? null : data.reporterPhone,
        reporterEmail: data.isAnonymous ? null : data.reporterEmail,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        locationAccuracy: locationData.accuracy
      };

      // Prepare files for upload including live witness videos
      const files: any[] = [];
      
      // Convert File objects to uploadable format
      for (const image of data.images) {
        const arrayBuffer = await image.arrayBuffer();
        files.push({
          name: image.name,
          type: image.type,
          data: Array.from(new Uint8Array(arrayBuffer))
        });
      }
      
      for (const video of data.videos) {
        const arrayBuffer = await video.arrayBuffer();
        files.push({
          name: video.name,
          type: video.type,
          data: Array.from(new Uint8Array(arrayBuffer))
        });
      }

      // Add live witness videos
      if (data.liveWitnessVideos && data.liveWitnessVideos.length > 0) {
        for (let i = 0; i < data.liveWitnessVideos.length; i++) {
          const blob = data.liveWitnessVideos[i];
          const arrayBuffer = await blob.arrayBuffer();
          files.push({
            name: `live-witness-${i + 1}-${Date.now()}.webm`,
            type: 'video/webm',
            data: Array.from(new Uint8Array(arrayBuffer))
          });
        }
      }

      console.log('Submitting to secure backend edge function:', { reportData, fileCount: files.length });

      // Submit to backend which generates secure reference number
      const { data: result, error } = await supabase.functions.invoke('submit-report', {
        body: { reportData, files },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to submit report');
      }

      if (!result || !result.success) {
        console.error('Submission result error:', result);
        throw new Error(result?.error || 'Failed to submit report');
      }
      
      // Ensure we have the backend-generated reference number
      if (!result.serialNumber || !result.reportId) {
        throw new Error('Invalid response from server - missing reference number');
      }
      
      toast({
        title: "Report Submitted Successfully!",
        description: `Your secure reference number is: ${result.serialNumber}`,
      });
      
      // Pass the backend-generated reference number to success handler
      onSuccess(result.reportId, result.serialNumber);
    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const urgencyColors = {
    low: "text-green-600 bg-green-50 border-green-200",
    medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
    high: "text-orange-600 bg-orange-50 border-orange-200",
    critical: "text-red-600 bg-red-50 border-red-200"
  };

  const totalFiles = data.images.length + data.videos.length + (data.liveWitnessVideos?.length || 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-lg">
          <FileText className="h-10 w-10 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-blue-800">Review Your Report</h2>
        <p className="text-lg text-blue-600 max-w-3xl mx-auto leading-relaxed">
          Please review all the information below before submitting your report. 
          Once submitted, your report will be processed immediately by our security teams.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Reporter Information */}
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="flex items-center space-x-3 text-green-800">
              <User className="h-6 w-6" />
              <span>Reporter Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-700">Reporting Type</label>
                <div className={`mt-1 p-3 rounded-lg border ${data.isAnonymous ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
                  <span className={`font-semibold ${data.isAnonymous ? 'text-blue-700' : 'text-green-700'}`}>
                    {data.isAnonymous ? '🔒 Anonymous Report' : '👤 Identified Report'}
                  </span>
                </div>
              </div>
              
              {!data.isAnonymous && (
                <>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Full Name</label>
                    <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <span className="text-gray-800">{data.reporterName || 'Not provided'}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                    <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center">
                      <Phone className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-800">{data.reporterPhone || 'Not provided'}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Email Address</label>
                    <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center">
                      <Mail className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-800">{data.reporterEmail || 'Not provided'}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Crime Details */}
        <Card className="border-orange-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
            <CardTitle className="flex items-center space-x-3 text-orange-800">
              <AlertTriangle className="h-6 w-6" />
              <span>Crime Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-700">State</label>
                <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="text-gray-800">{data.state}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700">Local Government</label>
                <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="text-gray-800">{data.localGovernment}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700">Threat Type</label>
                <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="text-gray-800">{data.threatType}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700">Urgency Level</label>
                <div className={`mt-1 p-3 rounded-lg border ${urgencyColors[data.urgency as keyof typeof urgencyColors]}`}>
                  <span className="font-semibold capitalize">{data.urgency}</span>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">Description</label>
                <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="text-gray-800">{data.description}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evidence Summary */}
        {totalFiles > 0 && (
          <Card className="border-purple-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
              <CardTitle className="flex items-center space-x-3 text-purple-800">
                <FileText className="h-6 w-6" />
                <span>Evidence Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-2xl font-bold text-green-600">{data.images.length}</div>
                  <div className="text-sm text-green-700 flex items-center justify-center">
                    <Image className="h-4 w-4 mr-1" />
                    Photos
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">{data.videos.length}</div>
                  <div className="text-sm text-blue-700 flex items-center justify-center">
                    <Video className="h-4 w-4 mr-1" />
                    Videos
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">{data.liveWitnessVideos?.length || 0}</div>
                  <div className="text-sm text-purple-700 flex items-center justify-center">
                    <Video className="h-4 w-4 mr-1" />
                    Live Witness
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl font-bold text-gray-600">{totalFiles}</div>
                  <div className="text-sm text-gray-700">Total Files</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location Information */}
        {locationData.hasPermission && (
          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className="flex items-center space-x-3 text-blue-800">
                <MapPin className="h-6 w-6" />
                <span>Location Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Coordinates</label>
                  <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="text-gray-800">
                      {locationData.latitude?.toFixed(6)}, {locationData.longitude?.toFixed(6)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Accuracy</label>
                  <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="text-gray-800">±{locationData.accuracy?.toFixed(0)}m</span>
                  </div>
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
          disabled={isSubmitting}
          className="flex items-center space-x-2 border-green-300 text-green-700 hover:bg-green-50 px-8 py-3"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Evidence</span>
        </Button>

        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2 px-8 py-3 text-lg font-semibold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              <span>Submit Report</span>
            </>
          )}
        </Button>
      </div>

      {/* Security Notice */}
      <div className="text-center mt-8">
        <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
          <Shield className="h-4 w-4" />
          <span>All data is encrypted and secure • Your privacy is protected</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmissionStep;
