import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Copy, Check, Upload, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUnitCommanders } from '@/hooks/useUnitCommanders';
import { supabase } from '@/integrations/supabase/client';

const CommanderRegistration = () => {
  const { createCommander } = useUnitCommanders();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    full_name: '',
    rank: '',
    unit: '',
    state: '',
    email: '',
    service_number: '',
    specialization: '',
    location: '',
    contact_info: '',
    profile_image: '',
    arm_of_service: ''
  });
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [step, setStep] = useState(1); // 1: Registration, 2: OTP Verification, 3: Set Password
  const [loading, setLoading] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
    'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
    'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
    'Yobe', 'Zamfara'
  ];

  const ranks = [
    'General', 'Lieutenant General', 'Major General', 'Brigadier General',
    'Colonel', 'Lieutenant Colonel', 'Major', 'Captain', 'Lieutenant',
    'Second Lieutenant', 'Warrant Officer', 'Staff Sergeant', 'Sergeant',
    'Corporal', 'Lance Corporal', 'Private'
  ];

  const armsOfService = ['Army', 'Navy', 'Air Force'];

  const generateServiceNumber = () => {
    const prefix = formData.state.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 999).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfileImage = async (): Promise<string | null> => {
    if (!profileImageFile) return null;

    try {
      const fileExt = profileImageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('profiles')
        .upload(fileName, profileImageFile);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate service number if not provided
      if (!formData.service_number) {
        const serviceNumber = generateServiceNumber();
        setFormData(prev => ({ ...prev, service_number: serviceNumber }));
      }

      // Generate OTP for simulated email verification
      const otp = generateOTP();
      setOtpCode(otp);
      
      toast({
        title: "Registration Initiated",
        description: `OTP generated: ${otp}. Please verify email to continue.`,
      });

      setStep(2);
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = () => {
    if (otpCode) {
      toast({
        title: "Email Verified",
        description: "Please set your password to complete registration.",
      });
      setStep(3);
    } else {
      toast({
        title: "Verification Failed",
        description: "Invalid OTP code",
        variant: "destructive",
      });
    }
  };

  const handlePasswordSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Upload profile image if provided
      const profileImageUrl = await uploadProfileImage();

      // Hash password using edge function
      const { data: hashResult, error: hashError } = await supabase.functions.invoke('set-commander-password', {
        body: { 
          email: formData.email,
          password: password
        }
      });

      if (hashError || !hashResult?.hash) {
        throw new Error('Failed to secure password');
      }

      // Create commander with hashed password
      await createCommander({
        ...formData,
        service_number: formData.service_number,
        profile_image: profileImageUrl || '',
        password_hash: hashResult.hash,
        arm_of_service: formData.arm_of_service as 'Army' | 'Navy' | 'Air Force',
        status: 'active'
      });

      toast({
        title: "Registration Complete",
        description: `${formData.full_name} has been successfully registered`,
      });

      // Reset form
      setFormData({
        full_name: '',
        rank: '',
        unit: '',
        state: '',
        email: '',
        service_number: '',
        specialization: '',
        location: '',
        contact_info: '',
        profile_image: '',
        arm_of_service: ''
      });
      setPassword('');
      setConfirmPassword('');
      setOtpCode('');
      setImagePreview('');
      setProfileImageFile(null);
      setStep(1);
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyOtpToClipboard = () => {
    navigator.clipboard.writeText(otpCode);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
    toast({
      title: "OTP Copied",
      description: "OTP code copied to clipboard",
    });
  };

  if (step === 2) {
    return (
      <Card className="max-w-md mx-auto bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Email Verification</CardTitle>
          <CardDescription className="text-gray-400">
            Verify your email with the OTP code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-900/20 border border-blue-700/50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 font-medium">Generated OTP:</p>
                <p className="text-white text-xl font-mono">{otpCode}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyOtpToClipboard}
                className="text-blue-300 border-blue-700"
              >
                {copiedOtp ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={() => setStep(1)}
              variant="outline"
              className="flex-1 text-gray-300 border-gray-600"
            >
              Back
            </Button>
            <Button
              onClick={handleOtpVerification}
              className="flex-1 bg-dhq-blue hover:bg-blue-700"
            >
              Verify Email
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 3) {
    return (
      <Card className="max-w-md mx-auto bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Set Your Password</CardTitle>
          <CardDescription className="text-gray-400">
            Create a secure password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSetup} className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white pr-10"
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white pr-10"
                  placeholder="Confirm your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="text-xs text-gray-400 space-y-1">
              <p>Password requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>At least 8 characters long</li>
                <li>Mix of letters, numbers, and symbols recommended</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                onClick={() => setStep(2)}
                variant="outline"
                className="flex-1 text-gray-300 border-gray-600"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-dhq-blue hover:bg-blue-700"
              >
                {loading ? 'Completing...' : 'Complete Registration'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Register New Response Unit Commander
        </CardTitle>
        <CardDescription className="text-gray-400">
          Add a new unit commander to the system with secure credentials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Upload */}
          <div className="space-y-2">
            <Label className="text-gray-300">Profile Image</Label>
            <div className="flex items-center space-x-4">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Profile preview" 
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="profile-image"
                />
                <Label 
                  htmlFor="profile-image"
                  className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Choose Image
                </Label>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name" className="text-gray-300">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-300">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter email address"
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
                  {ranks.map((rank) => (
                    <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="arm_of_service" className="text-gray-300">Arm of Service *</Label>
              <Select value={formData.arm_of_service} onValueChange={(value) => setFormData(prev => ({ ...prev, arm_of_service: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select arm of service" />
                </SelectTrigger>
                <SelectContent>
                  {armsOfService.map((arm) => (
                    <SelectItem key={arm} value={arm}>{arm}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="unit" className="text-gray-300">Unit *</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter unit name"
                required
              />
            </div>

            <div>
              <Label htmlFor="state" className="text-gray-300">State *</Label>
              <Select value={formData.state} onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {nigerianStates.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="service_number" className="text-gray-300">Service Number</Label>
              <div className="flex space-x-2">
                <Input
                  id="service_number"
                  value={formData.service_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, service_number: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white flex-1"
                  placeholder="Enter or auto-generate"
                />
                <Button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, service_number: generateServiceNumber() }))}
                  variant="outline"
                  className="text-gray-300 border-gray-600"
                >
                  Generate
                </Button>
              </div>
              {formData.service_number && (
                <Badge variant="outline" className="mt-2 text-green-400 border-green-400">
                  {formData.service_number}
                </Badge>
              )}
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
              <Label htmlFor="location" className="text-gray-300">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter location/base"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="contact_info" className="text-gray-300">Contact Information</Label>
            <Input
              id="contact_info"
              value={formData.contact_info}
              onChange={(e) => setFormData(prev => ({ ...prev, contact_info: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Phone number or other contact details"
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !formData.full_name || !formData.email || !formData.rank || !formData.unit || !formData.state || !formData.arm_of_service}
            className="w-full bg-dhq-blue hover:bg-blue-700"
          >
            {loading ? 'Processing...' : 'Register Commander'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CommanderRegistration;
