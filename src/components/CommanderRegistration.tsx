
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUnitCommanders } from '@/hooks/useUnitCommanders';
import { supabase } from '@/integrations/supabase/client';
import CommanderRegistrationForm from './CommanderRegistrationForm';
import CommanderRegistrationSuccessModal from './CommanderRegistrationSuccessModal';

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
        password_hash: null,
        profile_image: profileImageUrl,
        status: 'active'
      });

      const { error: emailError } = await supabase.functions.invoke('send-commander-credentials', {
        body: {
          email: formData.email,
          fullName: formData.fullName,
          password: null, 
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
        full_name: formData.fullName,
        email: formData.email,
        rank: formData.rank,
        service_number: formData.serviceNumber,
        state: formData.state,
        unit: formData.unit,
        arm_of_service: formData.armOfService
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
          <CommanderRegistrationForm
            formData={formData}
            setFormData={setFormData}
            profileImage={profileImage}
            handleImageUpload={handleImageUpload}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <CommanderRegistrationSuccessModal
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        commander={registeredCommander}
      />
    </>
  );
};

export default CommanderRegistration;
