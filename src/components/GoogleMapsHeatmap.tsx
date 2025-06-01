
import React, { useEffect, useRef, useState } from 'react';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';

interface Report {
  id: string;
  latitude?: number;
  longitude?: number;
  threat_type: string;
  urgency: 'low' | 'medium' | 'high';
  priority: 'low' | 'medium' | 'high';
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
    };
  }, [isLoaded]);

  useEffect(() => {
    if (!map || !window.google?.maps?.visualization || reports.length === 0) return;

    // Clear existing heatmap
    if (heatmap) {
      heatmap.setMap(null);
    }

    // Create heatmap data with weighted locations
    const heatmapData = reports
      .filter(report => report.latitude && report.longitude)
      .map(report => {
        const weight = getWeightForReport(report);
        const location = new window.google.maps.LatLng(report.latitude!, report.longitude!);
        
        return {
          location: location,
          weight: weight
        };
      });

    if (heatmapData.length === 0) return;

    // Create new heatmap
    const newHeatmap = new window.google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      map: map,
    });

    // Configure heatmap options
    newHeatmap.setOptions({
      radius: 20,
      opacity: 0.8,
      gradient: [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
      ]
    });

    setHeatmap(newHeatmap);
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

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center h-96 bg-gray-100 rounded-lg ${className}`}>
        <div className="text-gray-600">Loading Google Maps...</div>
      </div>
    );
  }

  return (
    <div className={`w-full h-96 rounded-lg overflow-hidden ${className}`}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default GoogleMapsHeatmap;
