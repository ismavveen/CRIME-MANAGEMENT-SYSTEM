import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import MediaUploadSection from '@/components/MediaUploadSection';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield, AlertTriangle, MapPin, User, Phone, Navigation, Smartphone, MessageSquare, Mail, UserCheck, CheckCircle, Lock, Zap, Globe, Clock, Copy, Search } from 'lucide-react';
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
        
        getAddressFromCoordinates(position.coords.latitude, position.coords.longitude);
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

  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      setFormData(prev => ({
        ...prev,
        location: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      }));
    } catch (error) {
      console.log('Failed to get address from coordinates:', error);
    }
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
    
    if (!locationData.hasPermission || !locationData.latitude || !locationData.longitude) {
      toast({
        title: "Location Required",
        description: "Please allow location access to submit your report. This helps authorities respond more effectively.",
        variant: "destructive",
      });
      requestLocationPermission();
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
      };

      const { data, error } = await supabase
        .from('reports')
        .upsert([reportData], { 
          onConflict: 'id',
          ignoreDuplicates: false 
        })
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Report submitted successfully:', data);
      const reportResponse = data[0];
      setReportId(reportResponse.id);
      
      // Handle serial_number safely - check if it exists in the response type
      const reportWithSerial = reportResponse as any; // Type assertion for serial_number
      const generatedSerialNumber = reportWithSerial.serial_number || `DHQ-${new Date().getFullYear()}-${reportResponse.id.slice(0, 3)}`;
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

  const reportingChannels = [
    {
      id: 'web_app',
      title: 'Web Portal',
      icon: <Globe className="w-6 h-6" />,
      description: 'Secure web-based reporting with encryption',
      status: 'PRIMARY',
      active: formData.reporterType === 'web_app'
    },
    {
      id: 'mobile_app',
      title: 'Mobile App',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Field-ready mobile application',
      status: 'OPERATIONAL',
      active: formData.reporterType === 'mobile_app'
    },
    {
      id: 'sms',
      title: 'SMS Gateway',
      icon: <MessageSquare className="w-6 h-6" />,
      description: 'Text to 40404 - Network independent',
      status: 'ACTIVE',
      active: formData.reporterType === 'sms'
    },
    {
      id: 'call_hotline',
      title: 'Emergency Hotline',
      icon: <Phone className="w-6 h-6" />,
      description: '24/7 Operations Center: 199 | 112',
      status: 'PRIORITY',
      active: formData.reporterType === 'call_hotline'
    },
    {
      id: 'email',
      title: 'Secure Email',
      icon: <Mail className="w-6 h-6" />,
      description: 'intel@dhq.mil.ng - Encrypted transmission',
      status: 'SECURE',
      active: formData.reporterType === 'email'
    },
    {
      id: 'manual',
      title: 'Field Office',
      icon: <UserCheck className="w-6 h-6" />,
      description: 'Physical reporting at DHQ installations',
      status: 'AVAILABLE',
      active: formData.reporterType === 'manual'
    }
  ];

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta',
    'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
    'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
    'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
  ];

  return (
    <div className="min-h-screen bg-dhq-dark-bg">
      <div className="max-w-6xl mx-auto p-6">
        {/* Enhanced Military Header */}
        <div className="text-center mb-8 border-b border-gray-700/50 pb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-white p-2 mr-6">
              <img 
                src="/lovable-uploads/b160c848-06aa-40b9-8717-59194cc9a1a8.png" 
                alt="Defense Headquarters Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-white mb-2">DEFENSE HEADQUARTERS</h1>
              <p className="text-xl text-gray-300 mb-2">Intelligence & Crime Reporting Portal</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-green-400 text-sm font-semibold">
                  <Lock className="w-4 h-4 mr-2" />
                  <span>SECURITY LEVEL: CONFIDENTIAL</span>
                </div>
                <div className="flex items-center text-blue-400 text-sm">
                  <Zap className="w-4 h-4 mr-2" />
                  <span>REAL-TIME PROCESSING</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 text-orange-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">SECURE REPORTING</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">ANONYMOUS OPTION</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-blue-400">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">24/7 MONITORING</span>
            </div>
          </div>
        </div>

        {/* Track Report Section */}
        <Card className="bg-gray-800/50 border-gray-700/50 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Search className="w-5 h-5 mr-2 text-blue-400" />
            Track Your Report
          </h2>
          <div className="flex space-x-4">
            <Input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="bg-gray-900/50 border-gray-600 text-white flex-1"
              placeholder="Enter your reference number (e.g., DHQ-2024-001)"
            />
            <Button 
              onClick={handleTrackReport}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Track Report
            </Button>
          </div>
        </Card>

        {/* Enhanced Reporting Channels */}
        <Card className="bg-gray-800/80 border-gray-700/50 p-6 mb-6 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <MessageSquare className="w-6 h-6 mr-3 text-blue-400" />
            INTELLIGENCE REPORTING CHANNELS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportingChannels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => handleInputChange('reporterType', channel.id)}
                className={`p-6 rounded-lg border-2 transition-all duration-300 text-left relative overflow-hidden ${
                  channel.active
                    ? 'border-blue-500 bg-blue-500/10 text-white shadow-lg shadow-blue-500/20'
                    : 'border-gray-600 bg-gray-700/30 text-gray-300 hover:border-gray-500 hover:bg-gray-600/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`${channel.active ? 'text-blue-400' : 'text-gray-400'} transform ${channel.active ? 'scale-110' : ''} transition-transform`}>
                    {channel.icon}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded font-bold ${
                    channel.status === 'PRIMARY' ? 'bg-blue-600 text-white' :
                    channel.status === 'PRIORITY' ? 'bg-red-600 text-white' :
                    channel.status === 'SECURE' ? 'bg-green-600 text-white' :
                    'bg-gray-600 text-gray-200'
                  }`}>
                    {channel.status}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">{channel.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{channel.description}</p>
                {channel.active && (
                  <div className="absolute inset-0 border-2 border-blue-400 rounded-lg animate-pulse pointer-events-none"></div>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Location Status Card */}
        <Card className="bg-gray-800/50 border-gray-700/50 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Navigation className={`w-5 h-5 ${locationData.hasPermission ? 'text-green-400' : 'text-red-400'}`} />
              <div>
                <h3 className="text-white font-medium">Location Status</h3>
                <p className="text-sm text-gray-400">
                  {locationData.isLoading 
                    ? 'Getting your location...'
                    : locationData.hasPermission 
                      ? `Location acquired (±${locationData.accuracy?.toFixed(0)}m accuracy)`
                      : locationData.error || 'Location access required'
                  }
                </p>
              </div>
            </div>
            {!locationData.hasPermission && (
              <Button 
                onClick={requestLocationPermission}
                variant="outline"
                size="sm"
                className="bg-transparent border-orange-600 text-orange-400"
              >
                Enable Location
              </Button>
            )}
          </div>
          {locationData.error && (
            <div className="mt-3 p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
              <p className="text-red-300 text-sm">{locationData.error}</p>
            </div>
          )}
        </Card>

        <Card className="bg-gray-800/50 border-gray-700/50 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Submit Intelligence Report</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Report Type *
              </label>
              <select
                value={formData.threatType}
                onChange={(e) => handleInputChange('threatType', e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-md px-3 py-2 text-white"
                required
              >
                <option value="">Select threat type</option>
                <option value="Security Threat">Security Threat</option>
                <option value="Intelligence">Intelligence Information</option>
                <option value="Criminal Activity">Criminal Activity</option>
                <option value="Terrorism">Terrorism Related</option>
                <option value="Weapons">Weapons/Explosives</option>
                <option value="Trafficking">Human/Drug Trafficking</option>
                <option value="Cyber Crime">Cyber Crime</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Detailed Description *
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="bg-gray-900/50 border-gray-600 text-white min-h-[120px]"
                placeholder="Provide detailed information about the incident, suspicious activity, or intelligence..."
                required
              />
            </div>

            {/* Location Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  State *
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-md px-3 py-2 text-white"
                  required
                >
                  <option value="">Select State</option>
                  {nigerianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Local Government Area *
                </label>
                <Input
                  value={formData.localGovernment}
                  onChange={(e) => handleInputChange('localGovernment', e.target.value)}
                  className="bg-gray-900/50 border-gray-600 text-white"
                  placeholder="Enter LGA"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Address *
                </label>
                <Input
                  value={formData.fullAddress}
                  onChange={(e) => handleInputChange('fullAddress', e.target.value)}
                  className="bg-gray-900/50 border-gray-600 text-white"
                  placeholder="Complete address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Landmark (Optional)
                </label>
                <Input
                  value={formData.landmark}
                  onChange={(e) => handleInputChange('landmark', e.target.value)}
                  className="bg-gray-900/50 border-gray-600 text-white"
                  placeholder="Nearby landmark"
                />
              </div>
            </div>

            {/* Additional Location Info */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Additional Location Info (Optional)
              </label>
              <Input
                value={formData.manualLocation}
                onChange={(e) => handleInputChange('manualLocation', e.target.value)}
                className="bg-gray-900/50 border-gray-600 text-white"
                placeholder="Building name, floor, room, etc."
              />
              {locationData.hasPermission && (
                <p className="text-xs text-green-400 mt-1">
                  GPS coordinates will be automatically included
                </p>
              )}
            </div>

            {/* Media Upload Section */}
            <MediaUploadSection
              images={images}
              videos={videos}
              onImagesChange={setImages}
              onVideosChange={setVideos}
              uploading={uploading}
            />

            {/* Urgency Level */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Urgency Level *
              </label>
              <select
                value={formData.urgency}
                onChange={(e) => handleInputChange('urgency', e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-md px-3 py-2 text-white"
                required
              >
                <option value="low">Low - General Information</option>
                <option value="medium">Medium - Requires Attention</option>
                <option value="high">High - Urgent Response</option>
                <option value="critical">Critical - Immediate Action</option>
              </select>
            </div>

            {/* Reporter Information */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-white mb-4">Reporter Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isAnonymous}
                      onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                      className="w-4 h-4 text-dhq-blue"
                    />
                    <span className="text-gray-300">Submit anonymously (recommended)</span>
                  </label>
                </div>

                {!formData.isAnonymous && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Your Name (Optional)
                      </label>
                      <Input
                        value={formData.reporterName}
                        onChange={(e) => handleInputChange('reporterName', e.target.value)}
                        className="bg-gray-900/50 border-gray-600 text-white"
                        placeholder="Full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Contact (Optional)
                      </label>
                      <Input
                        value={formData.reporterContact}
                        onChange={(e) => handleInputChange('reporterContact', e.target.value)}
                        className="bg-gray-900/50 border-gray-600 text-white"
                        placeholder="Phone or email"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-700">
              <div className="text-sm text-gray-400">
                <p>🔒 All reports are encrypted and handled with strict confidentiality</p>
                <p>📍 Your precise location will be shared with authorities for faster response</p>
                <p>📋 You will receive a reference ID upon successful submission</p>
                {(images.length > 0 || videos.length > 0) && (
                  <p>📁 Files will be securely stored and accessible to authorized personnel only</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className={`px-8 ${
                  !locationData.hasPermission 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-dhq-blue hover:bg-blue-700'
                } text-white`}
                disabled={loading || !locationData.hasPermission || uploading}
              >
                {loading ? 'Submitting...' : uploading ? 'Uploading...' : 'Submit Report'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Emergency Notice */}
        <Card className="bg-red-900/20 border-red-700/50 p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-300">Emergency Situations</h4>
              <p className="text-sm text-red-200 mt-1">
                For immediate threats or emergencies, contact local emergency services (199, 112) 
                or the nearest security agency directly before submitting this report.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-center text-green-400 text-xl">
              <CheckCircle className="w-8 h-8 mx-auto mb-2" />
              Report Submitted Successfully!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
              <p className="text-green-300 mb-2">Your Reference Number:</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="font-mono text-lg text-white bg-gray-900 px-3 py-1 rounded">
                  {serialNumber}
                </span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => copyToClipboard(serialNumber)}
                  className="bg-transparent border-green-600 text-green-400"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="text-gray-300">
              <p>• Save this reference number to track your report</p>
              <p>• You will be notified of any status updates</p>
              <p>• Use this number for any follow-up communication</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tracking Modal */}
      <Dialog open={showTrackingModal} onOpenChange={setShowTrackingModal}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Report Status</DialogTitle>
          </DialogHeader>
          {trackingResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Reference:</span>
                  <span className="ml-2 font-mono">{trackingResult.serial_number || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    trackingResult.status === 'resolved' ? 'bg-green-900/30 text-green-300' :
                    trackingResult.status === 'assigned' ? 'bg-blue-900/30 text-blue-300' :
                    'bg-yellow-900/30 text-yellow-300'
                  }`}>
                    {trackingResult.status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Submitted:</span>
                  <span className="ml-2">{new Date(trackingResult.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-400">Type:</span>
                  <span className="ml-2">{trackingResult.threat_type}</span>
                </div>
              </div>
              <div className="bg-gray-900/50 p-3 rounded">
                <h4 className="font-medium mb-2">Description:</h4>
                <p className="text-gray-300 text-sm">{trackingResult.description}</p>
              </div>
              <div className="bg-gray-900/50 p-3 rounded">
                <h4 className="font-medium mb-2">Location:</h4>
                <p className="text-gray-300 text-sm">{trackingResult.full_address || trackingResult.location}</p>
              </div>
              {trackingResult.assigned_to && (
                <div className="bg-blue-900/20 border border-blue-700/50 p-3 rounded">
                  <h4 className="font-medium text-blue-300 mb-1">Assignment Update:</h4>
                  <p className="text-gray-300 text-sm">Assigned to: {trackingResult.assigned_to}</p>
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
