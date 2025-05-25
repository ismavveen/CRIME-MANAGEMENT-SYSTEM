
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Shield, Mail, Key, User } from 'lucide-react';

const CommanderRegistration = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    rank: '',
    unit: '',
    state: '',
    specialization: '',
    location: ''
  });

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate password
      const generatedPassword = generatePassword();

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: generatedPassword,
        email_confirm: true,
        user_metadata: {
          full_name: formData.full_name,
          role: 'commander',
          unit: formData.unit,
          state: formData.state
        }
      });

      if (authError) throw authError;

      // Create commander profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone_number,
          rank: formData.rank,
          unit: formData.unit,
          role: 'commander'
        });

      if (profileError) throw profileError;

      // Create unit commander record
      const { error: commanderError } = await supabase
        .from('unit_commanders')
        .insert({
          full_name: formData.full_name,
          rank: formData.rank,
          unit: formData.unit,
          specialization: formData.specialization || null,
          location: formData.location || null,
          contact_info: formData.phone_number || null,
          status: 'active'
        });

      if (commanderError) throw commanderError;

      // TODO: Send email with credentials (implement email service)
      // For now, show the password in the toast
      toast({
        title: "Commander Registered Successfully",
        description: `Password: ${generatedPassword} (Save this password!)`,
        duration: 10000,
      });

      // Reset form
      setFormData({
        full_name: '',
        email: '',
        phone_number: '',
        rank: '',
        unit: '',
        state: '',
        specialization: '',
        location: ''
      });

    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register commander",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
    'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
    'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
    'Yobe', 'Zamfara'
  ];

  return (
    <Card className="bg-gray-800/50 border-gray-700 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Register New Unit Commander
        </CardTitle>
        <CardDescription className="text-gray-400">
          Register a new commander and automatically generate login credentials
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone_number" className="text-gray-300">Phone Number</Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="rank" className="text-gray-300">Rank *</Label>
              <Select value={formData.rank} onValueChange={(value) => handleInputChange('rank', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select rank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lieutenant">Lieutenant</SelectItem>
                  <SelectItem value="Captain">Captain</SelectItem>
                  <SelectItem value="Major">Major</SelectItem>
                  <SelectItem value="Colonel">Colonel</SelectItem>
                  <SelectItem value="Brigadier">Brigadier</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unit" className="text-gray-300">Unit/Division *</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="e.g., 7th Division, 82nd Airborne"
                required
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

          <div className="grid grid-cols-2 gap-4">
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

          <div className="bg-blue-900/20 border border-blue-700/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-300 mb-2">
              <Key className="h-4 w-4" />
              <span className="font-medium">Automatic Credential Generation</span>
            </div>
            <p className="text-sm text-blue-200">
              A secure password will be automatically generated and displayed after registration. 
              The commander can use their email and generated password to access their portal.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !formData.full_name || !formData.email || !formData.rank || !formData.unit || !formData.state}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <User className="h-4 w-4 mr-2 animate-spin" />
                Registering Commander...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Register Commander
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CommanderRegistration;
