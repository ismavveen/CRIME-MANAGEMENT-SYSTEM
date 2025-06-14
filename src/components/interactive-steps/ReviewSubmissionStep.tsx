import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Send, FileText, MapPin, User, AlertTriangle, Calendar, Phone, Mail, Image, Video, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

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
  const supabase = useSupabaseClient();

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

      // Prepare files for upload
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

      console.log('Submitting to edge function:', { reportData, fileCount: files.length });

      // Submit via edge function
      const { data: result, error } = await supabase.functions.invoke('submit-report', {
        body: { reportData, files }
      });

      if (error || !result?.success) {
        throw new Error(result?.error || error?.message || 'Failed to submit report');
      }
      
      toast({
        title: "Report Submitted Successfully!",
        description: `Your report has been submitted with ID: ${result.reportId}`,
      });
      
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
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700">State</label>
                  <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center">
                    <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-gray-800">{data.state}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-700">Local Government Area</label>
                  <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="text-gray-800">{data.localGovernment}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-700">Priority Level</label>
                  <div className={`mt-1 p-3 rounded-lg border font-semibold ${urgencyColors[data.urgency as keyof typeof urgencyColors]}`}>
                    {data.urgency.charAt(0).toUpperCase() + data.urgency.slice(1)} Priority
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-700">Threat Type</label>
                  <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="text-gray-800">{data.threatType}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700">Report Title</label>
                <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="text-gray-800 font-semibold">{data.reportTitle}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700">Detailed Description</label>
                <div className="mt-1 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{data.description}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        {locationData.hasPermission && (
          <Card className="border-purple-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
              <CardTitle className="flex items-center space-x-3 text-purple-800">
                <MapPin className="h-6 w-6" />
                <span>Location Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Latitude</label>
                  <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="text-gray-800 font-mono">{locationData.latitude?.toFixed(6)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Longitude</label>
                  <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="text-gray-800 font-mono">{locationData.longitude?.toFixed(6)}</span>
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

        {/* Evidence Summary */}
        {(data.images.length > 0 || data.videos.length > 0) && (
          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className="flex items-center space-x-3 text-blue-800">
                <Image className="h-6 w-6" />
                <span>Evidence Attached</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <Image className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">Photos</span>
                  </div>
                  <div className="text-2xl font-bold text-green-700">{data.images.length}</div>
                  <div className="text-sm text-green-600">images attached</div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <Video className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">Videos</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-700">{data.videos.length}</div>
                  <div className="text-sm text-blue-600">videos attached</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submission Timestamp */}
        <Card className="border-gray-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-3 text-gray-600">
              <Calendar className="h-5 w-5" />
              <span>Report will be submitted on: {new Date().toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center max-w-4xl mx-auto pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex items-center space-x-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Evidence</span>
        </Button>

        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white flex items-center space-x-2 px-12 py-4 text-lg font-bold shadow-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Submitting Report...</span>
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
          <CheckCircle className="h-4 w-4" />
          <span>Your report will be encrypted and processed securely by Defence Headquarters</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmissionStep;
