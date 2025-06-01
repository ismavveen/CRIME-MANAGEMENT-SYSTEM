import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle, Users } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SetPasswordForm from './SetPasswordForm';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

const SERVICE_CATEGORIES = {
  'Army': ['Second Lieutenant', 'Lieutenant', 'Captain', 'Major', 'Lieutenant Colonel', 'Colonel'],
  'Navy': ['Midshipman', 'Sub-Lieutenant', 'Lieutenant', 'Lieutenant Commander', 'Commander', 'Captain'],
  'Air Force': ['Pilot Officer', 'Flying Officer', 'Flight Lieutenant', 'Squadron Leader', 'Wing Commander', 'Group Captain']
};

type RegistrationStep = 'form' | 'otp' | 'password' | 'success';

const CommanderRegistration = () => {
  const [step, setStep] = useState<RegistrationStep>('form');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    state: '',
    unit: '',
    category: '',
    rank: '',
    contact_info: '',
    service_number: ''
  });
  const [otpCode, setOtpCode] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const generateServiceNumber = (category: string, state: string) => {
    const categoryCode = category.substring(0, 2).toUpperCase();
    const stateCode = state.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${categoryCode}${stateCode}${randomNum}`;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Generate service number
      const serviceNumber = generateServiceNumber(formData.category, formData.state);
      setFormData(prev => ({ ...prev, service_number: serviceNumber }));

      // Generate and send OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setSentOtp(otp);

      const { error } = await supabase.functions.invoke('send-otp-verification', {
        body: {
          email: formData.email,
          name: formData.full_name,
          otp: otp
        }
      });

      if (error) throw error;

      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code",
      });

      setStep('otp');
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      setError(error.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otpCode !== sentOtp) {
      setError('Invalid OTP code');
      return;
    }

    setIsLoading(true);

    try {
      // Create the commander record without password
      const { error } = await supabase
        .from('unit_commanders')
        .insert([{
          ...formData,
          status: 'pending_password' // Mark as pending password setup
        }]);

      if (error) throw error;

      toast({
        title: "Email Verified",
        description: "Please set your password to complete registration",
      });

      setStep('password');
    } catch (error: any) {
      console.error('Error creating commander:', error);
      setError(error.message || 'Failed to create commander account');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSet = () => {
    setStep('success');
    toast({
      title: "Registration Complete",
      description: "Your account has been created successfully. You can now log in.",
    });
  };

  const resetForm = () => {
    setStep('form');
    setFormData({
      full_name: '',
      email: '',
      state: '',
      unit: '',
      category: '',
      rank: '',
      contact_info: '',
      service_number: ''
    });
    setOtpCode('');
    setSentOtp('');
    setError('');
  };

  if (step === 'password') {
    return <SetPasswordForm email={formData.email} onPasswordSet={handlePasswordSet} />;
  }

  if (step === 'success') {
    return (
      <div className="space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Registration Complete!</CardTitle>
            <CardDescription className="text-gray-400">
              Commander account has been successfully created
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-900/20 border border-green-700/50 p-4 rounded-lg">
              <h4 className="font-medium text-green-300 mb-2">Account Details</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <p><strong>Name:</strong> {formData.full_name}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Service Number:</strong> {formData.service_number}</p>
                <p><strong>State:</strong> {formData.state}</p>
                <p><strong>Rank:</strong> {formData.rank}</p>
              </div>
            </div>
            <Button 
              onClick={resetForm} 
              className="w-full bg-dhq-blue hover:bg-blue-700"
            >
              Register Another Commander
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-dhq-blue" />
            <div>
              <CardTitle className="text-2xl font-bold text-white">
                {step === 'form' ? 'Register Response Unit Commander' : 'Verify Email Address'}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {step === 'form' 
                  ? 'Add a new field response unit commander to the system'
                  : 'Enter the OTP code sent to your email address'
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {step === 'form' && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-white">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-white">State *</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white">Service Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value, rank: '' }))}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select service category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(SERVICE_CATEGORIES).map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rank" className="text-white">Rank *</Label>
                  <Select 
                    value={formData.rank} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, rank: value }))}
                    disabled={!formData.category}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select rank" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.category && SERVICE_CATEGORIES[formData.category as keyof typeof SERVICE_CATEGORIES].map((rank) => (
                        <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit" className="text-white">Unit/Division *</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="e.g., 82nd Division, Naval Base"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="contact_info" className="text-white">Contact Information</Label>
                  <Input
                    id="contact_info"
                    value={formData.contact_info}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_info: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Phone number or other contact details"
                  />
                </div>
              </div>

              {error && (
                <Alert className="bg-red-900/20 border-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-300">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-dhq-blue hover:bg-blue-700"
              >
                {isLoading ? 'Sending OTP...' : 'Send Verification Code'}
              </Button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpVerification} className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-gray-300">
                  We've sent a 6-digit verification code to:
                </p>
                <p className="font-semibold text-white">{formData.email}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp" className="text-white">Verification Code</Label>
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

              {error && (
                <Alert className="bg-red-900/20 border-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-300">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('form')}
                  className="flex-1 bg-transparent border-gray-600 text-gray-300"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || otpCode.length !== 6}
                  className="flex-1 bg-dhq-blue hover:bg-blue-700"
                >
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommanderRegistration;
