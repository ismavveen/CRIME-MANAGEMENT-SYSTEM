
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUnitCommanders } from '@/hooks/useUnitCommanders';
import { supabase } from '@/integrations/supabase/client';
import CommanderRegistrationForm from './CommanderRegistrationForm';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  const { toast } = useToast();
  const { createCommander } = useUnitCommanders();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const validatePassword = (pwd: string) => {
    const requirements = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    };
    return {
      isValid: Object.values(requirements).every(req => req),
      requirements
    };
  };

  const passwordValidation = validatePassword(password);

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
    setError('');

    if (!passwordValidation.isValid) {
      setError('Password does not meet the security requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const { data: hashData, error: hashError } = await supabase.functions.invoke('set-commander-password', {
        body: { email: formData.email, password }
      });

      if (hashError) {
        throw new Error('Failed to secure password. Please try again.');
      }

      let profileImageUrl: string | null = null;
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

      await createCommander({
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

      const { error: emailError } = await supabase.functions.invoke('send-registration-complete-email', {
        body: {
          email: formData.email,
          fullName: formData.fullName,
          rank: formData.rank,
          unit: formData.unit,
          category: formData.armOfService
        }
      });

      if (emailError) {
        console.error('Email sending failed:', emailError);
        toast({
          title: "Warning: Email Failed",
          description: "Commander registered, but email notification failed. Please notify them manually.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Successful!",
          description: `${formData.fullName} has been registered and notified.`,
        });
      }

      navigate('/commander-portal');

    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || "Failed to register commander. The service number or email may already exist.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-dhq-blue" />
          Register New Unit Commander
        </CardTitle>
        <CardDescription className="text-gray-400">
          Add a new unit commander to the system and provide them with immediate portal access.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-700 text-red-300">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Registration Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <CommanderRegistrationForm
          formData={formData}
          setFormData={setFormData}
          profileImage={profileImage}
          handleImageUpload={handleImageUpload}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          passwordValidation={passwordValidation}
        />
      </CardContent>
    </Card>
  );
};

export default CommanderRegistration;
