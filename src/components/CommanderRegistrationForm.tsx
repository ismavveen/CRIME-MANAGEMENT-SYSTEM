
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Shield, UserPlus } from 'lucide-react';
import { NIGERIAN_STATES, MILITARY_RANKS } from '@/lib/constants';

interface CommanderFormData {
  fullName: string;
  rank: string;
  unit: string;
  state: string;
  email: string;
  serviceNumber: string;
  armOfService: string;
  specialization: string;
  location: string;
  contactInfo: string;
}

interface CommanderRegistrationFormProps {
  formData: CommanderFormData;
  setFormData: React.Dispatch<React.SetStateAction<CommanderFormData>>;
  profileImage: File | null;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const CommanderRegistrationForm: React.FC<CommanderRegistrationFormProps> = ({
  formData,
  setFormData,
  profileImage,
  handleImageUpload,
  handleSubmit,
  isLoading,
}) => {
  return (
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
  );
};

export default CommanderRegistrationForm;
