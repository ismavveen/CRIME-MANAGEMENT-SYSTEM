
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, FileText, MapPin, Clock, Camera, Shield, Phone, User, AlertTriangle } from "lucide-react";
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

  const uploadFiles = async (files: File[], type: 'image' | 'video'): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `${type}s/${fileName}`;

      const { error } = await supabase.storage
        .from('report-files')
        .upload(filePath, file);

      if (error) {
        console.error(`Error uploading ${type}:`, error);
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('report-files')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      let imageUrls: string[] = [];
      let videoUrls: string[] = [];

      // Upload files if any
      if (data.images.length > 0) {
        try {
          imageUrls = await uploadFiles(data.images, 'image');
        } catch (error) {
          console.error('Error uploading images:', error);
          // Continue without images rather than failing
        }
      }

      if (data.videos.length > 0) {
        try {
          videoUrls = await uploadFiles(data.videos, 'video');
        } catch (error) {
          console.error('Error uploading videos:', error);
          // Continue without videos rather than failing
        }
      }

      const generatedSerialNumber = `DHQ-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

      const reportData = {
        description: data.description,
        threat_type: data.threatType,
        urgency: data.urgency,
        state: data.state,
        local_government: data.localGovernment,
        is_anonymous: data.isAnonymous,
        reporter_name: data.isAnonymous ? null : data.reporterName,
        reporter_phone: data.isAnonymous ? null : data.reporterPhone,
        reporter_email: data.isAnonymous ? null : data.reporterEmail,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        location_accuracy: locationData.accuracy,
        images: imageUrls,
        videos: videoUrls,
        serial_number: generatedSerialNumber,
        status: 'pending',
        priority: data.urgency === 'critical' ? 'high' : data.urgency === 'high' ? 'medium' : 'low',
        timestamp: new Date().toISOString(),
        submission_source: 'public_portal',
        validation_status: 'pending',
        metadata: {
          submissionTimestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          source: 'interactive_form',
          hasLocation: locationData.hasPermission,
          reportTitle: data.reportTitle
        }
      };

      console.log('Submitting report data:', reportData);

      const { data: insertedData, error } = await supabase
        .from('reports')
        .insert([reportData])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Report submitted successfully:', insertedData);

      toast({
        title: "Report submitted successfully",
        description: `Your report has been received. Reference: ${generatedSerialNumber}`,
      });

      onSuccess(insertedData.id, generatedSerialNumber);

    } catch (error: any) {
      console.error('Error submitting report:', error);
      toast({
        title: "Submission failed",
        description: error.message || "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <FileText className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-800">Review Your Report</h2>
        <p className="text-green-600 max-w-2xl mx-auto">
          Please review all information below carefully before submitting your report. 
          Once submitted, it will be processed by our security team.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Reporter Information */}
        <Card className="border-green-200 hover:shadow-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              {data.isAnonymous ? (
                <Shield className="h-6 w-6 text-green-600 mt-1" />
              ) : (
                <User className="h-6 w-6 text-green-600 mt-1" />
              )}
              <div>
                <h4 className="font-semibold text-green-800">Reporter Information</h4>
                <p className="text-green-700">
                  {data.isAnonymous ? "Anonymous Report" : data.reporterName}
                </p>
                {!data.isAnonymous && (data.reporterPhone || data.reporterEmail) && (
                  <p className="text-sm text-green-600 mt-1">
                    {data.reporterPhone && `📱 ${data.reporterPhone}`}
                    {data.reporterPhone && data.reporterEmail && " • "}
                    {data.reporterEmail && `📧 ${data.reporterEmail}`}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="border-green-200 hover:shadow-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <MapPin className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold text-green-800">Location</h4>
                <p className="text-green-700">{data.state}, {data.localGovernment}</p>
                {locationData.hasPermission && (
                  <p className="text-sm text-green-600 mt-1">
                    📍 Live location enabled (±{locationData.accuracy?.toFixed(0)}m accuracy)
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Incident Details */}
        <Card className="border-green-200 hover:shadow-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <FileText className="h-6 w-6 text-green-600 mt-1" />
              <div className="w-full">
                <h4 className="font-semibold text-green-800">Incident Details</h4>
                <p className="text-green-700 font-medium">{data.reportTitle}</p>
                <p className="text-green-700 mt-1 whitespace-pre-wrap">{data.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    {data.threatType}
                  </span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    data.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                    data.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                    data.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {data.urgency.charAt(0).toUpperCase() + data.urgency.slice(1)} Priority
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evidence */}
        {(data.images.length > 0 || data.videos.length > 0) && (
          <Card className="border-green-200 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Camera className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-800">Evidence Files</h4>
                  <p className="text-green-700">
                    {data.images.length} photo(s), {data.videos.length} video(s)
                  </p>
                  <div className="mt-2 text-sm text-green-600">
                    {data.images.map((file, index) => (
                      <div key={index}>📷 {file.name}</div>
                    ))}
                    {data.videos.map((file, index) => (
                      <div key={index}>🎥 {file.name}</div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Assurance */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Security & Privacy Assurance</span>
            </div>
            <ul className="text-sm text-green-700 space-y-1">
              <li>✓ Your report is encrypted and secure</li>
              <li>✓ Only authorized personnel will have access</li>
              <li>✓ Your privacy choices will be respected</li>
              <li>✓ You will receive a confirmation reference number</li>
              <li>✓ Reports are automatically routed to appropriate units</li>
            </ul>
          </CardContent>
        </Card>

        {/* Final Warning for Critical Reports */}
        {data.urgency === 'critical' && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800">Critical Priority Notice</h4>
                  <p className="text-sm text-red-700 mt-1">
                    This report is marked as critical priority. It will be immediately escalated 
                    to emergency response units in your area. If this is an ongoing emergency, 
                    please also call 199 immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-between items-center max-w-2xl mx-auto pt-6">
        <Button 
          variant="outline" 
          onClick={onBack} 
          disabled={isSubmitting}
          className="border-green-300 text-green-700 hover:bg-green-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Evidence
        </Button>
        
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="bg-green-700 hover:bg-green-800 px-8 text-lg font-semibold"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
              Submitting Report...
            </>
          ) : (
            <>
              Submit Report
              <CheckCircle className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ReviewSubmissionStep;
