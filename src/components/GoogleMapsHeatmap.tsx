
import React, { useEffect, useRef } from 'react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';

interface HeatmapPoint {
  lat: number;
  lng: number;
  weight?: number;
}

interface GoogleMapsHeatmapProps {
  reports: Array<{
    latitude?: number;
    longitude?: number;
    threat_type?: string;
    status?: string;
  }>;
  className?: string;
}

const GoogleMapsHeatmap = ({ reports, className = "" }: GoogleMapsHeatmapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { isLoaded, loadError } = useGoogleMaps();
  const mapInstanceRef = useRef<any>(null);
  const heatmapRef = useRef<any>(null);

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

    // Convert reports to heatmap data
    const heatmapData = reports
      .filter(report => report.latitude && report.longitude)
      .map(report => ({
        location: new window.google.maps.LatLng(report.latitude!, report.longitude!),
        weight: getWeightByThreatType(report.threat_type, report.status)
      }));

    // Remove existing heatmap
    if (heatmapRef.current) {
      heatmapRef.current.setMap(null);
    }

    // Create new heatmap
    if (heatmapData.length > 0) {
      heatmapRef.current = new window.google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map: mapInstanceRef.current,
        radius: 20,
        opacity: 0.7
      });
    }
  }, [isLoaded, reports]);

  const getWeightByThreatType = (threatType?: string, status?: string) => {
    if (status === 'resolved') return 0.3;
    
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

  if (loadError) {
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

  return <div ref={mapRef} className={`h-96 w-full rounded-lg ${className}`} />;
};

export default GoogleMapsHeatmap;
