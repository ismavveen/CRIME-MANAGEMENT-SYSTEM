
import React, { useEffect, useRef, useState } from 'react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, User, AlertTriangle, CheckCircle, X } from 'lucide-react';

interface Report {
  id: string;
  latitude?: number;
  longitude?: number;
  threat_type: string;
  urgency: 'low' | 'medium' | 'high';
  priority: 'low' | 'medium' | 'high';
  description?: string;
  location?: string;
  manual_location?: string;
  state?: string;
  local_government?: string;
  full_address?: string;
  landmark?: string;
  created_at?: string;
  status?: string;
  reporter_type?: string;
  is_anonymous?: boolean;
  assigned_to?: string;
  images?: string[];
  videos?: string[];
}

interface GoogleMapsHeatmapProps {
  reports: Report[];
  className?: string;
  onMarkerClick?: (report: Report) => void;
}

const GoogleMapsHeatmap: React.FC<GoogleMapsHeatmapProps> = ({ 
  reports, 
  className = '',
  onMarkerClick 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [heatmap, setHeatmap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const { isLoaded } = useGoogleMaps();

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google) return;

    // Initialize map
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      zoom: 6,
      center: { lat: 9.0820, lng: 8.6753 }, // Center of Nigeria
      mapTypeId: 'roadmap',
    });

    setMap(mapInstance);

    return () => {
      if (heatmap) {
        heatmap.setMap(null);
      }
      markers.forEach(marker => marker.setMap(null));
    };
  }, [isLoaded]);

  useEffect(() => {
    if (!map || !window.google?.maps?.visualization || reports.length === 0) return;

    // Clear existing markers and heatmap
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
    
    if (heatmap) {
      heatmap.setMap(null);
    }

    // Create clickable markers instead of heatmap for better interaction
    const newMarkers = reports
      .filter(report => report.latitude && report.longitude)
      .map(report => {
        const weight = getWeightForReport(report);
        const color = getMarkerColor(report);
        
        const marker = new window.google.maps.Marker({
          position: { lat: report.latitude!, lng: report.longitude! },
          map: map,
          title: `${report.threat_type} - ${report.urgency} priority`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: Math.max(8, weight * 2),
            fillColor: color,
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }
        });

        marker.addListener('click', () => {
          setSelectedReport(report);
          setShowReportModal(true);
          if (onMarkerClick) {
            onMarkerClick(report);
          }
        });

        return marker;
      });

    setMarkers(newMarkers);
  }, [map, reports]);

  const getWeightForReport = (report: Report): number => {
    let weight = 1;

    // Weight based on urgency
    switch (report.urgency) {
      case 'high':
        weight += 3;
        break;
      case 'medium':
        weight += 2;
        break;
      case 'low':
        weight += 1;
        break;
    }

    // Weight based on priority
    switch (report.priority) {
      case 'high':
        weight += 2;
        break;
      case 'medium':
        weight += 1;
        break;
      case 'low':
        weight += 0.5;
        break;
    }

    // Weight based on threat type
    switch (report.threat_type) {
      case 'Terrorism':
      case 'Armed Robbery':
        weight += 3;
        break;
      case 'Kidnapping':
      case 'Violence':
        weight += 2;
        break;
      default:
        weight += 1;
        break;
    }

    return Math.max(1, weight);
  };

  const getMarkerColor = (report: Report): string => {
    if (report.status === 'resolved') return '#10B981';
    if (report.assigned_to) return '#3B82F6';
    if (report.urgency === 'high' || report.priority === 'high') return '#DC2626';
    return '#F59E0B';
  };

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

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center h-96 bg-gray-100 rounded-lg ${className}`}>
        <div className="text-gray-600">Loading Google Maps...</div>
      </div>
    );
  }

  return (
    <>
      <div className={`w-full h-96 rounded-lg overflow-hidden ${className}`}>
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* Report Details Modal */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-xl text-white flex items-center gap-2">
              {getStatusIcon(selectedReport?.status || 'pending')}
              Report Details - {selectedReport?.id?.slice(0, 8)}
            </DialogTitle>
            <Button variant="ghost" onClick={() => setShowReportModal(false)} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6">
              {/* Status and Basic Info */}
              <div className="flex items-center justify-between">
                <Badge className={`px-3 py-1 border ${getStatusColor(selectedReport.status || 'pending')}`}>
                  {(selectedReport.status || 'PENDING').toUpperCase()}
                </Badge>
                <div className="text-sm text-gray-400">
                  {selectedReport.created_at ? new Date(selectedReport.created_at).toLocaleString() : 'Unknown'}
                </div>
              </div>

              {/* Report Description */}
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-cyan-400">Description</h3>
                <p className="text-gray-300">{selectedReport.description || 'No description provided'}</p>
              </div>

              {/* Location and Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-cyan-400 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400">State:</span> {selectedReport.state || 'N/A'}</p>
                    <p><span className="text-gray-400">LGA:</span> {selectedReport.local_government || 'N/A'}</p>
                    <p><span className="text-gray-400">Address:</span> {selectedReport.full_address || selectedReport.location || selectedReport.manual_location || 'N/A'}</p>
                    {selectedReport.landmark && <p><span className="text-gray-400">Landmark:</span> {selectedReport.landmark}</p>}
                    {selectedReport.latitude && selectedReport.longitude && (
                      <p><span className="text-gray-400">Coordinates:</span> {selectedReport.latitude}, {selectedReport.longitude}</p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-cyan-400">Report Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400">Threat Type:</span> {selectedReport.threat_type}</p>
                    <p><span className="text-gray-400">Urgency:</span> <span className={`capitalize ${selectedReport.urgency === 'high' ? 'text-red-400' : selectedReport.urgency === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>{selectedReport.urgency}</span></p>
                    <p><span className="text-gray-400">Priority:</span> <span className={`capitalize ${selectedReport.priority === 'high' ? 'text-red-400' : selectedReport.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>{selectedReport.priority}</span></p>
                    <p><span className="text-gray-400">Reporter Type:</span> {selectedReport.reporter_type || 'Web App'}</p>
                    <p><span className="text-gray-400">Anonymous:</span> {selectedReport.is_anonymous ? 'Yes' : 'No'}</p>
                    {selectedReport.assigned_to && <p><span className="text-gray-400">Assigned To:</span> {selectedReport.assigned_to}</p>}
                  </div>
                </div>
              </div>

              {/* Media Section */}
              {(selectedReport.images?.length > 0 || selectedReport.videos?.length > 0) && (
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-4 text-cyan-400">Evidence & Media</h3>
                  
                  {/* Images */}
                  {selectedReport.images && selectedReport.images.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-300 mb-3">Images ({selectedReport.images.length})</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedReport.images.map((imageUrl, index) => (
                          <img
                            key={index}
                            src={imageUrl}
                            alt={`Evidence ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Videos */}
                  {selectedReport.videos && selectedReport.videos.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-3">Videos ({selectedReport.videos.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedReport.videos.map((videoUrl, index) => (
                          <video
                            key={index}
                            controls
                            className="w-full h-48 object-cover rounded-lg bg-gray-900"
                            preload="metadata"
                          >
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                <Button variant="outline" onClick={() => setShowReportModal(false)}>
                  Close
                </Button>
                {selectedReport.status !== 'resolved' && (
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
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GoogleMapsHeatmap;
