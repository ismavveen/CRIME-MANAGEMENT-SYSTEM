
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CommanderLoginFormProps {
  onLoginSuccess: (commander: any) => void;
}

const CommanderLoginForm: React.FC<CommanderLoginFormProps> = ({ onLoginSuccess }) => {
  const [emailOrServiceNumber, setEmailOrServiceNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Determine if input is email or service number
      const isEmail = emailOrServiceNumber.includes('@');
      
      let query = supabase
        .from('unit_commanders')
        .select('*')
        .eq('status', 'active');

      if (isEmail) {
        query = query.eq('email', emailOrServiceNumber);
      } else {
        query = query.eq('service_number', emailOrServiceNumber);
      }

      const { data: commanders, error } = await query;

      if (error) throw error;

      if (!commanders || commanders.length === 0) {
        throw new Error('Invalid credentials or account not found');
      }

      const commander = commanders[0];

      // Verify password using the set-commander-password function
      const { data: verificationResult, error: verificationError } = await supabase.functions.invoke('verify-commander-password', {
        body: { 
          email: commander.email, 
          password,
          passwordHash: commander.password_hash 
        }
      });

      if (verificationError || !verificationResult?.valid) {
        throw new Error('Invalid password');
      }

      toast({
        title: "Login Successful",
        description: `Welcome back, ${commander.full_name}`,
      });

      onLoginSuccess(commander);
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dhq-dark-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-dhq-blue rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-white text-2xl">Unit Commander Portal</CardTitle>
          <CardDescription className="text-gray-400">
            Login using your email or service number
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="emailOrServiceNumber" className="text-gray-300">Email or Service Number</Label>
              <Input
                id="emailOrServiceNumber"
                type="text"
                value={emailOrServiceNumber}
                onChange={(e) => setEmailOrServiceNumber(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter email or service number"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-300">Password</Label>
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
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-dhq-blue hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              For support, contact DHQ IT Support
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Authorized personnel only
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommanderLoginForm;
