
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Shield, Mail, Key, User, CheckCircle } from 'lucide-react';

const CommanderRegistration = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    service_number: '',
    category: '',
    rank: '',
    unit: '',
    state: '',
    specialization: '',
    location: ''
  });

  const militaryRanks = {
    "Air Force": [
      "Air Chief Marshal",
      "Air Marshal", 
      "Air Vice Marshal",
      "Air Commodore",
      "Group Captain",
      "Wing Commander",
      "Squadron Leader",
      "Flight Lieutenant",
      "Flying Officer",
      "Pilot Officer"
    ],
    "Navy": [
      "Admiral",
      "Vice Admiral",
      "Rear Admiral",
      "Commodore", 
      "Captain",
      "Commander",
      "Lieutenant Commander",
      "Lieutenant",
      "Sub-Lieutenant",
      "Midshipman"
    ],
    "Army": [
      "Field Marshal",
      "General",
      "Lieutenant General", 
      "Major General",
      "Brigadier",
      "Colonel",
      "Lieutenant Colonel",
      "Major",
      "Captain",
      "Lieutenant",
      "Second Lieutenant"
    ]
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const generateServiceNumber = (category: string) => {
    const prefix = category === 'Air Force' ? 'AF' : category === 'Navy' ? 'NN' : 'NA';
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}/${new Date().getFullYear()}/${randomNum}`;
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const sendOTPEmail = async () => {
    try {
      const otp = generateOTP();
      setGeneratedOtp(otp);

      const { error } = await supabase.functions.invoke('send-otp-verification', {
        body: {
          email: formData.email,
          fullName: formData.full_name,
          otpCode: otp
        }
      });

      if (error) {
        console.error('OTP email sending failed:', error);
        toast({
          title: "OTP Sending Failed",
          description: "Failed to send verification code. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('OTP generation error:', error);
      return false;
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields for OTP step
    if (!formData.full_name || !formData.email || !formData.category || !formData.rank || !formData.state) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before verification.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Check for duplicate email or service number
    const { data: existingCommanders, error: checkError } = await supabase
      .from('unit_commanders')
      .select('email, service_number')
      .or(`email.eq.${formData.email},service_number.eq.${formData.service_number || generateServiceNumber(formData.category)}`);

    if (checkError) {
      toast({
        title: "Verification Failed",
        description: "Error checking existing records.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (existingCommanders && existingCommanders.length > 0) {
      toast({
        title: "Duplicate Entry",
        description: "Email or service number already exists.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const otpSent = await sendOTPEmail();
    if (otpSent) {
      setOtpStep(true);
      toast({
        title: "Verification Code Sent",
        description: `A 6-digit code has been sent to ${formData.email}`,
      });
    }

    setIsSubmitting(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingOtp(true);

    if (otpCode !== generatedOtp) {
      toast({
        title: "Invalid Code",
        description: "The verification code is incorrect. Please try again.",
        variant: "destructive",
      });
      setIsVerifyingOtp(false);
      return;
    }

    try {
      // Generate credentials
      const serviceNumber = formData.service_number || generateServiceNumber(formData.category);
      const generatedPassword = generatePassword();

      // Create commander profile
      const { data: commanderData, error: commanderError } = await supabase
        .from('unit_commanders')
        .insert({
          full_name: formData.full_name,
          email: formData.email,
          service_number: serviceNumber,
          rank: formData.rank,
          unit: formData.unit,
          state: formData.state,
          category: formData.category,
          specialization: formData.specialization || null,
          location: formData.location || null,
          contact_info: formData.phone_number || null,
          status: 'active'
        })
        .select()
        .single();

      if (commanderError) throw commanderError;

      // Send credentials email
      const { error: credentialsError } = await supabase.functions.invoke('send-commander-credentials', {
        body: {
          email: formData.email,
          fullName: formData.full_name,
          password: generatedPassword,
          serviceNumber: serviceNumber,
          rank: formData.rank,
          unit: formData.unit,
          category: formData.category
        }
      });

      if (credentialsError) {
        console.error('Credentials email failed:', credentialsError);
        toast({
          title: "Registration Successful",
          description: "Commander registered but credentials email failed. Please contact them manually.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Complete",
          description: `${formData.full_name} has been successfully registered and credentials sent.`,
        });
      }

      // Reset form
      setFormData({
        full_name: '',
        email: '',
        phone_number: '',
        service_number: '',
        category: '',
        rank: '',
        unit: '',
        state: '',
        specialization: '',
        location: ''
      });
      setOtpStep(false);
      setOtpCode('');
      setGeneratedOtp('');

    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register commander",
        variant: "destructive",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Reset rank when category changes
      if (field === 'category') {
        updated.rank = '';
        // Auto-generate service number if not provided
        if (!updated.service_number) {
          updated.service_number = generateServiceNumber(value);
        }
      }
      
      return updated;
    });
  };

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
    'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
    'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
    'Yobe', 'Zamfara'
  ];

  if (otpStep) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Email Verification
          </CardTitle>
          <CardDescription className="text-gray-400">
            Enter the 6-digit code sent to {formData.email}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <Label htmlFor="otp" className="text-gray-300">Verification Code</Label>
              <Input
                id="otp"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOtpStep(false)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isVerifyingOtp || otpCode.length !== 6}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isVerifyingOtp ? 'Verifying...' : 'Verify & Register'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700 max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Register New Unit Commander
        </CardTitle>
        <CardDescription className="text-gray-400">
          Register a new commander with email verification and automatic credential generation
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSendOTP} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="full_name" className="text-gray-300">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-300">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="phone_number" className="text-gray-300">Phone Number</Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="+234 xxx xxx xxxx"
              />
            </div>
            <div>
              <Label htmlFor="service_number" className="text-gray-300">Service Number</Label>
              <Input
                id="service_number"
                value={formData.service_number}
                onChange={(e) => handleInputChange('service_number', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Auto-generated if empty"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="category" className="text-gray-300">Military Branch *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Air Force">Air Force</SelectItem>
                  <SelectItem value="Navy">Navy</SelectItem>
                  <SelectItem value="Army">Army</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="rank" className="text-gray-300">Rank *</Label>
              <Select value={formData.rank} onValueChange={(value) => handleInputChange('rank', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select rank" />
                </SelectTrigger>
                <SelectContent>
                  {formData.category && militaryRanks[formData.category as keyof typeof militaryRanks]?.map(rank => (
                    <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="unit" className="text-gray-300">Unit/Division</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="e.g., 7th Division, 82nd Airborne"
              />
            </div>
            <div>
              <Label htmlFor="state" className="text-gray-300">State *</Label>
              <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {nigerianStates.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="specialization" className="text-gray-300">Specialization</Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e) => handleInputChange('specialization', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="e.g., Counter-terrorism, Intelligence"
              />
            </div>
            <div>
              <Label htmlFor="location" className="text-gray-300">Base Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="e.g., Lagos Cantonment"
              />
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-700/50 p-6 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-300 mb-3">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Registration Process</span>
            </div>
            <div className="space-y-2 text-sm text-blue-200">
              <p>• Email verification required before registration</p>
              <p>• Service number auto-generated based on military branch</p>
              <p>• Secure credentials automatically generated and emailed</p>
              <p>• Login available with email or service number</p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !formData.full_name || !formData.email || !formData.category || !formData.rank || !formData.state}
            className="w-full bg-blue-600 hover:bg-blue-700 h-12"
          >
            {isSubmitting ? (
              <>
                <Mail className="h-5 w-5 mr-2 animate-pulse" />
                Sending Verification Code...
              </>
            ) : (
              <>
                <Mail className="h-5 w-5 mr-2" />
                Send Verification Code
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CommanderRegistration;
