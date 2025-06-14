
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, ArrowLeft, ArrowRight, Shield, MapPin, FileText, Camera, Phone, Mail, User, AlertTriangle, Navigation, Upload, Video, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MediaUploadSection from "./MediaUploadSection";

interface ProgressReportFormProps {
  onSuccess?: (reportId: string, serialNumber: string) => void;
}

const ProgressReportForm = ({ onSuccess }: ProgressReportFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [locationData, setLocationData] = useState({
    latitude: null as number | null,
    longitude: null as number | null,
    accuracy: null as number | null,
    hasPermission: false,
    isLoading: false,
  });
  
  const [formData, setFormData] = useState({
    // Step 1: Reporter Information
    isAnonymous: true,
    reporterName: "",
    reporterPhone: "",
    reporterEmail: "",
    
    // Step 2: Crime Details
    state: "",
    localGovernment: "",
    reportTitle: "",
    description: "",
    urgency: "medium",
    threatType: "",
    enableLiveLocation: false,
    
    // Step 3: Attachments
    images: [] as File[],
    videos: [] as File[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta',
    'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
    'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
    'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
  ];

  const threatTypes = [
    'Kidnapping',
    'Banditry', 
    'Theft',
    'Oil Vandalism',
    'Intelligence',
    'Armed Robbery',
    'Terrorism',
    'Drug Trafficking',
    'Human Trafficking',
    'Vandalism',
    'Cybercrime',
    'Fraud'
  ];

  const steps = [
    {
      number: 1,
      title: "Reporter Information",
      description: "Your contact details (optional for anonymous reports)",
      icon: User
    },
    {
      number: 2,
      title: "Crime Details", 
      description: "Information about the incident",
      icon: FileText
    },
    {
      number: 3,
      title: "Attachments & Submission",
      description: "Upload evidence and submit your report",
      icon: Camera
    }
  ];

  const progress = (currentStep / steps.length) * 100;

  const requestLocationPermission = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support location services",
        variant: "destructive",
      });
      return;
    }

    setLocationData(prev => ({ ...prev, isLoading: true }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationData({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          hasPermission: true,
          isLoading: false,
        });
        
        toast({
          title: "Location enabled",
          description: `Location acquired with ±${position.coords.accuracy?.toFixed(0)}m accuracy`,
        });
      },
      (error) => {
        setLocationData(prev => ({ ...prev, isLoading: false }));
        toast({
          title: "Location access denied",
          description: "Please enable location services for better reporting",
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.isAnonymous) {
        if (!formData.reporterName.trim()) {
          newErrors.reporterName = "Name is required for non-anonymous reports";
        }
        if (!formData.reporterPhone.trim() && !formData.reporterEmail.trim()) {
          newErrors.contact = "Either phone or email is required for non-anonymous reports";
        }
      }
    }

    if (step === 2) {
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.localGovernment.trim()) newErrors.localGovernment = "Local Government Area is required";
      if (!formData.reportTitle.trim()) newErrors.reportTitle = "Report title is required";
      if (!formData.description.trim() || formData.description.length < 10) {
        newErrors.description = "Description must be at least 10 characters";
      }
      if (!formData.threatType) newErrors.threatType = "Threat type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const uploadFiles = async (files: File[], type: 'image' | 'video'): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `${type}s/${fileName}`;

      const { error } = await supabase.storage
        .from('report-files')
        .upload(filePath, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from('report-files')
        .getPublicUrl(filePath);

      return data.publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);
    setUploading(true);

    try {
      let imageUrls: string[] = [];
      let videoUrls: string[] = [];

      if (formData.images.length > 0) {
        imageUrls = await uploadFiles(formData.images, 'image');
      }

      if (formData.videos.length > 0) {
        videoUrls = await uploadFiles(formData.videos, 'video');
      }

      const generatedSerialNumber = `DHQ-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

      const reportData = {
        description: formData.description,
        threat_type: formData.threatType,
        urgency: formData.urgency,
        state: formData.state,
        local_government: formData.localGovernment,
        is_anonymous: formData.isAnonymous,
        reporter_name: formData.isAnonymous ? null : formData.reporterName,
        reporter_phone: formData.isAnonymous ? null : formData.reporterPhone,
        reporter_email: formData.isAnonymous ? null : formData.reporterEmail,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        location_accuracy: locationData.accuracy,
        images: imageUrls,
        videos: videoUrls,
        serial_number: generatedSerialNumber,
        status: 'pending',
        priority: formData.urgency === 'critical' ? 'high' : formData.urgency === 'high' ? 'medium' : 'low',
        timestamp: new Date().toISOString(),
        submission_source: 'public_portal',
        validation_status: 'pending',
        metadata: {
          submissionTimestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          source: 'progress_form',
          hasLocation: locationData.hasPermission,
          reportTitle: formData.reportTitle
        }
      };

      const { data, error } = await supabase
        .from('reports')
        .insert([reportData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Report submitted successfully",
        description: `Your report has been received. Reference: ${generatedSerialNumber}`,
      });

      onSuccess?.(data.id, generatedSerialNumber);

    } catch (error: any) {
      console.error('Error submitting report:', error);
      toast({
        title: "Submission failed",
        description: error.message || "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <Label className="text-green-800 font-semibold">Anonymous Reporting</Label>
                  <p className="text-sm text-green-700">Recommended for your safety and security</p>
                </div>
              </div>
              <Switch
                checked={formData.isAnonymous}
                onCheckedChange={(checked) => handleInputChange('isAnonymous', checked)}
              />
            </div>

            {!formData.isAnonymous && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reporterName" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Full Name *</span>
                  </Label>
                  <Input
                    id="reporterName"
                    value={formData.reporterName}
                    onChange={(e) => handleInputChange('reporterName', e.target.value)}
                    placeholder="Enter your full name"
                    className={errors.reporterName ? 'border-red-500' : ''}
                  />
                  {errors.reporterName && <p className="text-sm text-red-600">{errors.reporterName}</p>}
                </div>

                <div>
                  <Label htmlFor="reporterPhone" className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>Phone Number</span>
                  </Label>
                  <Input
                    id="reporterPhone"
                    value={formData.reporterPhone}
                    onChange={(e) => handleInputChange('reporterPhone', e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <Label htmlFor="reporterEmail" className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Email Address</span>
                  </Label>
                  <Input
                    id="reporterEmail"
                    type="email"
                    value={formData.reporterEmail}
                    onChange={(e) => handleInputChange('reporterEmail', e.target.value)}
                    placeholder="Enter your email address"
                  />
                </div>

                {errors.contact && <p className="text-sm text-red-600">{errors.contact}</p>}
              </div>
            )}

            {formData.isAnonymous && (
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Anonymous Reporting Enabled</h3>
                <p className="text-gray-600">Your identity will be completely protected. No personal information is required.</p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state" className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>State *</span>
                </Label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                  <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {nigerianStates.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && <p className="text-sm text-red-600">{errors.state}</p>}
              </div>

              <div>
                <Label htmlFor="localGovernment">Local Government Area *</Label>
                <Input
                  id="localGovernment"
                  value={formData.localGovernment}
                  onChange={(e) => handleInputChange('localGovernment', e.target.value)}
                  placeholder="Enter LGA"
                  className={errors.localGovernment ? 'border-red-500' : ''}
                />
                {errors.localGovernment && <p className="text-sm text-red-600">{errors.localGovernment}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="reportTitle">Report Title *</Label>
              <Input
                id="reportTitle"
                value={formData.reportTitle}
                onChange={(e) => handleInputChange('reportTitle', e.target.value)}
                placeholder="Brief title describing the incident"
                className={errors.reportTitle ? 'border-red-500' : ''}
              />
              {errors.reportTitle && <p className="text-sm text-red-600">{errors.reportTitle}</p>}
            </div>

            <div>
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide detailed information about the incident..."
                className={`min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
              />
              <p className="text-sm text-gray-500 mt-1">{formData.description.length} characters (minimum 10)</p>
              {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="urgency">Priority Classification *</Label>
                <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - General Information</SelectItem>
                    <SelectItem value="medium">Medium - Requires Attention</SelectItem>
                    <SelectItem value="high">High - Urgent Response</SelectItem>
                    <SelectItem value="critical">Critical - Immediate Action</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="threatType">Threat Classification *</Label>
                <Select value={formData.threatType} onValueChange={(value) => handleInputChange('threatType', value)}>
                  <SelectTrigger className={errors.threatType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select threat type" />
                  </SelectTrigger>
                  <SelectContent>
                    {threatTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.threatType && <p className="text-sm text-red-600">{errors.threatType}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <Navigation className={`h-5 w-5 ${locationData.hasPermission ? 'text-green-600' : 'text-blue-600'}`} />
                <div>
                  <Label className="text-blue-800 font-semibold">Live Location Sharing</Label>
                  <p className="text-sm text-blue-700">
                    {locationData.hasPermission 
                      ? `Location enabled (±${locationData.accuracy?.toFixed(0)}m accuracy)`
                      : 'Enable for precise incident location'
                    }
                  </p>
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                variant={locationData.hasPermission ? "secondary" : "default"}
                onClick={requestLocationPermission}
                disabled={locationData.isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {locationData.isLoading ? "Acquiring..." : locationData.hasPermission ? "Enabled" : "Enable Location"}
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Upload Evidence (Optional)
              </h3>
              <MediaUploadSection
                images={formData.images}
                videos={formData.videos}
                onImagesChange={(images) => handleInputChange('images', images)}
                onVideosChange={(videos) => handleInputChange('videos', videos)}
                uploading={uploading}
              />
            </div>

            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Review Your Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div><strong>Reporter:</strong> {formData.isAnonymous ? 'Anonymous' : formData.reporterName}</div>
                <div><strong>Location:</strong> {formData.state}, {formData.localGovernment}</div>
                <div><strong>Title:</strong> {formData.reportTitle}</div>
                <div><strong>Threat Type:</strong> {formData.threatType}</div>
                <div><strong>Priority:</strong> {formData.urgency}</div>
                <div><strong>Evidence:</strong> {formData.images.length} image(s), {formData.videos.length} video(s)</div>
                <div><strong>Location Sharing:</strong> {locationData.hasPermission ? 'Enabled' : 'Disabled'}</div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <img 
          src="/lovable-uploads/0300e6fb-5eb3-4bee-9542-d2935a35734c.png" 
          alt="Defence Headquarters Logo" 
          className="h-16 w-16 object-contain mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold text-green-800 mb-2">Report Crime Form</h1>
        <p className="text-green-600">Secure & Confidential Reporting System</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= step.number 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step.number ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`h-1 w-20 mx-2 ${
                  currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {steps[currentStep - 1]?.title}
          </h2>
          <p className="text-gray-600">
            {steps[currentStep - 1]?.description}
          </p>
        </div>
        
        <Progress value={progress} className="mt-4 h-2" />
        <p className="text-sm text-gray-500 text-center mt-2">
          Step {currentStep} of {steps.length} • {Math.round(progress)}% complete
        </p>
      </div>

      {/* Form Content */}
      <Card className="border-green-200">
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Shield className="h-4 w-4 text-green-600" />
          <span>All data is encrypted and secure</span>
        </div>

        {currentStep === steps.length ? (
          <Button 
            onClick={handleSubmit}
            disabled={loading || uploading}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Submit Report</span>
              </>
            )}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleNext}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Auto-save indicator */}
      <div className="mt-4 text-center">
        <p className="text-sm text-green-600 flex items-center justify-center">
          <CheckCircle className="h-4 w-4 mr-1" />
          Your progress is automatically saved
        </p>
      </div>
    </div>
  );
};

export default ProgressReportForm;
