
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import MediaUploadSection from '@/components/MediaUploadSection';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield, AlertTriangle, MapPin, User, Phone, Navigation, CheckCircle, Lock, Clock, Copy, Search, Users, FileText, Send, Menu, X, ChevronDown } from 'lucide-react';
import { useReports } from '@/hooks/useReports';
import { Link } from 'react-router-dom';

const ReportCrime = () => {
  const [currentStep, setCurrentStep] = useState(0);
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const { getReportBySerialNumber } = useReports();

  const steps = [
    { title: "Report Type", description: "What type of incident are you reporting?" },
    { title: "Location Details", description: "Where did the incident occur?" },
    { title: "Incident Description", description: "Tell us what happened" },
    { title: "Evidence & Media", description: "Upload any supporting evidence" },
    { title: "Contact Information", description: "How should we contact you?" },
    { title: "Review & Submit", description: "Review your report before submission" }
  ];

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
        submission_source: 'public_portal',
        validation_status: 'pending',
        metadata: {
          submissionTimestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          source: 'public_web_portal',
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
      setCurrentStep(0);

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

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                What type of incident are you reporting? <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.threatType}
                onChange={(e) => handleInputChange('threatType', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select crime type</option>
                <option value="Armed Robbery">Armed Robbery</option>
                <option value="Kidnapping">Kidnapping</option>
                <option value="Terrorism">Terrorism</option>
                <option value="Drug Trafficking">Drug Trafficking</option>
                <option value="Human Trafficking">Human Trafficking</option>
                <option value="Theft">Theft</option>
                <option value="Vandalism">Vandalism</option>
                <option value="Cybercrime">Cybercrime</option>
                <option value="Fraud">Fraud</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Urgency Level <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.urgency}
                onChange={(e) => handleInputChange('urgency', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="low">Low - General Information</option>
                <option value="medium">Medium - Requires Attention</option>
                <option value="high">High - Urgent Response</option>
                <option value="critical">Critical - Immediate Action</option>
              </select>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select State</option>
                  {nigerianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Local Government Area <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.localGovernment}
                  onChange={(e) => handleInputChange('localGovernment', e.target.value)}
                  className="text-lg py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter LGA"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Full Address
                </label>
                <Input
                  value={formData.fullAddress}
                  onChange={(e) => handleInputChange('fullAddress', e.target.value)}
                  className="text-lg py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Complete address of incident"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Landmark (Optional)
                </label>
                <Input
                  value={formData.landmark}
                  onChange={(e) => handleInputChange('landmark', e.target.value)}
                  className="text-lg py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Nearby landmark or notable location"
                />
              </div>
            </div>

            {/* Location Status */}
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center space-x-4">
                <Navigation className={`w-6 h-6 ${locationData.hasPermission ? 'text-green-600' : 'text-red-500'}`} />
                <div>
                  <h4 className="text-gray-800 font-semibold">Location Status</h4>
                  <p className="text-gray-600 text-sm">
                    {locationData.isLoading 
                      ? 'Acquiring your location...'
                      : locationData.hasPermission 
                        ? `Location acquired (±${locationData.accuracy?.toFixed(0)}m accuracy)`
                        : locationData.error || 'Location access required for report submission'
                    }
                  </p>
                </div>
                {!locationData.hasPermission && (
                  <Button 
                    onClick={requestLocationPermission}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    Enable Location
                  </Button>
                )}
              </div>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="min-h-[200px] text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Provide detailed information about the incident including what happened, when it occurred, people involved, etc."
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
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
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                  className="w-5 h-5 text-green-600 rounded"
                />
                <div>
                  <span className="text-gray-800 font-semibold">Submit anonymously</span>
                  <p className="text-green-700 text-sm">Recommended for your safety and security</p>
                </div>
              </label>
            </div>

            {!formData.isAnonymous && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    Full Name (Optional)
                  </label>
                  <Input
                    value={formData.reporterName}
                    onChange={(e) => handleInputChange('reporterName', e.target.value)}
                    className="focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    Phone Number (Optional)
                  </label>
                  <Input
                    value={formData.reporterPhone}
                    onChange={(e) => handleInputChange('reporterPhone', e.target.value)}
                    className="focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    Email Address (Optional)
                  </label>
                  <Input
                    value={formData.reporterEmail}
                    onChange={(e) => handleInputChange('reporterEmail', e.target.value)}
                    className="focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Your email address"
                    type="email"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    Contact Info (Optional)
                  </label>
                  <Input
                    value={formData.reporterContact}
                    onChange={(e) => handleInputChange('reporterContact', e.target.value)}
                    className="focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Alternative contact method"
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Review Your Report</h3>
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <strong>Report Type:</strong> {formData.threatType}
              </div>
              <div>
                <strong>Urgency:</strong> {formData.urgency}
              </div>
              <div>
                <strong>Location:</strong> {formData.state}, {formData.localGovernment}
              </div>
              <div>
                <strong>Description:</strong> {formData.description}
              </div>
              <div>
                <strong>Submission Type:</strong> {formData.isAnonymous ? 'Anonymous' : 'With Contact Info'}
              </div>
              <div>
                <strong>Evidence:</strong> {images.length} image(s), {videos.length} video(s)
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/0300e6fb-5eb3-4bee-9542-d2935a35734c.png" 
                alt="Defence Headquarters Logo" 
                className="h-10 w-10 object-contain"
              />
              <div>
                <h1 className="text-lg font-bold text-green-800">Defence HQ</h1>
                <p className="text-sm text-green-600">Crime Portal</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-green-600 font-medium">
                  <span>Report Crime</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-green-600 font-medium">
                  <span>Emergency</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-green-600 font-medium">
                  <span>Guidelines</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-green-600 font-medium">
                  <span>Contact</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-green-600 font-medium">
                  <span>Resources</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <Link to="/faqs" className="text-gray-700 hover:text-green-600 font-medium">
                FAQs
              </Link>
            </nav>

            {/* Emergency Button & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold">
                <Phone className="h-4 w-4 mr-2" />
                199
              </Button>
              
              {/* Mobile menu button */}
              <button 
                className="lg:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-4">
              <a href="#" className="block text-gray-700 hover:text-green-600 font-medium">Report Crime</a>
              <a href="#" className="block text-gray-700 hover:text-green-600 font-medium">Emergency</a>
              <a href="#" className="block text-gray-700 hover:text-green-600 font-medium">Guidelines</a>
              <a href="#" className="block text-gray-700 hover:text-green-600 font-medium">Contact</a>
              <a href="#" className="block text-gray-700 hover:text-green-600 font-medium">Resources</a>
              <Link to="/faqs" className="block text-gray-700 hover:text-green-600 font-medium">FAQs</Link>
            </div>
          </div>
        )}
      </header>

      {/* Security Notice */}
      <div className="bg-green-800 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <Lock className="h-4 w-4" />
            <span>Your identity is protected • All information is encrypted • Anonymous reporting enabled</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2000')`,
          minHeight: '500px'
        }}
      >
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Report Crime Safely & Securely
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed">
            The Nigerian Armed Forces is committed to maintaining security and protecting our citizens. 
            Your reports help us serve you better. Report incidents through multiple channels with complete confidentiality.
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={() => setCurrentStep(0)}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-lg"
              size="lg"
            >
              <FileText className="h-5 w-5 mr-2" />
              Report a Crime
            </Button>
            
            <div className="bg-red-600 text-white px-6 py-4 rounded-lg inline-block">
              <div className="flex items-center space-x-3">
                <Phone className="h-6 w-6" />
                <div>
                  <div className="text-xl font-bold">Emergency Hotline</div>
                  <div className="text-3xl font-bold">199</div>
                  <div className="text-sm">Available 24/7</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center bg-white border-0 shadow-lg">
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">100% Anonymous</h3>
              <p className="text-gray-600">Your identity is completely protected. Report without fear of retribution.</p>
            </Card>
            
            <Card className="p-6 text-center bg-white border-0 shadow-lg">
              <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">24/7 Available</h3>
              <p className="text-gray-600">Report crimes anytime, anywhere through multiple secure channels.</p>
            </Card>
            
            <Card className="p-6 text-center bg-white border-0 shadow-lg">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Expert Response</h3>
              <p className="text-gray-600">Trained professionals handle your reports with care and urgency.</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Track Report Section */}
      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
              <Search className="w-6 h-6 mr-3 text-green-600" />
              Track Your Report Status
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="flex-1 text-lg py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your reference number (e.g., DHQ-2024-001234)"
              />
              <Button 
                onClick={handleTrackReport}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
              >
                <Search className="w-5 h-5 mr-2" />
                Track Report
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Progress Form Section */}
      {currentStep > 0 && (
        <div className="bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {steps[currentStep - 1]?.title}
                </h2>
                <span className="text-sm text-gray-600">
                  Step {currentStep} of {steps.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{steps[currentStep - 1]?.description}</p>
            </div>

            {/* Form Content */}
            <Card className="p-8">
              <form onSubmit={currentStep === steps.length ? handleSubmit : (e) => e.preventDefault()}>
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="px-6 py-2"
                  >
                    Previous
                  </Button>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Lock className="h-4 w-4 text-green-600" />
                    <span>All data is encrypted and secure</span>
                  </div>

                  {currentStep === steps.length ? (
                    <Button 
                      type="submit" 
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
                      disabled={loading || uploading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Report
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}

      {/* Emergency Notice */}
      <div className="bg-red-50 border-t border-red-200 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-8 h-8 text-red-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-red-800 text-lg mb-2">Emergency Situations</h4>
              <p className="text-red-700">
                For immediate threats or life-threatening emergencies, contact local emergency services (199, 112) 
                or the nearest security agency directly before submitting this report. This portal is for intelligence 
                gathering and non-emergency incident reporting.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="bg-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-green-600 text-2xl">
              <CheckCircle className="w-12 h-12 mx-auto mb-4" />
              Report Submitted Successfully!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-green-800 mb-3 font-semibold">Your Reference Number:</p>
              <div className="flex items-center justify-center space-x-3">
                <span className="font-mono text-xl text-gray-800 bg-gray-100 px-4 py-2 rounded-lg">
                  {serialNumber}
                </span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => copyToClipboard(serialNumber)}
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="text-gray-600 space-y-2">
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
        <DialogContent className="bg-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Report Status & Details</DialogTitle>
          </DialogHeader>
          {trackingResult && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-gray-600">Reference Number:</span>
                  <span className="ml-2 font-mono text-gray-800 font-bold">{trackingResult.serial_number || 'N/A'}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-gray-600">Current Status:</span>
                  <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${
                    trackingResult.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    trackingResult.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {trackingResult.status.toUpperCase()}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-gray-600">Submitted:</span>
                  <span className="ml-2 text-gray-800">{new Date(trackingResult.created_at).toLocaleString()}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-gray-600">Report Type:</span>
                  <span className="ml-2 text-gray-800 font-semibold">{trackingResult.threat_type}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-gray-600">Location:</span>
                  <span className="ml-2 text-gray-800">{trackingResult.state}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-gray-600">Priority:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
                    trackingResult.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                    trackingResult.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {trackingResult.urgency?.toUpperCase() || 'MEDIUM'}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-3 text-gray-800">Description:</h4>
                <p className="text-gray-700">{trackingResult.description}</p>
              </div>
              {trackingResult.assigned_to && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-blue-800">
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
