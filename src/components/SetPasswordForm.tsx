
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SetPasswordFormProps {
  email: string;
  onPasswordSet: () => void;
}

const SetPasswordForm: React.FC<SetPasswordFormProps> = ({ email, onPasswordSet }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!passwordValidation.isValid) {
      setError('Password does not meet the requirements');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Call the set-password edge function
      const { data, error } = await supabase.functions.invoke('set-commander-password', {
        body: { email, password }
      });

      if (error) throw error;

      toast({
        title: "Password Set Successfully",
        description: "You can now log in to the commanders portal",
      });

      onPasswordSet();
    } catch (error: any) {
      console.error('Error setting password:', error);
      setError(error.message || 'Failed to set password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dhq-dark-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Set Your Password</CardTitle>
          <CardDescription className="text-gray-400">
            Create a secure password for your account: {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
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
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
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
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-400">Password Requirements:</Label>
              <div className="space-y-1 text-xs">
                {Object.entries({
                  length: 'At least 8 characters',
                  uppercase: 'One uppercase letter',
                  lowercase: 'One lowercase letter',
                  number: 'One number',
                  special: 'One special character'
                }).map(([key, description]) => (
                  <div key={key} className="flex items-center space-x-2">
                    {passwordValidation.requirements[key as keyof typeof passwordValidation.requirements] ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-gray-500" />
                    )}
                    <span className={passwordValidation.requirements[key as keyof typeof passwordValidation.requirements] ? 'text-green-400' : 'text-gray-400'}>
                      {description}
                    </span>
                  </div>
                ))}
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
              disabled={isLoading || !passwordValidation.isValid || password !== confirmPassword}
              className="w-full bg-dhq-blue hover:bg-blue-700"
            >
              {isLoading ? 'Setting Password...' : 'Set Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetPasswordForm;
