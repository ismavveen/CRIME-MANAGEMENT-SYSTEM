
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationInfoSectionProps {
  report: any;
}

const LocationInfoSection = ({ report }: LocationInfoSectionProps) => {
  const openInMaps = () => {
    if (report.latitude && report.longitude) {
      const url = `https://www.google.com/maps?q=${report.latitude},${report.longitude}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Card className="bg-gray-900/50 border-gray-700/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-gray-400 flex items-center space-x-2">
          <MapPin className="h-4 w-4" />
          <span>Location Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-xs">State</p>
            <p className="text-white font-medium">{report.state || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Local Government</p>
            <p className="text-white font-medium">{report.local_government || 'Not specified'}</p>
          </div>
        </div>
        
        <div>
          <p className="text-gray-400 text-xs">Full Address</p>
          <p className="text-white bg-gray-800/50 p-2 rounded">
            {report.full_address || report.location || report.manual_location || 'Address not provided'}
          </p>
        </div>

        {report.landmark && (
          <div>
            <p className="text-gray-400 text-xs">Landmark</p>
            <p className="text-white bg-gray-800/50 p-2 rounded">{report.landmark}</p>
          </div>
        )}

        {(report.latitude && report.longitude) && (
          <div className="space-y-2">
            <div>
              <p className="text-gray-400 text-xs">Coordinates</p>
              <p className="text-cyan-300 font-mono text-sm">
                {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
              </p>
            </div>
            {report.location_accuracy && (
              <div>
                <p className="text-gray-400 text-xs">GPS Accuracy</p>
                <p className="text-white">±{report.location_accuracy.toFixed(0)}m</p>
              </div>
            )}
            <Button
              onClick={openInMaps}
              variant="outline"
              size="sm"
              className="w-full bg-transparent border-cyan-600 text-cyan-400 hover:bg-cyan-900/20 hover:text-cyan-300"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Map
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationInfoSection;
