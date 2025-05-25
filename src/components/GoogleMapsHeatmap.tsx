
import React, { useEffect, useRef, useState } from 'react';
import { useReports } from '@/hooks/useReports';
import { useToast } from '@/hooks/use-toast';
import { Search, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

interface GoogleMapsHeatmapProps {
  className?: string;
}

const GoogleMapsHeatmap: React.FC<GoogleMapsHeatmapProps> = ({ className = "" }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const heatmapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { reports, loading } = useReports();
  const { toast } = useToast();

  // Nigeria bounds
  const NIGERIA_BOUNDS = {
    north: 13.9,
    south: 4.2,
    east: 14.6,
    west: 2.7
  };

  const NIGERIA_CENTER = {
    lat: (NIGERIA_BOUNDS.north + NIGERIA_BOUNDS.south) / 2,
    lng: (NIGERIA_BOUNDS.east + NIGERIA_BOUNDS.west) / 2
  };

  useEffect(() => {
    const loadGoogleMaps = () => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // Load Google Maps script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${getGoogleMapsApiKey()}&libraries=visualization&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;

      window.initGoogleMaps = () => {
        initializeMap();
      };

      script.onerror = () => {
        toast({
          title: "Maps Loading Error",
          description: "Failed to load Google Maps. Please check your API key configuration.",
          variant: "destructive",
        });
      };

      document.head.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    };

    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (isMapLoaded && reports.length > 0) {
      updateHeatmapAndMarkers();
    }
  }, [reports, isMapLoaded]);

  const getGoogleMapsApiKey = () => {
    // In production, this should come from Supabase secrets
    // For now, we'll use a placeholder that needs to be replaced
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY_HERE';
    
    if (apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
      console.warn('Google Maps API key not configured. Please set up your API key in Supabase secrets.');
    }
    
    return apiKey;
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: NIGERIA_CENTER,
      zoom: 6,
      restriction: {
        latLngBounds: NIGERIA_BOUNDS,
        strictBounds: false,
      },
      styles: [
        {
          featureType: 'all',
          elementType: 'all',
          stylers: [
            { saturation: -100 },
            { lightness: -30 }
          ]
        },
        {
          featureType: 'water',
          elementType: 'all',
          stylers: [
            { color: '#1e293b' }
          ]
        },
        {
          featureType: 'landscape',
          elementType: 'all',
          stylers: [
            { color: '#374151' }
          ]
        }
      ]
    });

    mapInstanceRef.current = map;

    // Initialize info window
    infoWindowRef.current = new window.google.maps.InfoWindow();

    setIsMapLoaded(true);

    toast({
      title: "Maps Loaded",
      description: "Google Maps with heatmap functionality is now active",
    });
  };

  const updateHeatmapAndMarkers = () => {
    if (!mapInstanceRef.current || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Clear existing heatmap
    if (heatmapRef.current) {
      heatmapRef.current.setMap(null);
    }

    // Filter reports with valid coordinates
    const validReports = reports.filter(report => 
      report.latitude && 
      report.longitude && 
      report.latitude >= NIGERIA_BOUNDS.south && 
      report.latitude <= NIGERIA_BOUNDS.north &&
      report.longitude >= NIGERIA_BOUNDS.west && 
      report.longitude <= NIGERIA_BOUNDS.east
    );

    if (validReports.length === 0) return;

    // Create heatmap data
    const heatmapData = validReports.map(report => ({
      location: new window.google.maps.LatLng(report.latitude!, report.longitude!),
      weight: getReportWeight(report)
    }));

    // Create heatmap layer
    const heatmap = new window.google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      map: mapInstanceRef.current,
      radius: 50,
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

    heatmapRef.current = heatmap;

    // Create markers
    validReports.forEach(report => {
      const marker = new window.google.maps.Marker({
        position: { lat: report.latitude!, lng: report.longitude! },
        map: mapInstanceRef.current,
        title: report.threat_type || 'Security Report',
        icon: {
          url: getMarkerIcon(report),
          scaledSize: new window.google.maps.Size(24, 24)
        }
      });

      marker.addListener('click', () => {
        showInfoWindow(marker, report);
      });

      markersRef.current.push(marker);
    });

    console.log(`Updated map with ${validReports.length} reports`);
  };

  const getReportWeight = (report: any) => {
    // Weight based on urgency and priority
    let weight = 1;
    
    if (report.urgency === 'critical' || report.priority === 'high') {
      weight = 3;
    } else if (report.urgency === 'high' || report.priority === 'medium') {
      weight = 2;
    }

    // Recent reports get higher weight
    const reportDate = new Date(report.created_at);
    const daysSinceReport = (Date.now() - reportDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceReport <= 1) weight *= 2;
    else if (daysSinceReport <= 7) weight *= 1.5;

    return weight;
  };

  const getMarkerIcon = (report: any) => {
    const status = report.status?.toLowerCase();
    const urgency = report.urgency?.toLowerCase() || report.priority?.toLowerCase();

    if (status === 'resolved') {
      return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#10B981" stroke="#ffffff" stroke-width="2"/>
          <path d="m9 12 2 2 4-4" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `);
    }

    const color = urgency === 'critical' ? '#DC2626' : urgency === 'high' ? '#F59E0B' : '#3B82F6';
    
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="${color}" stroke="#ffffff" stroke-width="2"/>
        <circle cx="12" cy="12" r="3" fill="#ffffff"/>
      </svg>
    `);
  };

  const showInfoWindow = (marker: any, report: any) => {
    const content = `
      <div style="color: #000; font-family: Arial, sans-serif; max-width: 300px;">
        <h3 style="margin: 0 0 10px 0; color: #1f2937;">${report.threat_type || 'Security Report'}</h3>
        <p style="margin: 5px 0;"><strong>ID:</strong> ${report.id.slice(0, 8)}...</p>
        <p style="margin: 5px 0;"><strong>Description:</strong> ${report.description || 'No description'}</p>
        <p style="margin: 5px 0;"><strong>Location:</strong> ${report.location || report.manual_location || 'Unknown'}</p>
        <p style="margin: 5px 0;"><strong>Priority:</strong> ${report.priority || report.urgency || 'Medium'}</p>
        <p style="margin: 5px 0;"><strong>Status:</strong> ${report.status || 'Pending'}</p>
        <p style="margin: 5px 0;"><strong>Submitted:</strong> ${new Date(report.created_at).toLocaleString()}</p>
      </div>
    `;

    infoWindowRef.current.setContent(content);
    infoWindowRef.current.open(mapInstanceRef.current, marker);
  };

  const searchReport = () => {
    if (!searchQuery.trim()) return;

    const foundReport = reports.find(report => 
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.manual_location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.threat_type?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (foundReport && foundReport.latitude && foundReport.longitude) {
      const position = { lat: foundReport.latitude, lng: foundReport.longitude };
      mapInstanceRef.current?.setCenter(position);
      mapInstanceRef.current?.setZoom(12);

      // Find and click the corresponding marker
      const marker = markersRef.current.find(m => 
        Math.abs(m.getPosition().lat() - foundReport.latitude!) < 0.0001 &&
        Math.abs(m.getPosition().lng() - foundReport.longitude!) < 0.0001
      );

      if (marker) {
        showInfoWindow(marker, foundReport);
      }

      toast({
        title: "Report Found",
        description: `Navigated to report: ${foundReport.threat_type}`,
      });
    } else {
      toast({
        title: "Report Not Found",
        description: "No report found matching your search criteria",
        variant: "destructive",
      });
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (loading) {
    return (
      <div className={`bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-center h-96">
          <div className="text-white">Loading Google Maps...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 ${className} ${
      isFullscreen ? 'fixed inset-4 z-50' : ''
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">🌍 NIGERIA THREAT HEATMAP</h3>
        
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchReport()}
              className="bg-gray-700 border-gray-600 text-white w-48"
            />
            <Button
              onClick={searchReport}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Fullscreen Toggle */}
          <Button
            onClick={toggleFullscreen}
            size="sm"
            variant="outline"
            className="bg-transparent border-gray-600 text-gray-300"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>

          {/* Stats */}
          <div className="text-right">
            <div className="text-sm text-gray-400">
              Reports: {reports.filter(r => r.latitude && r.longitude).length}
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">LIVE</span>
            </div>
          </div>
        </div>
      </div>

      <div 
        ref={mapRef}
        className={`w-full ${isFullscreen ? 'h-[calc(100vh-8rem)]' : 'h-96'} bg-gray-900 rounded-lg`}
        style={{ minHeight: '400px' }}
      />

      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-lg">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p>Initializing Google Maps...</p>
            <p className="text-sm text-gray-400 mt-1">
              Please ensure your API key is configured in Supabase secrets
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMapsHeatmap;
