import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Eye, EyeOff, Shield } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CommanderPasswordSetup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [commander, setCommander] = useState<any>(null);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');
    
    if (emailParam && tokenParam) {
      setEmail(emailParam);
      setToken(tokenParam);
      verifyTokenAndLoadCommander(emailParam, tokenParam);
    } else {
      setError('Invalid setup link. Please contact administrator.');
    }
  }, [searchParams]);

  const verifyTokenAndLoadCommander = async (email: string, token: string) => {
    try {
      // Verify token and get commander info
      const { data, error } = await supabase
        .from('unit_commanders')
        .select('*')
        .eq('email', email)
        .eq('status', 'active')
        .single();

      if (error) throw new Error('Commander not found or inactive');
      
      setCommander(data);
    } catch (error: any) {
      setError('Invalid setup link or commander not found');
    }
  };

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
      // Hash password using Supabase Edge Function (bcrypt)
      const { data: hashData, error: hashError } = await supabase.functions.invoke('set-commander-password', {
        body: { email, password }
      });

      if (hashError) throw hashError;

      // Update commander's password in DB
      const { error: updateError } = await supabase
        .from('unit_commanders')
        .update({ 
          password_hash: hashData.hash,
          updated_at: new Date().toISOString()
        })
        .eq('email', email);

      if (updateError) throw updateError;

      toast({
        title: "Password Set Successfully",
        description: "You can now log in to the commanders portal",
      });

      // Redirect to commander login
      navigate('/commander-portal');
    } catch (error: any) {
      console.error('Error setting password:', error);
      setError(error.message || 'Failed to set password');
    } finally {
      setIsLoading(false);
    }
  };

  if (error && !commander) {
    return (
      <div className="min-h-screen bg-dhq-dark-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-white text-2xl">Setup Link Invalid</CardTitle>
            <CardDescription className="text-gray-400">
              {error}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dhq-dark-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-dhq-blue rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-white text-2xl">Set Your Password</CardTitle>
          <CardDescription className="text-gray-400">
            {commander && (
              <>Welcome {commander.rank} {commander.full_name}<br/></>
            )}
            Create a secure password for your commander account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">New Password</Label>
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
              {isLoading ? 'Setting Password...' : 'Set Password & Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommanderPasswordSetup;
