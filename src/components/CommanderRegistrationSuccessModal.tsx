
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Shield, CheckCircle, Users } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';

interface RegisteredCommanderInfo {
  full_name: string;
  email: string;
  rank: string;
  service_number: string;
  state: string;
  unit: string;
  arm_of_service: string;
}

interface SuccessModalProps {
  show: boolean;
  onClose: () => void;
  commander: RegisteredCommanderInfo | null;
}

const CommanderRegistrationSuccessModal: React.FC<SuccessModalProps> = ({ show, onClose, commander }) => {
  const { toast } = useToast();

  if (!show || !commander) return null;

  const handleCopyEmail = () => {
    if (commander.email) {
      navigator.clipboard.writeText(commander.email);
      toast({ title: "Email copied to clipboard" });
    }
  };

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
              <strong>{commander.rank} {commander.full_name}</strong> has been successfully registered as a Unit Commander for <strong>{commander.state} State</strong>.
            </AlertDescription>
          </Alert>

          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="h-5 w-5 text-blue-400" />
              <span className="text-blue-400 font-semibold text-lg">📧 Email Notification Sent</span>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              A comprehensive welcome email has been sent to <strong className="text-blue-300">{commander.email}</strong> containing:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-3">
                <h4 className="text-white font-medium mb-2">🔑 Account Details</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Service Number: {commander.service_number}</li>
                  <li>• Email: {commander.email}</li>
                  <li>• Login: via secure setup link in email</li>
                  <li>• Military branch: {commander.arm_of_service}</li>
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
              <p>• They will only see reports and data from <strong>{commander.state} State</strong>.</p>
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
                <span className="text-white ml-2">{commander.rank} {commander.full_name}</span>
              </div>
              <div>
                <span className="text-gray-400">State:</span>
                <span className="text-white ml-2">{commander.state}</span>
              </div>
              <div>
                <span className="text-gray-400">Unit:</span>
                <span className="text-white ml-2">{commander.unit}</span>
              </div>
              <div>
                <span className="text-gray-400">Service:</span>
                <span className="text-white ml-2">{commander.arm_of_service}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onClose}
              className="flex-1 bg-dhq-blue hover:bg-blue-700"
            >
              Close
            </Button>
            <Button
              variant="outline"
              onClick={handleCopyEmail}
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

export default CommanderRegistrationSuccessModal;
