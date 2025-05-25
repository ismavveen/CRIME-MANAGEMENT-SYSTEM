
import React, { useState, useEffect } from 'react';
import { useReports } from '@/hooks/useReports';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, AlertTriangle, Image as ImageIcon, Video, User, Phone } from 'lucide-react';
import { format } from 'date-fns';

interface SelectedReport {
  id: string;
  description: string;
  threat_type: string;
  location: string;
  full_address?: string;
  state?: string;
  local_government?: string;
  landmark?: string;
  urgency: string;
  status: string;
  created_at: string;
  images?: string[];
  videos?: string[];
  latitude?: number;
  longitude?: number;
}

const GoogleMapsHeatmap = () => {
  const { reports } = useReports();
  const [selectedReport, setSelectedReport] = useState<SelectedReport | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    // Initialize Google Maps
    const initMap = () => {
      if (!window.google) {
        console.error('Google Maps API not loaded');
        return;
      }

      const mapElement = document.getElementById('google-map');
      if (!mapElement) return;

      const mapInstance = new google.maps.Map(mapElement, {
        center: { lat: 9.0765, lng: 7.3986 }, // Nigeria center
        zoom: 6,
        styles: [
          {
            "elementType": "geometry",
            "stylers": [{"color": "#1f2937"}]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [{"color": "#1f2937"}]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#8b949e"}]
          },
          {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#d1d5db"}]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#d1d5db"}]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{"color": "#263a3c"}]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#6b7280"}]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{"color": "#374151"}]
          },
          {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [{"color": "#212a37"}]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#9ca3af"}]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [{"color": "#746855"}]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{"color": "#1f2937"}]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#f3f4f6"}]
          },
          {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{"color": "#2f3948"}]
          },
          {
            "featureType": "transit.station",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#d1d5db"}]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{"color": "#0ea5e9"}]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#515c6d"}]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": [{"color": "#17263c"}]
          }
        ]
      });

      setMap(mapInstance);
    };

    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&libraries=places,visualization`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  useEffect(() => {
    if (!map || !reports.length) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    
    const newMarkers: google.maps.Marker[] = [];

    reports.forEach((report) => {
      if (report.latitude && report.longitude) {
        const getMarkerColor = (urgency: string) => {
          switch (urgency) {
            case 'critical': return '#ef4444'; // red
            case 'high': return '#f97316'; // orange
            case 'medium': return '#eab308'; // yellow
            case 'low': return '#22c55e'; // green
            default: return '#6b7280'; // gray
          }
        };

        const marker = new google.maps.Marker({
          position: { lat: Number(report.latitude), lng: Number(report.longitude) },
          map: map,
          title: report.threat_type,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: getMarkerColor(report.urgency),
            fillOpacity: 0.8,
            strokeWeight: 2,
            strokeColor: '#ffffff'
          }
        });

        marker.addListener('click', () => {
          setSelectedReport(report);
        });

        newMarkers.push(marker);
      }
    });

    setMarkers(newMarkers);
  }, [map, reports]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'investigating': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="dhq-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <MapPin className="h-6 w-6 text-cyan-400" />
          <h3 className="text-2xl font-bold text-white dhq-heading">Live Intelligence Map</h3>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-300">Critical</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-300">High</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-300">Medium</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-300">Low</span>
          </div>
        </div>
      </div>
      
      <div 
        id="google-map" 
        className="w-full h-96 rounded-lg border border-gray-700"
        style={{ minHeight: '400px' }}
      />

      {/* Report Details Modal */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-orange-400" />
              <span>Intelligence Report Details</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge className={`${getUrgencyColor(selectedReport.urgency)} text-white px-3 py-1`}>
                    {selectedReport.urgency.toUpperCase()}
                  </Badge>
                  <Badge className={`${getStatusColor(selectedReport.status)} text-white px-3 py-1`}>
                    {selectedReport.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(selectedReport.created_at), 'MMM dd, yyyy HH:mm')}</span>
                </div>
              </div>

              {/* Threat Type */}
              <div>
                <h4 className="text-lg font-semibold text-cyan-400 mb-2">Threat Classification</h4>
                <p className="text-white font-medium">{selectedReport.threat_type}</p>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-lg font-semibold text-cyan-400 mb-2">Intelligence Details</h4>
                <p className="text-gray-300 leading-relaxed">{selectedReport.description}</p>
              </div>

              {/* Location Information */}
              <div>
                <h4 className="text-lg font-semibold text-cyan-400 mb-2">Location Intelligence</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedReport.state && (
                    <div>
                      <span className="text-sm text-gray-400">State:</span>
                      <p className="text-white">{selectedReport.state}</p>
                    </div>
                  )}
                  {selectedReport.local_government && (
                    <div>
                      <span className="text-sm text-gray-400">LGA:</span>
                      <p className="text-white">{selectedReport.local_government}</p>
                    </div>
                  )}
                  {selectedReport.full_address && (
                    <div className="md:col-span-2">
                      <span className="text-sm text-gray-400">Full Address:</span>
                      <p className="text-white">{selectedReport.full_address}</p>
                    </div>
                  )}
                  {selectedReport.landmark && (
                    <div className="md:col-span-2">
                      <span className="text-sm text-gray-400">Landmark:</span>
                      <p className="text-white">{selectedReport.landmark}</p>
                    </div>
                  )}
                  {selectedReport.latitude && selectedReport.longitude && (
                    <div className="md:col-span-2">
                      <span className="text-sm text-gray-400">Coordinates:</span>
                      <p className="text-white font-mono">{selectedReport.latitude}, {selectedReport.longitude}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Images */}
              {selectedReport.images && selectedReport.images.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-cyan-400 mb-2 flex items-center space-x-2">
                    <ImageIcon className="h-5 w-5" />
                    <span>Evidence Images ({selectedReport.images.length})</span>
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedReport.images.map((imageUrl, index) => (
                      <img
                        key={index}
                        src={imageUrl}
                        alt={`Evidence ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-600 cursor-pointer hover:border-cyan-400 transition-colors"
                        onClick={() => window.open(imageUrl, '_blank')}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {selectedReport.videos && selectedReport.videos.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-cyan-400 mb-2 flex items-center space-x-2">
                    <Video className="h-5 w-5" />
                    <span>Evidence Videos ({selectedReport.videos.length})</span>
                  </h4>
                  <div className="space-y-3">
                    {selectedReport.videos.map((videoUrl, index) => (
                      <div key={index} className="bg-gray-900/50 rounded-lg p-3">
                        <video
                          src={videoUrl}
                          controls
                          className="w-full h-48 rounded-lg"
                        />
                        <p className="text-sm text-gray-400 mt-2">Video Evidence {index + 1}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Details */}
              <div className="border-t border-gray-700 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Report ID:</span>
                    <p className="text-white font-mono">{selectedReport.id.slice(0, 8)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Priority Level:</span>
                    <p className="text-white capitalize">{selectedReport.urgency}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GoogleMapsHeatmap;
