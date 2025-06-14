
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import MediaUploadSection from '@/components/MediaUploadSection';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield, AlertTriangle, MapPin, User, Phone, Navigation, CheckCircle, Lock, Zap, Clock, Copy, Search, Users, FileText, Send } from 'lucide-react';
import { useReports } from '@/hooks/useReports';

const ReportCrime = () => {
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    manualLocation: '',
    urgency: 'medium',
    threatType: '',
    reporterType: 'web_app',
    isAnonymous: true,
    reporterName: '',
    reporterContact: '',
    reporterPhone: '',
    reporterEmail: '',
    state: '',
    localGovernment: '',
    fullAddress: '',
    landmark: '',
  });
  
  const [locationData, setLocationData] = useState({
    latitude: null as number | null,
    longitude: null as number | null,
    accuracy: null as number | null,
    hasPermission: false,
    isLoading: false,
    error: null as string | null,
  });
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportId, setReportId] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const { toast } = useToast();
  const { getReportBySerialNumber } = useReports();

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (!navigator.geolocation) {
      setLocationData(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser'
      }));
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
          error: null,
        });
        
        setFormData(prev => ({
          ...prev,
          location: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
        }));
      },
      (error) => {
        let errorMessage = 'Failed to get your location. ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Location access was denied. Please enable location services and refresh the page.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            break;
        }
        
        setLocationData(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.threatType || !formData.state || !formData.localGovernment) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setUploading(true);

    try {
      let imageUrls: string[] = [];
      let videoUrls: string[] = [];

      if (images.length > 0) {
        imageUrls = await uploadFiles(images, 'image');
      }

      if (videos.length > 0) {
        videoUrls = await uploadFiles(videos, 'video');
      }

      const generatedSerialNumber = `DHQ-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

      const reportData = {
        description: formData.description,
        location: formData.location || formData.manualLocation,
        manual_location: formData.manualLocation,
        urgency: formData.urgency,
        threat_type: formData.threatType,
        reporter_type: formData.reporterType,
        is_anonymous: formData.isAnonymous,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        location_accuracy: locationData.accuracy,
        timestamp: new Date().toISOString(),
        status: 'pending',
        priority: formData.urgency === 'critical' ? 'high' : formData.urgency === 'high' ? 'medium' : 'low',
        images: imageUrls,
        videos: videoUrls,
        state: formData.state,
        local_government: formData.localGovernment,
        full_address: formData.fullAddress,
        landmark: formData.landmark,
        reporter_name: formData.isAnonymous ? null : formData.reporterName,
        reporter_contact: formData.isAnonymous ? null : formData.reporterContact,
        reporter_phone: formData.isAnonymous ? null : formData.reporterPhone,
        reporter_email: formData.isAnonymous ? null : formData.reporterEmail,
        serial_number: generatedSerialNumber,
        submission_source: 'internal_portal',
        validation_status: 'pending',
        metadata: {
          submissionTimestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          source: 'internal_web_portal',
          hasLocation: !!locationData.hasPermission,
          mediaFiles: {
            images: imageUrls.length,
            videos: videoUrls.length
          }
        }
      };

      const { data, error } = await supabase
        .from('reports')
        .insert([reportData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Report submitted successfully:', data);
      setReportId(data.id);
      setSerialNumber(generatedSerialNumber);
      setShowSuccessModal(true);

      toast({
        title: "Report submitted successfully",
        description: `Your report has been received. Reference: ${generatedSerialNumber}`,
      });

      // Reset form
      setFormData({
        description: '',
        location: '',
        manualLocation: '',
        urgency: 'medium',
        threatType: '',
        reporterType: 'web_app',
        isAnonymous: true,
        reporterName: '',
        reporterContact: '',
        reporterPhone: '',
        reporterEmail: '',
        state: '',
        localGovernment: '',
        fullAddress: '',
        landmark: '',
      });
      setImages([]);
      setVideos([]);

      requestLocationPermission();

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

  const handleTrackReport = async () => {
    if (!trackingNumber.trim()) {
      toast({
        title: "Reference Number Required",
        description: "Please enter your reference number to track your report.",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = await getReportBySerialNumber(trackingNumber.trim());

      if (!data) {
        toast({
          title: "Report Not Found",
          description: "No report found with this reference number. Please check and try again.",
          variant: "destructive",
        });
        return;
      }

      setTrackingResult(data);
      setShowTrackingModal(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to track report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Reference number copied to clipboard",
    });
  };

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta',
    'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
    'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
    'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm p-3 mr-6 border border-white/20">
                <img 
                  src="/lovable-uploads/b160c848-06aa-40b9-8717-59194cc9a1a8.png" 
                  alt="Defense Headquarters Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold text-white mb-3 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  DEFENSE HEADQUARTERS
                </h1>
                <p className="text-2xl text-blue-200 mb-3 font-semibold">Crime Reporting & Intelligence Portal</p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center text-green-400 text-sm font-bold">
                    <Lock className="w-5 h-5 mr-2" />
                    <span>SECURED & ENCRYPTED</span>
                  </div>
                  <div className="flex items-center text-blue-400 text-sm font-bold">
                    <Zap className="w-5 h-5 mr-2" />
                    <span>REAL-TIME PROCESSING</span>
                  </div>
                  <div className="flex items-center text-purple-400 text-sm font-bold">
                    <Users className="w-5 h-5 mr-2" />
                    <span>24/7 MONITORING</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="font-bold text-white mb-2">Anonymous Reporting</h3>
                <p className="text-gray-300 text-sm">Submit reports safely without revealing your identity</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <AlertTriangle className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                <h3 className="font-bold text-white mb-2">Instant Response</h3>
                <p className="text-gray-300 text-sm">Immediate dispatch to relevant security units</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h3 className="font-bold text-white mb-2">Real-Time Tracking</h3>
                <p className="text-gray-300 text-sm">Track your report status with reference number</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-16">
        {/* Track Report Section */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Search className="w-6 h-6 mr-3 text-blue-400" />
            Track Your Report Status
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder-gray-300 flex-1 text-lg"
              placeholder="Enter your reference number (e.g., DHQ-2024-001234)"
            />
            <Button 
              onClick={handleTrackReport}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold"
            >
              <Search className="w-5 h-5 mr-2" />
              Track Report
            </Button>
          </div>
        </Card>

        {/* Location Status */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Navigation className={`w-6 h-6 ${locationData.hasPermission ? 'text-green-400' : 'text-red-400'}`} />
              <div>
                <h3 className="text-white font-semibold text-lg">Location Status</h3>
                <p className="text-gray-300">
                  {locationData.isLoading 
                    ? 'Acquiring your location...'
                    : locationData.hasPermission 
                      ? `Location acquired (±${locationData.accuracy?.toFixed(0)}m accuracy)`
                      : locationData.error || 'Location access required for report submission'
                  }
                </p>
              </div>
            </div>
            {!locationData.hasPermission && (
              <Button 
                onClick={requestLocationPermission}
                variant="outline"
                className="bg-orange-600/20 border-orange-500 text-orange-300 hover:bg-orange-600/30"
              >
                Enable Location
              </Button>
            )}
          </div>
          {locationData.error && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-600/50 rounded-lg">
              <p className="text-red-300">{locationData.error}</p>
            </div>
          )}
        </Card>

        {/* Main Report Form */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
          <div className="flex items-center mb-8">
            <FileText className="w-8 h-8 text-blue-400 mr-4" />
            <h2 className="text-3xl font-bold text-white">Submit Security Report</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Report Type */}
            <div>
              <label className="block text-lg font-semibold text-white mb-3">
                Report Type <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.threatType}
                onChange={(e) => handleInputChange('threatType', e.target.value)}
                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white text-lg"
                required
              >
                <option value="" className="bg-gray-800">Select crime type</option>
                <option value="Armed Robbery" className="bg-gray-800">Armed Robbery</option>
                <option value="Kidnapping" className="bg-gray-800">Kidnapping</option>
                <option value="Terrorism" className="bg-gray-800">Terrorism</option>
                <option value="Drug Trafficking" className="bg-gray-800">Drug Trafficking</option>
                <option value="Human Trafficking" className="bg-gray-800">Human Trafficking</option>
                <option value="Theft" className="bg-gray-800">Theft</option>
                <option value="Vandalism" className="bg-gray-800">Vandalism</option>
                <option value="Cybercrime" className="bg-gray-800">Cybercrime</option>
                <option value="Fraud" className="bg-gray-800">Fraud</option>
                <option value="Other" className="bg-gray-800">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-semibold text-white mb-3">
                Detailed Description <span className="text-red-400">*</span>
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder-gray-300 min-h-[150px] text-lg"
                placeholder="Provide detailed information about the incident including what happened, when it occurred, people involved, etc."
                required
              />
            </div>

            {/* Location Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-semibold text-white mb-3">
                  State <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white text-lg"
                  required
                >
                  <option value="" className="bg-gray-800">Select State</option>
                  {nigerianStates.map(state => (
                    <option key={state} value={state} className="bg-gray-800">{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-semibold text-white mb-3">
                  Local Government Area <span className="text-red-400">*</span>
                </label>
                <Input
                  value={formData.localGovernment}
                  onChange={(e) => handleInputChange('localGovernment', e.target.value)}
                  className="bg-white/10 border-white/30 text-white placeholder-gray-300 text-lg"
                  placeholder="Enter LGA"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-white mb-3">
                  Full Address
                </label>
                <Input
                  value={formData.fullAddress}
                  onChange={(e) => handleInputChange('fullAddress', e.target.value)}
                  className="bg-white/10 border-white/30 text-white placeholder-gray-300 text-lg"
                  placeholder="Complete address of incident"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-white mb-3">
                  Landmark (Optional)
                </label>
                <Input
                  value={formData.landmark}
                  onChange={(e) => handleInputChange('landmark', e.target.value)}
                  className="bg-white/10 border-white/30 text-white placeholder-gray-300 text-lg"
                  placeholder="Nearby landmark or notable location"
                />
              </div>
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-lg font-semibold text-white mb-3">
                Evidence Files (Optional)
              </label>
              <MediaUploadSection
                images={images}
                videos={videos}
                onImagesChange={setImages}
                onVideosChange={setVideos}
                uploading={uploading}
              />
            </div>

            {/* Urgency Level */}
            <div>
              <label className="block text-lg font-semibold text-white mb-3">
                Urgency Level <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.urgency}
                onChange={(e) => handleInputChange('urgency', e.target.value)}
                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white text-lg"
                required
              >
                <option value="low" className="bg-gray-800">Low - General Information</option>
                <option value="medium" className="bg-gray-800">Medium - Requires Attention</option>
                <option value="high" className="bg-gray-800">High - Urgent Response</option>
                <option value="critical" className="bg-gray-800">Critical - Immediate Action</option>
              </select>
            </div>

            {/* Reporter Information */}
            <div className="border-t border-white/20 pt-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <User className="w-6 h-6 mr-3" />
                Reporter Information
              </h3>
              
              <div className="space-y-6">
                <div className="bg-green-900/20 border border-green-600/50 rounded-lg p-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAnonymous}
                      onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                      className="w-5 h-5 text-green-600 rounded"
                    />
                    <div>
                      <span className="text-white font-semibold">Submit anonymously</span>
                      <p className="text-green-300 text-sm">Recommended for your safety and security</p>
                    </div>
                  </label>
                </div>

                {!formData.isAnonymous && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Full Name (Optional)
                      </label>
                      <Input
                        value={formData.reporterName}
                        onChange={(e) => handleInputChange('reporterName', e.target.value)}
                        className="bg-white/10 border-white/30 text-white placeholder-gray-300"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Phone Number (Optional)
                      </label>
                      <Input
                        value={formData.reporterPhone}
                        onChange={(e) => handleInputChange('reporterPhone', e.target.value)}
                        className="bg-white/10 border-white/30 text-white placeholder-gray-300"
                        placeholder="Your phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Email Address (Optional)
                      </label>
                      <Input
                        value={formData.reporterEmail}
                        onChange={(e) => handleInputChange('reporterEmail', e.target.value)}
                        className="bg-white/10 border-white/30 text-white placeholder-gray-300"
                        placeholder="Your email address"
                        type="email"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">
                        Contact Info (Optional)
                      </label>
                      <Input
                        value={formData.reporterContact}
                        onChange={(e) => handleInputChange('reporterContact', e.target.value)}
                        className="bg-white/10 border-white/30 text-white placeholder-gray-300"
                        placeholder="Alternative contact method"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-between items-center pt-8 border-t border-white/20">
              <div className="text-gray-300 space-y-2">
                <p className="flex items-center"><Lock className="w-4 h-4 mr-2 text-green-400" /> All data is encrypted and secure</p>
                <p className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-blue-400" /> Location shared for faster response</p>
                <p className="flex items-center"><FileText className="w-4 h-4 mr-2 text-purple-400" /> Reference ID provided upon submission</p>
              </div>
              
              <Button 
                type="submit" 
                size="lg"
                className={`px-12 py-4 text-lg font-bold ${
                  !locationData.hasPermission 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                } text-white shadow-xl`}
                disabled={loading || !locationData.hasPermission || uploading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    Submitting...
                  </>
                ) : uploading ? (
                  <>
                    <div className="animate-spin w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Report
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Emergency Notice */}
        <Card className="bg-red-900/30 border-red-600/50 p-6 mt-8">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-8 h-8 text-red-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-red-300 text-lg mb-2">Emergency Situations</h4>
              <p className="text-red-200">
                For immediate threats or life-threatening emergencies, contact local emergency services (199, 112) 
                or the nearest security agency directly before submitting this report. This portal is for intelligence 
                gathering and non-emergency incident reporting.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-green-400 text-2xl">
              <CheckCircle className="w-12 h-12 mx-auto mb-4" />
              Report Submitted Successfully!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-center">
            <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-6">
              <p className="text-green-300 mb-3 font-semibold">Your Reference Number:</p>
              <div className="flex items-center justify-center space-x-3">
                <span className="font-mono text-xl text-white bg-gray-800 px-4 py-2 rounded-lg">
                  {serialNumber}
                </span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => copyToClipboard(serialNumber)}
                  className="bg-transparent border-green-600 text-green-400 hover:bg-green-600/20"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="text-gray-300 space-y-2">
              <p>✓ Save this reference number to track your report</p>
              <p>✓ You will be notified of any status updates</p>
              <p>✓ Use this number for any follow-up communication</p>
              <p>✓ Your report has been forwarded to the appropriate unit</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tracking Modal */}
      <Dialog open={showTrackingModal} onOpenChange={setShowTrackingModal}>
        <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Report Status & Details</DialogTitle>
          </DialogHeader>
          {trackingResult && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <span className="text-gray-400">Reference Number:</span>
                  <span className="ml-2 font-mono text-white font-bold">{trackingResult.serial_number || 'N/A'}</span>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <span className="text-gray-400">Current Status:</span>
                  <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${
                    trackingResult.status === 'resolved' ? 'bg-green-900/50 text-green-300' :
                    trackingResult.status === 'assigned' ? 'bg-blue-900/50 text-blue-300' :
                    'bg-yellow-900/50 text-yellow-300'
                  }`}>
                    {trackingResult.status.toUpperCase()}
                  </span>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <span className="text-gray-400">Submitted:</span>
                  <span className="ml-2 text-white">{new Date(trackingResult.created_at).toLocaleString()}</span>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <span className="text-gray-400">Report Type:</span>
                  <span className="ml-2 text-white font-semibold">{trackingResult.threat_type}</span>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <span className="text-gray-400">Location:</span>
                  <span className="ml-2 text-white">{trackingResult.state}</span>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <span className="text-gray-400">Priority:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
                    trackingResult.urgency === 'critical' ? 'bg-red-900/50 text-red-300' :
                    trackingResult.urgency === 'high' ? 'bg-orange-900/50 text-orange-300' :
                    'bg-blue-900/50 text-blue-300'
                  }`}>
                    {trackingResult.urgency?.toUpperCase() || 'MEDIUM'}
                  </span>
                </div>
              </div>
              <div className="bg-gray-800/30 p-6 rounded-lg">
                <h4 className="font-semibold mb-3 text-white">Description:</h4>
                <p className="text-gray-300">{trackingResult.description}</p>
              </div>
              {trackingResult.assigned_to && (
                <div className="bg-blue-900/20 border border-blue-600/50 p-4 rounded-lg">
                  <p className="text-blue-300">
                    <strong>Assigned to:</strong> {trackingResult.assigned_to}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportCrime;
