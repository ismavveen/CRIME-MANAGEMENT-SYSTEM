
import React, { useEffect, useRef, useState } from 'react';
import { useReports } from '@/hooks/useReports';
import { Button } from '@/components/ui/button';
import { MapPin, AlertTriangle, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const GoogleMapsHeatmap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const heatmapRef = useRef<any>(null);
  const { reports, loading } = useReports();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    // Try to get API key from localStorage first
    const savedKey = localStorage.getItem('google_maps_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const loadGoogleMapsScript = (key: string) => {
    return new Promise<void>((resolve, reject) => {
      // Check if script is already loaded
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        resolve();
        return;
      }

      // Remove existing script if any
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.remove();
      }

      window.initMap = () => {
        setIsLoaded(true);
        resolve();
      };

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=visualization&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        setError('Failed to load Google Maps API. Please check your API key.');
        reject(new Error('Failed to load Google Maps API'));
      };
      
      document.head.appendChild(script);
    });
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    try {
      // Initialize map centered on Nigeria
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 6,
        center: { lat: 9.0765, lng: 7.3986 }, // Nigeria center
        mapTypeId: 'roadmap',
        styles: [
          {
            "elementType": "geometry",
            "stylers": [{"color": "#1d2c4d"}]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#8ec3b9"}]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [{"color": "#1a3646"}]
          }
        ]
      });

      mapInstanceRef.current = map;

      // Create heatmap data from reports
      const heatmapData = reports
        .filter(report => report.latitude && report.longitude)
        .map(report => ({
          location: new window.google.maps.LatLng(
            parseFloat(report.latitude!.toString()),
            parseFloat(report.longitude!.toString())
          ),
          weight: report.urgency === 'critical' ? 3 : report.priority === 'high' ? 2 : 1
        }));

      if (heatmapData.length > 0) {
        const heatmap = new window.google.maps.visualization.HeatmapLayer({
          data: heatmapData.map(point => point.location),
          map: showHeatmap ? map : null,
          radius: 50,
          opacity: 0.8
        });

        heatmapRef.current = heatmap;

        // Add markers for individual reports
        reports
          .filter(report => report.latitude && report.longitude)
          .forEach(report => {
            const marker = new window.google.maps.Marker({
              position: {
                lat: parseFloat(report.latitude!.toString()),
                lng: parseFloat(report.longitude!.toString())
              },
              map: map,
              title: report.threat_type || 'Security Report',
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: report.urgency === 'critical' ? '#dc2626' : 
                          report.priority === 'high' ? '#f59e0b' : '#10b981',
                fillOpacity: 0.8,
                strokeWeight: 2,
                strokeColor: '#ffffff',
                scale: report.urgency === 'critical' ? 8 : 6
              }
            });

            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="color: #000; padding: 8px;">
                  <h4 style="margin: 0 0 8px 0; color: #1f2937;">${report.threat_type || 'Security Report'}</h4>
                  <p style="margin: 0 0 4px 0; font-size: 12px;"><strong>Priority:</strong> ${report.priority || 'medium'}</p>
                  <p style="margin: 0 0 4px 0; font-size: 12px;"><strong>Urgency:</strong> ${report.urgency || 'medium'}</p>
                  <p style="margin: 0 0 4px 0; font-size: 12px;"><strong>Location:</strong> ${report.location || 'Unknown'}</p>
                  <p style="margin: 0; font-size: 12px;"><strong>Time:</strong> ${new Date(report.created_at || '').toLocaleDateString()}</p>
                </div>
              `
            });

            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
          });
      }

      setError(null);
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
    }
  };

  useEffect(() => {
    if (apiKey && !isLoaded) {
      loadGoogleMapsScript(apiKey).catch(console.error);
    }
  }, [apiKey, isLoaded]);

  useEffect(() => {
    if (isLoaded && !loading) {
      initializeMap();
    }
  }, [isLoaded, loading, reports, showHeatmap]);

  const toggleHeatmap = () => {
    setShowHeatmap(!showHeatmap);
    if (heatmapRef.current && mapInstanceRef.current) {
      heatmapRef.current.setMap(showHeatmap ? null : mapInstanceRef.current);
    }
  };

  const handleApiKeySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const key = formData.get('apiKey') as string;
    if (key.trim()) {
      localStorage.setItem('google_maps_api_key', key.trim());
      setApiKey(key.trim());
      setIsLoaded(false);
      setError(null);
    }
  };

  if (!apiKey) {
    return (
      <div className="dhq-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Google Maps Configuration</h2>
          <Settings className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="text-center py-8">
          <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Google Maps API Key Required</h3>
          <p className="text-gray-400 mb-6">
            To view interactive maps, please configure your Google Maps API key in the settings.
          </p>
          
          <form onSubmit={handleApiKeySubmit} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                name="apiKey"
                type="text"
                placeholder="Enter Google Maps API Key"
                className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400"
                required
              />
              <Button type="submit" className="bg-dhq-blue hover:bg-blue-700">
                Save
              </Button>
            </div>
          </form>
          
          <p className="text-xs text-gray-500 mt-4">
            Get your API key from{' '}
            <a 
              href="https://console.cloud.google.com/google/maps-apis" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-dhq-blue hover:underline"
            >
              Google Cloud Console
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dhq-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Google Maps</h2>
          <AlertTriangle className="h-5 w-5 text-red-400" />
        </div>
        
        <div className="text-center py-8">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Maps Loading Error</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button 
            onClick={() => {
              setError(null);
              setIsLoaded(false);
              if (apiKey) {
                loadGoogleMapsScript(apiKey).catch(console.error);
              }
            }}
            className="bg-dhq-blue hover:bg-blue-700"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="dhq-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Google Maps</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-yellow-400 text-sm">Loading Maps...</span>
          </div>
        </div>
        
        <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dhq-blue mx-auto mb-4"></div>
            <p className="text-gray-400">Initializing Google Maps...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dhq-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">🗺️ Interactive Threat Map</h2>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleHeatmap}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-green-400 text-sm">LIVE</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-400 text-sm">Critical</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-gray-400 text-sm">High Priority</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-400 text-sm">Normal</span>
        </div>
        <Badge variant="secondary" className="ml-auto">
          {reports.filter(r => r.latitude && r.longitude).length} Locations
        </Badge>
      </div>

      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg border border-gray-700 bg-gray-900"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};

export default GoogleMapsHeatmap;
