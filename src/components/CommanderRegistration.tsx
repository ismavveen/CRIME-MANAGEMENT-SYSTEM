import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, UserPlus, Mail, Shield, CheckCircle, Users } from 'lucide-react';
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
      // No password is generated or stored at registration.
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

      // Create commander record with NULL password hash.
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
        password_hash: null,
        profile_image: profileImageUrl,
        status: 'active'
      });

      // Send credentials/setup email (branded, NO password included)
      const { error: emailError } = await supabase.functions.invoke('send-commander-credentials', {
        body: {
          email: formData.email,
          fullName: formData.fullName,
          password: null, // password is not sent/stored here!
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

      setRegisteredCommander({
        name: formData.fullName,
        email: formData.email,
        rank: formData.rank,
        serviceNumber: formData.serviceNumber,
        state: formData.state,
        unit: formData.unit,
        armOfService: formData.armOfService
      });
      setShowSuccessModal(true);

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

  // Enhanced Success Modal Component
  const SuccessModal = () => {
    if (!showSuccessModal || !registeredCommander) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl bg-gray-800 border-gray-700 max-h-[90vh] overflow-y-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-white text-2xl">🎉 Registration Successful!</CardTitle>
            <CardDescription className="text-gray-400">
              Unit Commander has been successfully registered and notified
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="bg-green-900/20 border-green-700">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-300">
                <strong>{registeredCommander.rank} {registeredCommander.name}</strong> has been successfully registered as a Unit Commander for <strong>{registeredCommander.state} State</strong>.
              </AlertDescription>
            </Alert>

            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-blue-400 font-semibold text-lg">📧 Email Notification Sent</span>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                A comprehensive welcome email has been sent to <strong className="text-blue-300">{registeredCommander.email}</strong> containing:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <h4 className="text-white font-medium mb-2">🔑 Account Details</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Service Number: {registeredCommander.serviceNumber}</li>
                    <li>• Email: {registeredCommander.email}</li>
                    <li>• Login: via secure setup link in email</li>
                    <li>• Military branch: {registeredCommander.armOfService}</li>
                  </ul>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <h4 className="text-white font-medium mb-2">🔒 Password Setup</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Secure password setup link sent</li>
                    <li>• Link expires in 1 hour</li>
                    <li>• Commander must set their own password</li>
                    <li>• Includes portal access instructions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-orange-400" />
                <span className="text-orange-400 font-semibold">⚠️ Action Required by Commander</span>
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <p>• The commander <strong>MUST</strong> click the secure link in their email to set up a new password.</p>
                <p>• The password setup link expires in <strong>1 hour</strong> for security.</p>
                <p>• They will only see reports and data from <strong>{registeredCommander.state} State</strong>.</p>
                <p>• The welcome email does not contain a password and is safe to keep.</p>
              </div>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-purple-400" />
                <span className="text-purple-400 font-medium">Commander Details</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white ml-2">{registeredCommander.rank} {registeredCommander.name}</span>
                </div>
                <div>
                  <span className="text-gray-400">State:</span>
                  <span className="text-white ml-2">{registeredCommander.state}</span>
                </div>
                <div>
                  <span className="text-gray-400">Unit:</span>
                  <span className="text-white ml-2">{registeredCommander.unit}</span>
                </div>
                <div>
                  <span className="text-gray-400">Service:</span>
                  <span className="text-white ml-2">{registeredCommander.armOfService}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 bg-dhq-blue hover:bg-blue-700"
              >
                Close
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(registeredCommander.email);
                  toast({ title: "Email copied to clipboard" });
                }}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Copy Email
              </Button>
            </div>
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
            Add a new unit commander to the system with secure credentials and email notification
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
                <span className="text-blue-400 font-medium">Enhanced Security & Email Notification</span>
              </div>
              <div className="text-sm text-gray-300 space-y-1">
                <p>• No password is created. Instead, a secure setup link is emailed to the commander.</p>
                <p>• Commander will receive a secure link to create their own password.</p>
                <p>• Email includes comprehensive security instructions and login details.</p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-dhq-blue hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Mail className="h-4 w-4 mr-2 animate-spin" />
                  Registering & Sending Secure Email...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register Commander & Send Email
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Enhanced Success Modal */}
      <SuccessModal />
    </>
  );
};

export default CommanderRegistration;
