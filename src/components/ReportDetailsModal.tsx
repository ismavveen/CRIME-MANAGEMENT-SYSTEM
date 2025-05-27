
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, MapPin, Clock, User, AlertTriangle, CheckCircle, ZoomIn, Play, Download } from 'lucide-react';
import { Report } from '@/hooks/useReports';

interface ReportDetailsModalProps {
  report: Report;
  onClose: () => void;
}

const ReportDetailsModal = ({ report, onClose }: ReportDetailsModalProps) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);
  const [imageZoomed, setImageZoomed] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'assigned':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const downloadMedia = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl text-white flex items-center gap-2">
            {getStatusIcon(report.status)}
            Report Details - {report.id.slice(0, 8)}
          </DialogTitle>
          <Button variant="ghost" onClick={onClose} className="h-6 w-6 p-0">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Basic Info */}
          <div className="flex items-center justify-between">
            <Badge className={`px-3 py-1 border ${getStatusColor(report.status)}`}>
              {report.status?.toUpperCase()}
            </Badge>
            <div className="text-sm text-gray-400">
              {formatDateTime(report.created_at)}
            </div>
          </div>

          {/* Report Description */}
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-cyan-400">Description</h3>
            <p className="text-gray-300">{report.description}</p>
          </div>

          {/* Location and Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-cyan-400 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location Details
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-400">State:</span> {report.state}</p>
                <p><span className="text-gray-400">LGA:</span> {report.local_government}</p>
                <p><span className="text-gray-400">Address:</span> {report.full_address}</p>
                {report.landmark && <p><span className="text-gray-400">Landmark:</span> {report.landmark}</p>}
                {report.latitude && report.longitude && (
                  <p><span className="text-gray-400">Coordinates:</span> {report.latitude}, {report.longitude}</p>
                )}
              </div>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-cyan-400">Report Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-400">Threat Type:</span> {report.threat_type}</p>
                <p><span className="text-gray-400">Urgency:</span> {report.urgency}</p>
                <p><span className="text-gray-400">Priority:</span> {report.priority}</p>
                <p><span className="text-gray-400">Reporter Type:</span> {report.reporter_type}</p>
                {report.assigned_to && <p><span className="text-gray-400">Assigned To:</span> {report.assigned_to}</p>}
              </div>
            </div>
          </div>

          {/* Media Section */}
          {(report.images?.length > 0 || report.videos?.length > 0) && (
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4 text-cyan-400">Evidence & Media</h3>
              
              {/* Images */}
              {report.images && report.images.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Images ({report.images.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {report.images.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Evidence ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            setImageIndex(index);
                            setImageZoomed(true);
                          }}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <ZoomIn className="h-6 w-6 text-white" />
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadMedia(imageUrl, `evidence-image-${index + 1}.jpg`);
                          }}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {report.videos && report.videos.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Videos ({report.videos.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {report.videos.map((videoUrl, index) => (
                      <div key={index} className="relative group">
                        <video
                          controls
                          className="w-full h-48 object-cover rounded-lg bg-gray-900"
                          preload="metadata"
                        >
                          <source src={videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => downloadMedia(videoUrl, `evidence-video-${index + 1}.mp4`)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {report.status !== 'resolved' && (
              <>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Assign Unit
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  Mark Resolved
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Image Zoom Modal */}
        {imageZoomed && report.images && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setImageZoomed(false)}
          >
            <div className="relative max-w-4xl max-h-full">
              <img
                src={report.images[imageIndex]}
                alt={`Evidence ${imageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
              <Button
                variant="outline"
                className="absolute top-4 right-4"
                onClick={() => setImageZoomed(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              {report.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {report.images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index === imageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageIndex(index);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetailsModal;
