
import React, { useEffect, useRef, useState } from 'react';
import { useReports } from '@/hooks/useReports';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { Loader2 } from 'lucide-react';

const GoogleMapsHeatmap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);
  const { reports } = useReports();
  const { isLoaded, error } = useGoogleMaps();
  const [selectedReport, setSelectedReport] = useState<any>(null);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 6,
      center: new window.google.maps.LatLng(9.0765, 7.3986), // Nigeria center
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
    });

    mapInstanceRef.current = map;

    // Initialize heatmap
    const heatmap = new window.google.maps.visualization.HeatmapLayer({
      data: [],
      map: map,
    });

    heatmapRef.current = heatmap;
  }, [isLoaded]);

  // Update heatmap data when reports change
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !heatmapRef.current) return;

    const heatmapData: google.maps.LatLng[] = [];
    const markers: google.maps.Marker[] = [];

    reports.forEach((report) => {
      if (report.latitude && report.longitude) {
        const position = new window.google.maps.LatLng(
          Number(report.latitude),
          Number(report.longitude)
        );
        
        heatmapData.push(position);

        // Create marker for each report
        const marker = new window.google.maps.Marker({
          position: position,
          map: mapInstanceRef.current,
          title: report.threat_type,
          icon: {
            url: getThreatIcon(report.threat_type),
            scaledSize: new window.google.maps.Size(24, 24),
          } as any,
        });

        // Add click listener to marker
        marker.addListener('click', () => {
          setSelectedReport(report);
          
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div class="p-3 max-w-xs">
                <h3 class="font-bold text-gray-900 mb-2">${report.threat_type}</h3>
                <p class="text-sm text-gray-600 mb-2">${report.description}</p>
                <p class="text-xs text-gray-500">
                  <strong>Location:</strong> ${report.location || report.manual_location || 'Unknown'}
                </p>
                <p class="text-xs text-gray-500">
                  <strong>Status:</strong> ${report.status}
                </p>
                <p class="text-xs text-gray-500">
                  <strong>Date:</strong> ${new Date(report.created_at).toLocaleDateString()}
                </p>
              </div>
            `,
          });
          
          infoWindow.open(mapInstanceRef.current, marker);
        });

        markers.push(marker);
      }
    });

    // Update heatmap
    heatmapRef.current.setData(heatmapData);

    // Cleanup function to remove markers
    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, [reports, isLoaded]);

  const getThreatIcon = (threatType: string) => {
    const iconMap: { [key: string]: string } = {
      'terrorism': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNEQzI2MjYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9zdmc+Cg==',
      'kidnapping': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNGNTlFMEIiLz4KPC9zdmc+',
      'armed robbery': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiM4QjVDRjYiLz4KPC9zdmc+',
      'default': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMxMEI5ODEiLz4KPC9zdmc+'
    };
    
    return iconMap[threatType.toLowerCase()] || iconMap['default'];
  };

  if (error) {
    return (
      <div className="h-96 bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-red-400">Failed to load Google Maps: {error}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-96 bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading Google Maps...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dhq-card p-0 overflow-hidden">
      <div 
        ref={mapRef} 
        className="w-full h-96"
        style={{ minHeight: '400px' }}
      />
      
      {selectedReport && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-sm z-10">
          <button
            onClick={() => setSelectedReport(null)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
          <h3 className="font-bold text-gray-900 mb-2">{selectedReport.threat_type}</h3>
          <p className="text-sm text-gray-600 mb-2">{selectedReport.description}</p>
          <p className="text-xs text-gray-500">
            <strong>Location:</strong> {selectedReport.location || selectedReport.manual_location || 'Unknown'}
          </p>
          <p className="text-xs text-gray-500">
            <strong>Status:</strong> {selectedReport.status}
          </p>
        </div>
      )}
    </div>
  );
};

export default GoogleMapsHeatmap;
