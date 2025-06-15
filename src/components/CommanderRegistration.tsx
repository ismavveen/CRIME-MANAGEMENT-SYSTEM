import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, UserPlus, Mail, Shield, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import { useUnitCommanders } from '@/hooks/useUnitCommanders';
import { supabase } from '@/integrations/supabase/client';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River',
  'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano',
  'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
  'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

const MILITARY_RANKS = [
  'Lieutenant', 'Captain', 'Major', 'Lieutenant Colonel', 'Colonel', 'Brigadier General',
  'Major General', 'Lieutenant General', 'General', 'Field Marshal'
];

const CommanderRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    rank: '',
    unit: '',
    state: '',
    email: '',
    serviceNumber: '',
    armOfService: '',
    specialization: '',
    location: '',
    contactInfo: ''
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredCommander, setRegisteredCommander] = useState<any>(null);
  const { toast } = useToast();
  const { createCommander } = useUnitCommanders();

  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }
      setProfileImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Generate a secure password
      const defaultPassword = generatePassword();

      // Hash the password using the edge function
      const { data: hashData, error: hashError } = await supabase.functions.invoke('set-commander-password', {
        body: { 
          email: formData.email, 
          password: defaultPassword 
        }
      });

      if (hashError) throw hashError;

      // Upload profile image if provided
      let profileImageUrl = null;
      if (profileImage) {
        const fileExt = profileImage.name.split('.').pop();
        const fileName = `${formData.serviceNumber}_${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(fileName, profileImage);

        if (uploadError) {
          console.error('Image upload failed:', uploadError);
        } else {
          profileImageUrl = uploadData.path;
        }
      }

      // Create commander record
      const newCommander = await createCommander({
        full_name: formData.fullName,
        rank: formData.rank,
        unit: formData.unit,
        state: formData.state,
        email: formData.email,
        service_number: formData.serviceNumber,
        arm_of_service: formData.armOfService as 'Army' | 'Navy' | 'Air Force',
        specialization: formData.specialization,
        location: formData.location,
        contact_info: formData.contactInfo,
        password_hash: hashData.hash,
        profile_image: profileImageUrl,
        status: 'active'
      });

      // Send credentials via email
      const { error: emailError } = await supabase.functions.invoke('send-commander-credentials', {
        body: {
          email: formData.email,
          fullName: formData.fullName,
          password: defaultPassword,
          serviceNumber: formData.serviceNumber,
          rank: formData.rank,
          unit: formData.unit,
          category: formData.armOfService
        }
      });

      if (emailError) {
        console.error('Email sending failed:', emailError);
        toast({
          title: "Warning",
          description: "Commander registered but email notification failed. Please contact them manually.",
          variant: "destructive",
        });
      }

      // Set success data and show modal
      setRegisteredCommander({
        name: formData.fullName,
        email: formData.email,
        rank: formData.rank,
        serviceNumber: formData.serviceNumber
      });
      setShowSuccessModal(true);

      // Reset form
      setFormData({
        fullName: '',
        rank: '',
        unit: '',
        state: '',
        email: '',
        serviceNumber: '',
        armOfService: '',
        specialization: '',
        location: '',
        contactInfo: ''
      });
      setProfileImage(null);

    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register commander",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Success Modal Component
  const SuccessModal = () => {
    if (!showSuccessModal || !registeredCommander) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-white text-2xl">Registration Successful!</CardTitle>
            <CardDescription className="text-gray-400">
              Unit Commander has been successfully registered
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-green-900/20 border-green-700">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-300">
                <strong>{registeredCommander.rank} {registeredCommander.name}</strong> has been successfully registered in the system.
              </AlertDescription>
            </Alert>

            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400 font-medium">Email Notification Sent</span>
              </div>
              <p className="text-sm text-gray-300 mb-3">
                An email has been sent to <strong>{registeredCommander.email}</strong> with:
              </p>
              <ul className="text-sm text-gray-300 space-y-1 ml-4">
                <li>• Login credentials (Service Number: {registeredCommander.serviceNumber})</li>
                <li>• Temporary password</li>
                <li>• Secure link to set up their new password</li>
                <li>• Access instructions for the commander portal</li>
              </ul>
            </div>

            <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-orange-400" />
                <span className="text-orange-400 font-medium">Important Security Notice</span>
              </div>
              <p className="text-sm text-gray-300">
                The commander must follow the link in their email to set up a secure password before accessing their dashboard.
              </p>
            </div>

            <Button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-dhq-blue hover:bg-blue-700"
            >
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <>
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-dhq-blue" />
            Register New Unit Commander
          </CardTitle>
          <CardDescription className="text-gray-400">
            Add a new unit commander to the system with secure credentials
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName" className="text-gray-300">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="rank" className="text-gray-300">Rank *</Label>
                <Select value={formData.rank} onValueChange={(value) => setFormData(prev => ({ ...prev, rank: value }))}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select rank" />
                  </SelectTrigger>
                  <SelectContent>
                    {MILITARY_RANKS.map((rank) => (
                      <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="serviceNumber" className="text-gray-300">Service Number *</Label>
                <Input
                  id="serviceNumber"
                  value={formData.serviceNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, serviceNumber: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="armOfService" className="text-gray-300">Arm of Service *</Label>
                <Select value={formData.armOfService} onValueChange={(value) => setFormData(prev => ({ ...prev, armOfService: value }))}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Army">Nigerian Army</SelectItem>
                    <SelectItem value="Navy">Nigerian Navy</SelectItem>
                    <SelectItem value="Air Force">Nigerian Air Force</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="unit" className="text-gray-300">Unit/Division *</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="state" className="text-gray-300">Assigned State *</Label>
                <Select value={formData.state} onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {NIGERIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-300">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="contactInfo" className="text-gray-300">Phone Number</Label>
                <Input
                  id="contactInfo"
                  value={formData.contactInfo}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="specialization" className="text-gray-300">Specialization</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="e.g., Counter-terrorism, Intelligence"
                />
              </div>

              <div>
                <Label htmlFor="location" className="text-gray-300">Current Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Base/Station location"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="profileImage" className="text-gray-300">Profile Image</Label>
              <div className="mt-2">
                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="bg-gray-700 border-gray-600 text-white file:bg-dhq-blue file:text-white file:border-0"
                />
                {profileImage && (
                  <p className="text-sm text-green-400 mt-1">
                    Selected: {profileImage.name}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400 font-medium">Security Notice</span>
              </div>
              <p className="text-sm text-gray-300">
                A secure password will be automatically generated and sent to the commander's email address along with login instructions.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-dhq-blue hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Mail className="h-4 w-4 mr-2 animate-spin" />
                  Registering & Sending Credentials...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register Commander
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Success Modal */}
      <SuccessModal />
    </>
  );
};

export default CommanderRegistration;
