
import React, { useState } from 'react';
import IncidentDetailsDialog from '@/components/IncidentDetailsDialog';
import AssignmentDialog from './AssignmentDialog';
import { useReports } from '@/hooks/useReports';
import { useAssignments } from '@/hooks/useAssignments';
import { useUnitCommanders } from '@/hooks/useUnitCommanders';
import { useToast } from '@/hooks/use-toast';
import { useMapIncidents } from '@/hooks/useMapIncidents';
import MapDisplay from './map/MapDisplay';
import { MapIncident, DetailedIncident } from '@/types/incidents';


interface NigeriaMapProps {
  filterByState?: string;
}

const NigeriaMap: React.FC<NigeriaMapProps> = ({ filterByState }) => {
  const { reports, loading, updateReportStatus, refetch: refetchReports } = useReports();
  const { assignments, createAssignment } = useAssignments();
  const { commanders } = useUnitCommanders();
  const { toast } = useToast();

  const { incidents, incidentDetails } = useMapIncidents(reports, assignments, commanders, filterByState);

  const [selectedMapPoint, setSelectedMapPoint] = useState<MapIncident | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<DetailedIncident | null>(null);

  const handleMarkerClick = (incident: MapIncident) => {
    setSelectedMapPoint(incident);
  };

  const handleViewDetails = () => {
    if (!selectedMapPoint) return;
    
    const detail = incidentDetails.find(d => d.id === selectedMapPoint.id);
    if (detail) {
      setSelectedIncident(detail);
      setShowDetailsDialog(true);
      setSelectedMapPoint(null);
    }
  };

  const handleAssignReport = () => {
    if (!selectedMapPoint) return;
    const detail = incidentDetails.find(d => d.id === selectedMapPoint.id);
    if (detail) {
      setSelectedIncident(detail);
      setShowAssignDialog(true);
    }
  };

  const handleAssign = async (commanderId: string) => {
    if (!selectedIncident) return;
    
    try {
      await createAssignment({
        report_id: selectedIncident.id,
        commander_id: commanderId,
      });

      await updateReportStatus(selectedIncident.id, "assigned");
      
      toast({
        title: "Report Assigned",
        description: `Report ${selectedIncident.type} has been assigned successfully.`,
      });

      refetchReports();
    } catch (error: any) {
      toast({
        title: "Assignment Failed",
        description: error.message || "Could not assign the report.",
        variant: "destructive",
      });
    } finally {
      setShowAssignDialog(false);
      setSelectedMapPoint(null);
      setSelectedIncident(null);
    }
  };

  const handleAssignFromDialog = (incident: DetailedIncident) => {
    setSelectedIncident(incident);
    setShowDetailsDialog(false);
    setShowAssignDialog(true);
  };

  if (loading) {
    return (
      <div className="dhq-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Nigeria Threat Map</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-yellow-400 text-sm">SYNCING LIVE DATA</span>
          </div>
        </div>
        <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
          <div className="text-white">Loading reports...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dhq-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">🚨 LIVE THREAT MAP</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-semibold">LIVE</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-dhq-red rounded-full animate-pulse"></div>
            <span className="text-gray-400 text-sm">Critical ({incidents.filter(i => i.type === 'critical').length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-400 text-sm">Unassigned ({incidents.filter(i => i.type === 'warning').length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-400 text-sm">Assigned ({incidents.filter(i => i.type === 'assigned').length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400 text-sm">Resolved ({incidents.filter(i => i.type === 'resolved').length})</span>
          </div>
        </div>
      </div>

      <MapDisplay
        incidents={incidents}
        selectedMapPoint={selectedMapPoint}
        onMarkerClick={handleMarkerClick}
        onViewDetails={handleViewDetails}
        onAssignReport={handleAssignReport}
        onCloseTooltip={() => setSelectedMapPoint(null)}
      />

      <IncidentDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        incident={selectedIncident}
        onAssignClick={handleAssignFromDialog}
      />

      <AssignmentDialog
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        reportId={selectedIncident?.id || null}
        reportLocation={selectedIncident?.location}
        reportState={selectedIncident?.state}
        reportLatitude={selectedIncident?.coordinates?.lat}
        reportLongitude={selectedIncident?.coordinates?.lng}
        onAssign={handleAssign}
      />
    </div>
  );
};

export default NigeriaMap;
