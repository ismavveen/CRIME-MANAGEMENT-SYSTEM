
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ZoomIn, ZoomOut, RotateCw, Download, Eye, Play, Pause, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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
  const [scanStatus, setScanStatus] = useState<'scanning' | 'clean' | 'infected' | 'suspicious' | 'error'>('scanning');
  const [scanDetails, setScanDetails] = useState<any>(null);

  useEffect(() => {
    if (isOpen && mediaUrl) {
      performVirusScan();
    }
  }, [isOpen, mediaUrl]);

  const performVirusScan = async () => {
    try {
      setScanStatus('scanning');
      
      const { data, error } = await supabase.functions.invoke('scan-file', {
        body: {
          fileUrl: mediaUrl,
          reportId: reportId,
          fileType: mediaType === 'image' ? 'image/jpeg' : 'video/mp4'
        }
      });

      if (error) {
        console.error('Scan error:', error);
        setScanStatus('error');
        return;
      }

      setScanDetails(data);
      setScanStatus(data.scanResult);
    } catch (error) {
      console.error('Failed to scan file:', error);
      setScanStatus('error');
    }
  };

  const getScanStatusBadge = () => {
    switch (scanStatus) {
      case 'scanning':
        return (
          <Badge className="bg-yellow-600 text-white animate-pulse">
            <Shield className="w-3 h-3 mr-1 animate-spin" />
            Scanning...
          </Badge>
        );
      case 'clean':
        return (
          <Badge className="bg-green-600 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Safe
          </Badge>
        );
      case 'infected':
      case 'suspicious':
        return (
          <Badge className="bg-red-600 text-white">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Threat Detected
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-gray-600 text-white">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Scan Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 300));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleDownload = () => {
    if (scanStatus !== 'clean') {
      alert('File cannot be downloaded - security scan failed or detected threats');
      return;
    }

    const link = document.createElement('a');
    link.href = mediaUrl;
    link.download = `evidence-${reportId}-${Date.now()}.${mediaType === 'image' ? 'jpg' : 'mp4'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const canDisplayMedia = scanStatus === 'clean';

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[95vh] bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center justify-between">
              <span>Evidence Viewer - Report {reportId.slice(0, 8)}</span>
              <div className="flex items-center space-x-2">
                {getScanStatusBadge()}
                {reportDetails && (
                  <Badge className="bg-blue-600 text-white">
                    {reportDetails.threat_type}
                  </Badge>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Security Status */}
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-cyan-400" />
                <div className="flex-1">
                  <h3 className="text-white font-semibold">Security Status</h3>
                  <div className="flex items-center space-x-4 mt-2">
                    {getScanStatusBadge()}
                    {scanDetails && (
                      <div className="text-sm text-gray-300">
                        {scanStatus === 'clean' && 'File is safe to view and download'}
                        {(scanStatus === 'infected' || scanStatus === 'suspicious') && 
                          `Threats detected: ${scanDetails.threats?.join(', ') || 'Unknown threats'}`}
                        {scanStatus === 'error' && 'Unable to complete security scan'}
                        {scanStatus === 'scanning' && 'Performing security scan...'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Media Controls */}
            {canDisplayMedia && (
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
            )}

            {/* Media Display */}
            <div className="relative bg-black rounded-lg overflow-hidden" style={{ minHeight: '400px' }}>
              {!canDisplayMedia ? (
                <div className="flex items-center justify-center h-96 text-center">
                  <div className="space-y-4">
                    {scanStatus === 'scanning' && (
                      <>
                        <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-white">Scanning file for security threats...</p>
                        <p className="text-gray-400 text-sm">Please wait while we ensure this file is safe</p>
                      </>
                    )}
                    {(scanStatus === 'infected' || scanStatus === 'suspicious') && (
                      <>
                        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto" />
                        <p className="text-red-400 font-semibold">Security Threat Detected</p>
                        <p className="text-gray-300">This file cannot be displayed for security reasons</p>
                        {scanDetails?.threats && (
                          <p className="text-gray-400 text-sm">Threats: {scanDetails.threats.join(', ')}</p>
                        )}
                      </>
                    )}
                    {scanStatus === 'error' && (
                      <>
                        <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto" />
                        <p className="text-yellow-400 font-semibold">Scan Failed</p>
                        <p className="text-gray-300">Unable to verify file security</p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <>
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
                </>
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
      {mediaType === 'image' && canDisplayMedia && (
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
