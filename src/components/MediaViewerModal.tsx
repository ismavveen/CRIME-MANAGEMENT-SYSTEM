
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ZoomIn, ZoomOut, RotateCw, Download, Eye, Play, Pause } from 'lucide-react';
import ImageAnalysisModal from './ImageAnalysisModal';

interface MediaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  reportId: string;
  reportDetails?: {
    threat_type: string;
    location: string;
    created_at: string;
    description: string;
  };
}

const MediaViewerModal = ({ 
  isOpen, 
  onClose, 
  mediaUrl, 
  mediaType, 
  reportId, 
  reportDetails 
}: MediaViewerModalProps) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 300));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = mediaUrl;
    link.download = `evidence-${reportId}-${Date.now()}.${mediaType === 'image' ? 'jpg' : 'mp4'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[95vh] bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center justify-between">
              <span>Evidence Viewer - Report {reportId.slice(0, 8)}</span>
              <div className="flex items-center space-x-2">
                {reportDetails && (
                  <Badge className="bg-blue-600 text-white">
                    {reportDetails.threat_type}
                  </Badge>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Media Controls */}
            <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                {mediaType === 'image' && (
                  <>
                    <Button size="sm" variant="outline" onClick={handleZoomOut}>
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className="text-white text-sm">{zoom}%</span>
                    <Button size="sm" variant="outline" onClick={handleZoomIn}>
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleRotate}>
                      <RotateCw className="w-4 h-4" />
                    </Button>
                  </>
                )}
                <Button size="sm" variant="outline" onClick={handleDownload}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              
              {mediaType === 'image' && (
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setShowAnalysis(true)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Analyze Image
                </Button>
              )}
            </div>

            {/* Media Display */}
            <div className="relative bg-black rounded-lg overflow-hidden" style={{ minHeight: '400px' }}>
              {mediaType === 'image' ? (
                <img
                  src={mediaUrl}
                  alt="Evidence"
                  className="w-full h-auto max-h-[600px] object-contain mx-auto"
                  style={{
                    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                    transition: 'transform 0.3s ease'
                  }}
                />
              ) : (
                <video
                  src={mediaUrl}
                  controls
                  className="w-full h-auto max-h-[600px] object-contain mx-auto"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            {/* Report Details */}
            {reportDetails && (
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-white font-semibold mb-3">Report Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Location: </span>
                    <span className="text-white">{reportDetails.location}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Reported: </span>
                    <span className="text-white">
                      {new Date(reportDetails.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-400">Description: </span>
                    <span className="text-white">{reportDetails.description}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Analysis Modal */}
      {mediaType === 'image' && (
        <ImageAnalysisModal
          isOpen={showAnalysis}
          onClose={() => setShowAnalysis(false)}
          reportId={reportId}
          imageUrl={mediaUrl}
        />
      )}
    </>
  );
};

export default MediaViewerModal;
