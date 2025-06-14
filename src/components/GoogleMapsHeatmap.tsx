
import React, { useEffect, useRef, useState } from 'react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { Card } from '@/components/ui/card';
import ReportDetailsModal from './ReportDetailsModal';

interface GoogleMapsHeatmapProps {
  reports: any[];
  onMarkerClick?: (report: any) => void;
  className?: string;
}

const GoogleMapsHeatmap: React.FC<GoogleMapsHeatmapProps> = ({ 
  reports, 
  onMarkerClick,
  className = "h-96"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { isLoaded, error } = useGoogleMaps();
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    if (isLoaded && mapRef.current && !map && window.google) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 9.0765, lng: 7.3986 }, // Nigeria center
        zoom: 6,
        styles: [
          {
            "featureType": "all",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#1e293b"}]
          },
          {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#ffffff"}]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{"color": "#0f172a"}]
          }
        ]
      });
      setMap(newMap);
    }
  }, [isLoaded, map]);

  useEffect(() => {
    if (!map || !reports || !window.google) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    
    const newMarkers: any[] = [];

    reports.forEach((report) => {
      if (report.latitude && report.longitude) {
        const getMarkerColor = (status: string, priority: string) => {
          if (status === 'resolved') return '#10B981'; // Green
          if (status === 'assigned') return '#3B82F6'; // Blue
          if (priority === 'high') return '#DC2626'; // Red
          return '#F59E0B'; // Yellow for pending
        };

        const markerColor = getMarkerColor(report.status, report.priority);
        
        const marker = new window.google.maps.Marker({
          position: { lat: Number(report.latitude), lng: Number(report.longitude) },
          map: map,
          title: `${report.threat_type} - ${report.status}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: markerColor,
            fillOpacity: 0.8,
            strokeWeight: 2,
            strokeColor: '#ffffff'
          }
        });

        marker.addListener('click', () => {
          if (onMarkerClick) {
            onMarkerClick(report);
          } else {
            setSelectedReport(report);
          }
        });

        newMarkers.push(marker);
      }
    });

    setMarkers(newMarkers);
  }, [map, reports, onMarkerClick]);

  if (error) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 p-6">
        <div className="text-center text-gray-400">
          <p>Error loading Google Maps</p>
          <p className="text-sm mt-2">Please check your internet connection</p>
        </div>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 p-6">
        <div className="text-center text-gray-400">
          <p>Loading map...</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div ref={mapRef} className={`w-full rounded-lg ${className}`} />
      
      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </>
  );
};

export default GoogleMapsHeatmap;
