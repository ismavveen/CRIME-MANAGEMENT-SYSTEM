
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, Upload, User, Shield, Lock, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUnitCommanders } from '@/hooks/useUnitCommanders';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara'
];

const MILITARY_RANKS = [
  'Private', 'Lance Corporal', 'Corporal', 'Sergeant', 'Staff Sergeant', 'Warrant Officer',
  'Second Lieutenant', 'Lieutenant', 'Captain', 'Major', 'Lieutenant Colonel', 'Colonel',
  'Brigadier General', 'Major General', 'Lieutenant General', 'General'
];

const CommanderRegistration = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    rank: '',
    unit: '',
    state: '',
    email: '',
    contactInfo: '',
    specialization: '',
    location: '',
    serviceNumber: '',
    profileImage: null as File | null
  });
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { createCommander } = useUnitCommanders();

  const generateServiceNumber = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `DHQ${year}${random}`;
  };

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate service number if not provided
      if (!formData.serviceNumber) {
        setFormData({ ...formData, serviceNumber: generateServiceNumber() });
      }

      // Generate OTP for simulation
      const otp = generateOtp();
      setGeneratedOtp(otp);
      setOtpCode(otp);

      // Simulate email sending by showing the OTP
      toast({
        title: "Registration Initiated",
        description: `OTP generated: ${otp}. Please verify to continue.`,
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

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (enteredOtp !== generatedOtp) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct OTP code",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Email Verified",
      description: "Please create your password to complete registration",
    });
    setStep(3);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      // Create commander in database
      await createCommander({
        full_name: formData.fullName,
        rank: formData.rank,
        unit: formData.unit,
        state: formData.state,
        email: formData.email,
        specialization: formData.specialization,
        location: formData.location,
        contact_info: formData.contactInfo,
        service_number: formData.serviceNumber || generateServiceNumber(),
        status: 'active'
      });

      // Set password using edge function
      const { error: passwordError } = await supabase.functions.invoke('set-commander-password', {
        body: {
          email: formData.email,
          password: password
        }
      });

      if (passwordError) {
        throw passwordError;
      }

      toast({
        title: "Registration Complete",
        description: `Commander ${formData.fullName} has been successfully registered`,
      });

      // Reset form
      setFormData({
        fullName: '', rank: '', unit: '', state: '', email: '', 
        contactInfo: '', specialization: '', location: '', serviceNumber: '',
        profileImage: null
      });
      setProfileImagePreview(null);
      setPassword('');
      setConfirmPassword('');
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

  const copyOtpToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedOtp);
      setCopiedOtp(true);
      setTimeout(() => setCopiedOtp(false), 2000);
      toast({
        title: "OTP Copied",
        description: "OTP code copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy OTP to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="h-6 w-6 text-dhq-blue" />
          Register New Unit Commander
        </CardTitle>
        <CardDescription className="text-gray-400">
          Step {step} of 3: {step === 1 ? 'Personal Information' : step === 2 ? 'Email Verification' : 'Set Password'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-6">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {profileImagePreview ? (
                  <img 
                    src={profileImagePreview} 
                    alt="Profile preview" 
                    className="w-24 h-24 rounded-full object-cover border-2 border-dhq-blue"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-dhq-blue rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                  <Upload className="h-4 w-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <Label className="text-gray-300 text-sm">Profile Photo (Optional)</Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName" className="text-gray-300">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="rank" className="text-gray-300">Rank *</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, rank: value })}>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="serviceNumber" className="text-gray-300">Service Number</Label>
                <Input
                  id="serviceNumber"
                  value={formData.serviceNumber}
                  onChange={(e) => setFormData({ ...formData, serviceNumber: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter service number or leave blank to auto-generate"
                />
                <p className="text-xs text-gray-400 mt-1">Leave blank to auto-generate</p>
              </div>
              <div>
                <Label htmlFor="unit" className="text-gray-300">Unit *</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter unit designation"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state" className="text-gray-300">State *</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, state: value })}>
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactInfo" className="text-gray-300">Contact Information</Label>
                <Input
                  id="contactInfo"
                  value={formData.contactInfo}
                  onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Phone number"
                />
              </div>
              <div>
                <Label htmlFor="location" className="text-gray-300">Base Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Base or station location"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="specialization" className="text-gray-300">Specialization</Label>
              <Textarea
                id="specialization"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Area of expertise or specialization"
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full bg-dhq-blue hover:bg-blue-700" disabled={loading}>
              {loading ? 'Processing...' : 'Send Verification Email'}
            </Button>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <User className="h-16 w-16 text-dhq-blue mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Email Verification</h3>
              <p className="text-gray-400 mb-4">
                An OTP has been generated for {formData.email}
              </p>
              
              {/* Admin OTP Display */}
              <div className="bg-gray-900/50 p-4 rounded-lg border border-dhq-blue/30 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300 text-sm">Generated OTP (Admin View)</Label>
                    <p className="text-2xl font-mono text-dhq-blue font-bold">{generatedOtp}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyOtpToClipboard}
                    className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  >
                    {copiedOtp ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Copy this OTP and share with the personnel for verification
                </p>
              </div>
            </div>

            <form onSubmit={handleOtpVerification} className="space-y-4">
              <div>
                <Label htmlFor="otp" className="text-gray-300">Enter OTP Code</Label>
                <Input
                  id="otp"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white text-center text-lg tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1 bg-dhq-blue hover:bg-blue-700">
                  Verify Email
                </Button>
              </div>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <Lock className="h-16 w-16 text-dhq-blue mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Create Password</h3>
              <p className="text-gray-400 mb-4">
                Set a secure password for {formData.fullName}
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter password (min. 8 characters)"
                  minLength={8}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Confirm password"
                  minLength={8}
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1 bg-dhq-blue hover:bg-blue-700" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Complete Registration'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommanderRegistration;
