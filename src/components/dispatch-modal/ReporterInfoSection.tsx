
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Phone, Mail } from 'lucide-react';

interface ReporterInfoSectionProps {
  report: any;
}

const ReporterInfoSection = ({ report }: ReporterInfoSectionProps) => {
  return (
    <Card className="bg-gray-900/50 border-gray-700/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-gray-400 flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>Reporter Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {report.is_anonymous ? (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 mx-auto mb-4 text-cyan-400" />
            <p className="text-white font-medium mb-2">Anonymous Report</p>
            <p className="text-gray-400 text-sm">
              Reporter identity is protected for security purposes
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.reporter_name && (
                <div>
                  <p className="text-gray-400 text-xs">Reporter Name</p>
                  <p className="text-white font-medium">{report.reporter_name}</p>
                </div>
              )}
              {report.reporter_phone && (
                <div>
                  <p className="text-gray-400 text-xs flex items-center space-x-1">
                    <Phone className="h-3 w-3" />
                    <span>Phone Number</span>
                  </p>
                  <p className="text-white font-medium">{report.reporter_phone}</p>
                </div>
              )}
              {report.reporter_email && (
                <div>
                  <p className="text-gray-400 text-xs flex items-center space-x-1">
                    <Mail className="h-3 w-3" />
                    <span>Email Address</span>
                  </p>
                  <p className="text-white font-medium">{report.reporter_email}</p>
                </div>
              )}
              <div>
                <p className="text-gray-400 text-xs">Reporter Type</p>
                <p className="text-white font-medium">{report.reporter_type || 'Web Application'}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReporterInfoSection;
