
import React, { useEffect, useRef } from 'react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';

interface HeatmapPoint {
  lat: number;
  lng: number;
  weight?: number;
}

interface GoogleMapsHeatmapProps {
  reports?: Array<{
    latitude?: number;
    longitude?: number;
    threat_type?: string;
    status?: string;
  }>;
  className?: string;
  onMarkerClick?: (report: any) => void;
}

const GoogleMapsHeatmap = ({ reports = [], className = "", onMarkerClick }: GoogleMapsHeatmapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { isLoaded, error } = useGoogleMaps();
  const mapInstanceRef = useRef<any>(null);
  const heatmapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        zoom: 6,
        center: { lat: 9.0820, lng: 8.6753 }, // Nigeria center
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      });
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Filter out resolved reports for display
    const activeReports = reports.filter(report => 
      report.latitude && 
      report.longitude && 
      report.status !== 'resolved'
    );

    // Convert reports to heatmap data and markers
    const heatmapData = activeReports.map(report => {
      // Create marker for each report
      const marker = new window.google.maps.Marker({
        position: { lat: Number(report.latitude), lng: Number(report.longitude) },
        map: mapInstanceRef.current,
        title: report.threat_type || 'Report',
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" fill="${getMarkerColor(report.threat_type, report.status)}" stroke="white" stroke-width="2"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(24, 24)
        }
      });

      // Add click listener
      marker.addListener('click', () => {
        if (onMarkerClick) {
          onMarkerClick(report);
        }
      });

      markersRef.current.push(marker);

      return {
        location: new window.google.maps.LatLng(Number(report.latitude), Number(report.longitude)),
        weight: getWeightByThreatType(report.threat_type, report.status)
      };
    });

    // Remove existing heatmap
    if (heatmapRef.current) {
      heatmapRef.current.setMap(null);
    }

    // Create new heatmap only for active reports
    if (heatmapData.length > 0) {
      heatmapRef.current = new window.google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map: mapInstanceRef.current
      });
    }
  }, [isLoaded, reports, onMarkerClick]);

  const getMarkerColor = (threatType?: string, status?: string) => {
    if (status === 'assigned') return '#3B82F6'; // Blue for assigned
    if (status === 'pending') return '#EAB308'; // Yellow for pending
    
    // Fallback colors based on threat type
    switch (threatType?.toLowerCase()) {
      case 'terrorism':
      case 'kidnapping':
        return '#EF4444';
      case 'armed robbery':
        return '#F97316';
      case 'theft':
      case 'vandalism':
        return '#EAB308';
      default:
        return '#EAB308'; // Default to yellow for pending
    }
  };

  const getWeightByThreatType = (threatType?: string, status?: string) => {
    if (status === 'assigned') return 0.8;
    
    switch (threatType?.toLowerCase()) {
      case 'terrorism':
      case 'kidnapping':
        return 1.0;
      case 'armed robbery':
        return 0.8;
      case 'theft':
      case 'vandalism':
        return 0.5;
      default:
        return 0.6;
    }
  };

  if (error) {
    return (
      <div className={`flex items-center justify-center h-96 bg-gray-800 rounded-lg ${className}`}>
        <p className="text-red-400">Error loading Google Maps</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center h-96 bg-gray-800 rounded-lg ${className}`}>
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return <div ref={mapRef} className={`h-full w-full rounded-lg ${className}`} />;
};

export default GoogleMapsHeatmap;
