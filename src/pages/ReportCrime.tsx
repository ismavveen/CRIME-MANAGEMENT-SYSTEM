
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, AlertTriangle, MapPin, Upload, User, Phone, Navigation } from 'lucide-react';

const ReportCrime = () => {
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    manualLocation: '',
    urgency: 'medium',
    threatType: '',
    reporterType: 'anonymous',
    isAnonymous: true,
    reporterName: '',
    reporterContact: '',
  });
  const [locationData, setLocationData] = useState({
    latitude: null as number | null,
    longitude: null as number | null,
    accuracy: null as number | null,
    hasPermission: false,
    isLoading: false,
    error: null as string | null,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
        
        // Get readable address from coordinates
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
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      // Using a simple reverse geocoding approach - in production you might want to use a proper service
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if location is available
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

    try {
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
      };

      console.log('Submitting report data:', reportData);

      const { data, error } = await supabase
        .from('reports')
        .insert([reportData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Report submitted successfully:', data);

      toast({
        title: "Report submitted successfully",
        description: `Your report has been received. Reference ID: ${data[0].id.slice(0, 8)}`,
      });

      // Reset form
      setFormData({
        description: '',
        location: '',
        manualLocation: '',
        urgency: 'medium',
        threatType: '',
        reporterType: 'anonymous',
        isAnonymous: true,
        reporterName: '',
        reporterContact: '',
      });

      // Re-request location for next report
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
    }
  };

  return (
    <div className="min-h-screen bg-dhq-dark-bg p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-red-800 rounded-lg flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Defense HQ</h1>
          <p className="text-gray-400 mb-4">Intelligence & Crime Reporting Portal</p>
          <div className="flex items-center justify-center text-orange-400 text-sm">
            <AlertTriangle className="w-4 h-4 mr-2" />
            <span>Secure & Confidential Reporting</span>
          </div>
        </div>

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

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Additional Location Info (Optional)
                </label>
                <Input
                  value={formData.manualLocation}
                  onChange={(e) => handleInputChange('manualLocation', e.target.value)}
                  className="bg-gray-900/50 border-gray-600 text-white"
                  placeholder="Building name, landmark, etc."
                />
                {locationData.hasPermission && (
                  <p className="text-xs text-green-400 mt-1">
                    GPS coordinates will be automatically included
                  </p>
                )}
              </div>
              
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

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Reporter Type
                  </label>
                  <select
                    value={formData.reporterType}
                    onChange={(e) => handleInputChange('reporterType', e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-md px-3 py-2 text-white"
                  >
                    <option value="anonymous">Anonymous Citizen</option>
                    <option value="witness">Witness</option>
                    <option value="informant">Informant</option>
                    <option value="official">Government Official</option>
                    <option value="security">Security Personnel</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-700">
              <div className="text-sm text-gray-400">
                <p>🔒 All reports are encrypted and handled with strict confidentiality</p>
                <p>📍 Your precise location will be shared with authorities for faster response</p>
                <p>📋 You will receive a reference ID upon successful submission</p>
              </div>
              
              <Button 
                type="submit" 
                className={`px-8 ${
                  !locationData.hasPermission 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-dhq-blue hover:bg-blue-700'
                } text-white`}
                disabled={loading || !locationData.hasPermission}
              >
                {loading ? 'Submitting...' : 'Submit Report'}
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
    </div>
  );
};

export default ReportCrime;
