
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, MapPin, Clock, User, Phone, Image, Video, Download, ExternalLink } from 'lucide-react';

interface ReportDetailsModalProps {
  report: any;
  onClose: () => void;
}

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({ report, onClose }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "bg-dhq-red text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-yellow-500 text-black";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "bg-green-500 text-white";
      case "assigned":
        return "bg-blue-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const openInMaps = () => {
    if (report.latitude && report.longitude) {
      const url = `https://www.google.com/maps?q=${report.latitude},${report.longitude}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Dialog open={!!report} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl text-white mb-2">
                Report Details
              </DialogTitle>
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Serial Number:</span>
                <span className="font-mono text-dhq-blue text-lg">
                  {report.serial_number || `DHQ-${report.id?.slice(0, 8)}`}
                </span>
                <Badge className={`${getPriorityColor(report.priority || report.urgency)} text-sm`}>
                  {(report.priority || report.urgency || 'Medium').toUpperCase()} PRIORITY
                </Badge>
                <Badge className={`${getStatusColor(report.status)} text-sm`}>
                  {(report.status || 'Pending').toUpperCase()}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Threat Information */}
            <div className="bg-gray-900/60 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                Threat Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white font-medium">{report.threat_type}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-gray-400">Description:</span>
                  <div className="text-white max-w-md text-right">
                    {report.description}
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-gray-900/60 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-cyan-400" />
                Location Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">State:</span>
                  <span className="text-white">{report.state}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">LGA:</span>
                  <span className="text-white">{report.local_government}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-gray-400">Full Address:</span>
                  <div className="text-white max-w-md text-right">
                    {report.full_address || report.location || report.manual_location}
                  </div>
                </div>
                {report.landmark && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Landmark:</span>
                    <span className="text-white">{report.landmark}</span>
                  </div>
                )}
                {report.latitude && report.longitude && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Coordinates:</span>
                      <span className="text-white font-mono">
                        {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                      </span>
                    </div>
                    <Button 
                      onClick={openInMaps}
                      variant="outline" 
                      size="sm" 
                      className="w-full bg-transparent border-cyan-600 text-cyan-400"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Map
                    </Button>
                  </div>
                )}
                {report.location_accuracy && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">GPS Accuracy:</span>
                    <span className="text-white">±{report.location_accuracy.toFixed(0)}m</span>
                  </div>
                )}
              </div>
            </div>

            {/* Media Evidence */}
            {((report.images && report.images.length > 0) || (report.videos && report.videos.length > 0)) && (
              <div className="bg-gray-900/60 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <Image className="w-5 h-5 mr-2 text-green-400" />
                  Evidence Files
                </h3>
                
                {/* Images */}
                {report.images && report.images.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">
                      Images ({report.images.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {report.images.map((imageUrl: string, index: number) => (
                        <div key={index} className="relative group">
                          <img 
                            src={imageUrl} 
                            alt={`Evidence ${index + 1}`}
                            className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => window.open(imageUrl, '_blank')}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded flex items-center justify-center">
                            <ExternalLink className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Videos */}
                {report.videos && report.videos.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">
                      Videos ({report.videos.length})
                    </h4>
                    <div className="space-y-2">
                      {report.videos.map((videoUrl: string, index: number) => (
                        <div key={index} className="flex items-center justify-between bg-gray-800/50 p-2 rounded">
                          <div className="flex items-center">
                            <Video className="w-4 h-4 mr-2 text-blue-400" />
                            <span className="text-white">Video {index + 1}</span>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(videoUrl, '_blank')}
                            className="bg-transparent border-blue-600 text-blue-400"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reporter Information */}
            {!report.is_anonymous && (report.reporter_name || report.reporter_contact) && (
              <div className="bg-gray-900/60 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2 text-orange-400" />
                  Reporter Information
                </h3>
                <div className="space-y-2">
                  {report.reporter_name && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white">{report.reporter_name}</span>
                    </div>
                  )}
                  {report.reporter_contact && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Contact:</span>
                      <span className="text-white">{report.reporter_contact}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timeline & Status */}
            <div className="bg-gray-900/60 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-400" />
                Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Submitted:</span>
                  <span className="text-white text-sm">
                    {new Date(report.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Last Updated:</span>
                  <span className="text-white text-sm">
                    {new Date(report.updated_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Channel:</span>
                  <span className="text-white text-sm capitalize">
                    {report.reporter_type?.replace('_', ' ') || 'Web Portal'}
                  </span>
                </div>
              </div>
            </div>

            {/* Assignment Info */}
            <div className="bg-gray-900/60 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-3">Assignment Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Assigned To:</span>
                  <span className="text-white">
                    {report.assigned_to || 'Not assigned'}
                  </span>
                </div>
                {report.acknowledged_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Acknowledged:</span>
                    <span className="text-white text-sm">
                      {new Date(report.acknowledged_at).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* System Info */}
            <div className="bg-gray-900/60 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-3">System Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Report ID:</span>
                  <span className="text-white font-mono">{report.id?.slice(0, 8)}...</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Priority Level:</span>
                  <span className="text-white">{report.priority || report.urgency || 'Medium'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Anonymous:</span>
                  <span className="text-white">{report.is_anonymous ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetailsModal;
