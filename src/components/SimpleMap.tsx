
import React, { useState } from 'react';
import { useReports } from '@/hooks/useReports';
import { useAssignments } from '@/hooks/useAssignments';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, AlertTriangle, CheckCircle, Clock, FileText } from 'lucide-react';

interface SimpleMapProps {
  commanderState?: string;
  showAllReports?: boolean;
}

const SimpleMap: React.FC<SimpleMapProps> = ({ commanderState, showAllReports = true }) => {
  const { reports } = useReports();
  const { assignments } = useAssignments();
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filter reports based on commander's state if provided
  const filteredReports = showAllReports 
    ? reports 
    : reports.filter(r => r.state === commanderState);

  // Convert reports to map points
  const mapPoints = filteredReports
    .filter(report => report.latitude && report.longitude)
    .map(report => {
      const assignment = assignments.find(a => a.report_id === report.id);
      let status: 'critical' | 'warning' | 'assigned' | 'resolved' = 'warning';
      
      if (assignment?.status === 'resolved') {
        status = 'resolved';
      } else if (assignment) {
        status = 'assigned';
      } else if (report.urgency === 'critical' || report.priority === 'high') {
        status = 'critical';
      }

      return {
        ...report,
        assignment,
        status,
        isAssigned: !!assignment
      };
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return '#DC2626';
      case 'warning': return '#F59E0B';
      case 'assigned': return '#3B82F6';
      case 'resolved': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'assigned': return <Clock className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const handlePointClick = (report: any) => {
    setSelectedReport(report);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gray-800/50 border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Threat Map</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-300">Critical ({mapPoints.filter(p => p.status === 'critical').length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-gray-300">Pending ({mapPoints.filter(p => p.status === 'warning').length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-300">Assigned ({mapPoints.filter(p => p.status === 'assigned').length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-300">Resolved ({mapPoints.filter(p => p.status === 'resolved').length})</span>
            </div>
          </div>
        </div>

        {/* Simple SVG Map */}
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

            {/* Report markers */}
            {mapPoints.map((point, index) => {
              const x = ((point.longitude! + 15) / 25) * 300 + 50;
              const y = ((20 - point.latitude!) / 15) * 200 + 50;
              
              return (
                <g key={point.id}>
                  {/* Pulsing ring for critical reports */}
                  {point.status === 'critical' && (
                    <circle
                      cx={x}
                      cy={y}
                      r="12"
                      fill="none"
                      stroke={getStatusColor(point.status)}
                      strokeWidth="2"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}
                  
                  {/* Main marker */}
                  <circle
                    cx={x}
                    cy={y}
                    r="6"
                    fill={getStatusColor(point.status)}
                    className="cursor-pointer hover:opacity-80 transition-all hover:scale-125"
                    onClick={() => handlePointClick(point)}
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
                  />
                  
                  {/* Border */}
                  <circle
                    cx={x}
                    cy={y}
                    r="7"
                    fill="none"
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth="1"
                  />
                </g>
              );
            })}
          </svg>

          {mapPoints.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>No reports with location data</p>
                <p className="text-sm mt-1">Reports will appear here as they are submitted</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Report Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Report Details</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{selectedReport.threat_type}</h3>
                <Badge style={{ backgroundColor: getStatusColor(selectedReport.status) }}>
                  {selectedReport.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Location:</span>
                  <p className="text-white">{selectedReport.location || selectedReport.manual_location}</p>
                </div>
                <div>
                  <span className="text-gray-400">Priority:</span>
                  <p className="text-white">{selectedReport.priority || selectedReport.urgency}</p>
                </div>
                <div>
                  <span className="text-gray-400">Reported:</span>
                  <p className="text-white">{new Date(selectedReport.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <p className="text-white">{selectedReport.assignment?.status || 'Unassigned'}</p>
                </div>
              </div>
              
              <div>
                <span className="text-gray-400">Description:</span>
                <p className="text-white mt-1">{selectedReport.description}</p>
              </div>
              
              {selectedReport.assignment && (
                <div className="bg-blue-900/20 border border-blue-700/50 p-3 rounded">
                  <h4 className="font-medium text-blue-300 mb-2">Assignment Details</h4>
                  <p className="text-sm text-gray-300">
                    <strong>Assigned to:</strong> {selectedReport.assignment.assigned_to_commander}
                  </p>
                  <p className="text-sm text-gray-300">
                    <strong>Assigned on:</strong> {new Date(selectedReport.assignment.assigned_at).toLocaleString()}
                  </p>
                  {selectedReport.assignment.notes && (
                    <p className="text-sm text-gray-300">
                      <strong>Notes:</strong> {selectedReport.assignment.notes}
                    </p>
                  )}
                </div>
              )}
              
              <div className="flex justify-end">
                <Button onClick={() => setDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SimpleMap;
