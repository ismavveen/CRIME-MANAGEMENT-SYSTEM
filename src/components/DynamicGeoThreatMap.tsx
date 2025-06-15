
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useReports } from '@/hooks/useReports';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Layers, Filter, AlertTriangle, Eye, Clock } from 'lucide-react';

interface ThreatCluster {
  id: string;
  lat: number;
  lng: number;
  threatType: string;
  intensity: number;
  count: number;
  reports: any[];
  region: string;
}

interface TooltipData {
  cluster: ThreatCluster;
  x: number;
  y: number;
}

const DynamicGeoThreatMap = () => {
  const { reports } = useReports();
  const [selectedThreatType, setSelectedThreatType] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [viewMode, setViewMode] = useState<'heatmap' | 'clusters'>('clusters');
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Set up real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('geo-threat-map-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'reports'
      }, () => {
        setLastUpdated(new Date());
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter reports based on time range and threat type
  const filteredReports = useMemo(() => {
    let filtered = reports.filter(report => report.latitude && report.longitude);

    // Filter by time range
    const now = new Date();
    const cutoffTime = new Date();
    switch (timeRange) {
      case '1h':
        cutoffTime.setHours(now.getHours() - 1);
        break;
      case '24h':
        cutoffTime.setDate(now.getDate() - 1);
        break;
      case '7d':
        cutoffTime.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoffTime.setDate(now.getDate() - 30);
        break;
    }
    
    filtered = filtered.filter(report => 
      new Date(report.created_at) >= cutoffTime
    );

    // Filter by threat type
    if (selectedThreatType !== 'all') {
      filtered = filtered.filter(report => 
        report.threat_type === selectedThreatType
      );
    }

    return filtered;
  }, [reports, timeRange, selectedThreatType]);

  // Create threat clusters
  const threatClusters = useMemo(() => {
    const clusters: ThreatCluster[] = [];
    const gridSize = 0.1; // Degrees for clustering

    // Group reports by location grid
    const locationGroups = new Map<string, any[]>();
    
    filteredReports.forEach(report => {
      const gridLat = Math.floor(report.latitude! / gridSize) * gridSize;
      const gridLng = Math.floor(report.longitude! / gridSize) * gridSize;
      const key = `${gridLat},${gridLng}`;
      
      if (!locationGroups.has(key)) {
        locationGroups.set(key, []);
      }
      locationGroups.get(key)!.push(report);
    });

    // Create clusters from groups
    locationGroups.forEach((reports, key) => {
      const [lat, lng] = key.split(',').map(Number);
      const threatTypeCounts = new Map<string, number>();
      
      reports.forEach(report => {
        const type = report.threat_type || 'Other';
        threatTypeCounts.set(type, (threatTypeCounts.get(type) || 0) + 1);
      });

      // Get dominant threat type
      const dominantType = Array.from(threatTypeCounts.entries())
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Other';

      // Calculate intensity based on urgency and count
      const criticalCount = reports.filter(r => r.urgency === 'critical').length;
      const highCount = reports.filter(r => r.priority === 'high').length;
      const intensity = Math.min((criticalCount * 3 + highCount * 2 + reports.length) / 10, 1);

      clusters.push({
        id: key,
        lat: lat + gridSize / 2,
        lng: lng + gridSize / 2,
        threatType: dominantType,
        intensity,
        count: reports.length,
        reports,
        region: reports[0]?.state || 'Unknown'
      });
    });

    return clusters.sort((a, b) => b.intensity - a.intensity);
  }, [filteredReports]);

  // Get threat type options
  const threatTypes = useMemo(() => {
    const types = new Set(reports.map(r => r.threat_type).filter(Boolean));
    return Array.from(types);
  }, [reports]);

  // Get threat color based on type
  const getThreatColor = (threatType: string, intensity: number = 1) => {
    const alpha = Math.max(0.3, intensity);
    switch (threatType.toLowerCase()) {
      case 'terrorism':
        return `rgba(220, 38, 38, ${alpha})`;
      case 'kidnapping':
        return `rgba(249, 115, 22, ${alpha})`;
      case 'armed robbery':
        return `rgba(234, 179, 8, ${alpha})`;
      case 'theft':
        return `rgba(34, 197, 94, ${alpha})`;
      case 'vandalism':
        return `rgba(59, 130, 246, ${alpha})`;
      default:
        return `rgba(139, 92, 246, ${alpha})`;
    }
  };

  const handleClusterClick = (cluster: ThreatCluster, event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({
      cluster,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  };

  const getClusterSize = (count: number, intensity: number) => {
    const baseSize = 8;
    const sizeMultiplier = Math.log(count + 1) * 3;
    const intensityMultiplier = intensity * 2;
    return Math.min(baseSize + sizeMultiplier + intensityMultiplier, 40);
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-cyan-400" />
            <span>Dynamic Geo-Spatial Threat Map</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm">LIVE</span>
            <span className="text-gray-400 text-xs">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select value={selectedThreatType} onValueChange={setSelectedThreatType}>
              <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All Threat Types</SelectItem>
                {threatTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Layers className="h-4 w-4 text-gray-400" />
            <div className="flex rounded-lg overflow-hidden border border-gray-600">
              <Button
                size="sm"
                variant={viewMode === 'clusters' ? 'default' : 'ghost'}
                onClick={() => setViewMode('clusters')}
                className="rounded-none text-xs"
              >
                Clusters
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'heatmap' ? 'default' : 'ghost'}
                onClick={() => setViewMode('heatmap')}
                className="rounded-none text-xs"
              >
                Heatmap
              </Button>
            </div>
          </div>

          <Badge className="bg-cyan-600/20 text-cyan-300">
            {threatClusters.length} Active Zones
          </Badge>
        </div>

        {/* Map */}
        <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden border border-green-500/30">
          <svg viewBox="0 0 400 300" className="w-full h-full">
            {/* Nigeria outline */}
            <path
              d="M50 80 L350 80 L350 100 L320 120 L300 140 L280 160 L250 180 L220 200 L200 220 L180 240 L160 250 L140 240 L120 220 L100 200 L80 180 L60 160 L50 140 Z"
              fill="rgba(15, 23, 42, 0.8)"
              stroke="rgba(34, 197, 94, 0.5)"
              strokeWidth="2"
            />
            
            {/* State boundaries */}
            <g stroke="rgba(34, 197, 94, 0.3)" strokeWidth="1" fill="none">
              <line x1="120" y1="80" x2="120" y2="200" />
              <line x1="180" y1="80" x2="180" y2="220" />
              <line x1="240" y1="80" x2="240" y2="200" />
              <line x1="300" y1="80" x2="280" y2="160" />
              <line x1="50" y1="120" x2="320" y2="120" />
              <line x1="60" y1="160" x2="280" y2="160" />
              <line x1="80" y1="200" x2="250" y2="200" />
            </g>

            {/* Threat clusters */}
            {threatClusters.map((cluster) => {
              const x = ((cluster.lng + 15) / 25) * 300 + 50;
              const y = ((20 - cluster.lat) / 15) * 200 + 50;
              const size = getClusterSize(cluster.count, cluster.intensity);
              
              return (
                <g key={cluster.id}>
                  {/* Heat layer effect for heatmap mode */}
                  {viewMode === 'heatmap' && (
                    <circle
                      cx={x}
                      cy={y}
                      r={size * 2}
                      fill={getThreatColor(cluster.threatType, cluster.intensity * 0.3)}
                      className="opacity-60"
                    />
                  )}
                  
                  {/* Pulsing ring for high intensity clusters */}
                  {cluster.intensity > 0.7 && (
                    <circle
                      cx={x}
                      cy={y}
                      r={size + 8}
                      fill="none"
                      stroke={getThreatColor(cluster.threatType, 0.8)}
                      strokeWidth="2"
                      className="animate-ping"
                    />
                  )}
                  
                  {/* Main cluster marker */}
                  <circle
                    cx={x}
                    cy={y}
                    r={size}
                    fill={getThreatColor(cluster.threatType, cluster.intensity)}
                    className="cursor-pointer hover:opacity-80 transition-all hover:scale-110"
                    onClick={(e) => handleClusterClick(cluster, e)}
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
                  />
                  
                  {/* Cluster count label */}
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    {cluster.count}
                  </text>
                  
                  {/* Border */}
                  <circle
                    cx={x}
                    cy={y}
                    r={size + 1}
                    fill="none"
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth="1"
                  />
                </g>
              );
            })}
          </svg>

          {/* Interactive tooltip */}
          {tooltip && (
            <div 
              className="absolute bg-gray-800 border border-gray-600 rounded-lg p-4 max-w-sm shadow-lg z-10"
              style={{
                left: Math.min(tooltip.x + 10, 300),
                top: Math.max(tooltip.y - 100, 10)
              }}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-semibold">{tooltip.cluster.threatType}</h4>
                  <Badge 
                    style={{ 
                      backgroundColor: getThreatColor(tooltip.cluster.threatType, 0.8),
                      color: 'white'
                    }}
                  >
                    {tooltip.cluster.count} Reports
                  </Badge>
                </div>
                
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Region:</strong> {tooltip.cluster.region}</p>
                  <p><strong>Intensity:</strong> {(tooltip.cluster.intensity * 100).toFixed(0)}%</p>
                  <p><strong>Coordinates:</strong> {tooltip.cluster.lat.toFixed(3)}, {tooltip.cluster.lng.toFixed(3)}</p>
                </div>

                {/* Recent reports */}
                <div className="border-t border-gray-600 pt-2">
                  <h5 className="text-gray-300 text-xs font-medium mb-1">Recent Reports:</h5>
                  <div className="space-y-1 max-h-20 overflow-y-auto">
                    {tooltip.cluster.reports.slice(0, 3).map((report, idx) => (
                      <div key={idx} className="text-xs text-gray-400">
                        {new Date(report.created_at).toLocaleString()} - {report.description?.substring(0, 30)}...
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setTooltip(null)}
                  className="w-full text-gray-400 hover:text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-gray-800/90 border border-gray-600 rounded-lg p-3">
            <h4 className="text-white text-sm font-medium mb-2">Threat Intensity</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-300">Critical (70%+)</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-gray-300">Moderate (30-70%)</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-300">Low (<30%)</span>
              </div>
            </div>
          </div>

          {/* No data message */}
          {threatClusters.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <AlertTriangle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>No threat data for selected filters</p>
                <p className="text-sm mt-1">Adjust time range or threat type to see data</p>
              </div>
            </div>
          )}
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
            <div className="text-red-400 text-sm">High Intensity Zones</div>
            <div className="text-white text-2xl font-bold">
              {threatClusters.filter(c => c.intensity > 0.7).length}
            </div>
          </div>
          
          <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3">
            <div className="text-blue-400 text-sm">Active Regions</div>
            <div className="text-white text-2xl font-bold">
              {new Set(threatClusters.map(c => c.region)).size}
            </div>
          </div>
          
          <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3">
            <div className="text-yellow-400 text-sm">Total Reports</div>
            <div className="text-white text-2xl font-bold">
              {filteredReports.length}
            </div>
          </div>
          
          <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-3">
            <div className="text-green-400 text-sm">Threat Types</div>
            <div className="text-white text-2xl font-bold">
              {new Set(threatClusters.map(c => c.threatType)).size}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicGeoThreatMap;
