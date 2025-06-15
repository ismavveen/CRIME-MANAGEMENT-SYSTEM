/**
 * File Scan Dashboard - Main Component
 * Implements security best practices and modular architecture
 * Provides comprehensive file security monitoring capabilities
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, Scan, Download, Eye, Clock, FileText, Image, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MediaViewerModal from './MediaViewerModal';
import FileScanMetrics from './file-security/FileScanMetrics';
import FileScanFilters from './file-security/FileScanFilters';
import ThreatStatusNotifications from './ThreatStatusNotifications';
import { FileScanService, FileScanLog, ReportFile } from './file-security/FileScanService';
import { useAutoFileScan } from '@/hooks/useAutoFileScan';

const FileScanDashboard = () => {
  // Initialize auto-scanning
  useAutoFileScan();

  // ... keep existing code (state management)
  const [scanLogs, setScanLogs] = useState<FileScanLog[]>([]);
  const [reportFiles, setReportFiles] = useState<ReportFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{
    url: string;
    type: 'image' | 'video';
    reportId: string;
  } | null>(null);

  const { toast } = useToast();

  // ... keep existing code (fetchScanLogs, fetchReportFiles, scanFile, etc.)
  const fetchScanLogs = useCallback(async () => {
    try {
      const logs = await FileScanService.fetchScanLogs();
      setScanLogs(logs);
    } catch (error: any) {
      console.error('Error fetching scan logs:', error);
      toast({
        title: "Failed to load scan logs",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchReportFiles = useCallback(async () => {
    try {
      setLoading(true);
      const files = await FileScanService.fetchReportFiles();
      setReportFiles(files);
    } catch (error: any) {
      console.error('Error fetching report files:', error);
      toast({
        title: "Failed to load report files",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const scanFile = useCallback(async (fileUrl: string, reportId: string, fileType: string) => {
    try {
      setScanning(fileUrl);
      
      const data = await FileScanService.scanFile(fileUrl, reportId, fileType);

      toast({
        title: data.scanResult === 'clean' ? "File is safe" : "Scan completed",
        description: data.message,
        variant: data.scanResult === 'clean' ? "default" : "destructive",
      });

      await fetchScanLogs();
    } catch (error: any) {
      console.error('Error scanning file:', error);
      toast({
        title: "Scan failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setScanning(null);
    }
  }, [toast, fetchScanLogs]);

  // ... keep existing code (useEffect, helper functions, etc.)
  useEffect(() => {
    fetchScanLogs();
    fetchReportFiles();
  }, [fetchScanLogs, fetchReportFiles]);

  const getScanStatusBadge = useCallback((scanResult: string) => {
    const badges = {
      clean: (
        <Badge className="bg-green-600 text-white" aria-label="File is safe">
          <CheckCircle className="w-3 h-3 mr-1" />
          Safe
        </Badge>
      ),
      infected: (
        <Badge className="bg-red-600 text-white animate-pulse" aria-label="Virus detected">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Infected
        </Badge>
      ),
      suspicious: (
        <Badge className="bg-orange-600 text-white" aria-label="Suspicious file">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Suspicious
        </Badge>
      ),
      pending: (
        <Badge className="bg-yellow-600 text-white" aria-label="Scan pending">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      ),
      default: (
        <Badge className="bg-gray-600 text-white" aria-label="Status unknown">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Unknown
        </Badge>
      )
    };

    return badges[scanResult as keyof typeof badges] || badges.default;
  }, []);

  const getFileIcon = useCallback((fileType: string) => {
    if (fileType.includes('image')) return <Image className="w-4 h-4 text-blue-400" />;
    if (fileType.includes('video')) return <Video className="w-4 h-4 text-green-400" />;
    return <FileText className="w-4 h-4 text-yellow-400" />;
  }, []);

  const getFileScanStatus = useCallback((fileUrl: string) => {
    return scanLogs.find(log => log.file_url === fileUrl) || null;
  }, [scanLogs]);

  const handleMediaView = useCallback((fileUrl: string, fileType: string, reportId: string) => {
    const scanStatus = getFileScanStatus(fileUrl);
    if (scanStatus && scanStatus.scan_result !== 'clean') {
      toast({
        title: "Security warning",
        description: "This file has detected threats and cannot be viewed safely",
        variant: "destructive",
      });
      return;
    }

    const mediaType = fileType.includes('image') ? 'image' : 'video';
    setSelectedMedia({ url: fileUrl, type: mediaType, reportId });
    setMediaViewerOpen(true);
  }, [getFileScanStatus, toast]);

  const filteredFiles = useMemo(() => {
    return reportFiles.filter(file => {
      if (!file || !file.file_url) return false;

      const scanStatus = getFileScanStatus(file.file_url);
      
      const matchesFilter = filter === 'all' || 
        (filter === 'scanned' && scanStatus) ||
        (filter === 'unscanned' && !scanStatus) ||
        (filter === 'infected' && scanStatus?.scan_result === 'infected') ||
        (filter === 'clean' && scanStatus?.scan_result === 'clean');
      
      const matchesSearch = searchTerm === '' ||
        file.threat_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.description?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [reportFiles, filter, searchTerm, getFileScanStatus]);

  const handleRefresh = useCallback(() => {
    fetchScanLogs();
    fetchReportFiles();
  }, [fetchScanLogs, fetchReportFiles]);

  return (
    <div className="space-y-6" role="main" aria-label="File Security Dashboard">
      {/* Real-time Threat Notifications */}
      <ThreatStatusNotifications />

      {/* Auto-scan Status Alert */}
      <Card className="bg-blue-900/20 border-blue-700/50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <div>
              <p className="text-blue-300 font-medium">🤖 Auto-Scan Active</p>
              <p className="text-blue-200 text-sm">
                All new file uploads are automatically scanned with VirusTotal API for security threats
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Section */}
      <FileScanMetrics 
        reportFiles={reportFiles} 
        scanLogs={scanLogs} 
      />

      {/* Filters Section */}
      <FileScanFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filter={filter}
        onFilterChange={setFilter}
        onRefresh={handleRefresh}
        isLoading={loading}
      />

      {/* Files Table */}
      <Card className="bg-gray-800/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white">
            Uploaded Files ({filteredFiles.length.toLocaleString()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto" role="region" aria-label="File list">
            <div className="space-y-2">
              {loading ? (
                <div className="text-center py-8 text-gray-400" role="status" aria-live="polite">
                  <div className="animate-spin w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                  Loading files...
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="text-center py-8 text-gray-400" role="status">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                  <p>No files found matching your criteria</p>
                </div>
              ) : (
                filteredFiles.map((file) => {
                  const scanStatus = getFileScanStatus(file.file_url);
                  const reportId = file.id.split('-')[0];
                  
                  return (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                      role="listitem"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex items-center space-x-2">
                          {getFileIcon(file.file_type)}
                          <div>
                            <p className="text-white font-medium">{file.threat_type}</p>
                            <p className="text-gray-400 text-sm truncate max-w-md">
                              {file.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-gray-400 text-sm">
                          {new Date(file.created_at).toLocaleDateString()}
                        </div>
                        
                        <div>
                          {scanStatus ? (
                            <div className="space-y-1">
                              {getScanStatusBadge(scanStatus.scan_result)}
                              {scanStatus.threats_detected?.length > 0 && (
                                <p className="text-red-400 text-xs">
                                  Threats: {scanStatus.threats_detected.join(', ')}
                                </p>
                              )}
                            </div>
                          ) : (
                            <Badge className="bg-gray-600 text-white">
                              <Clock className="w-3 h-3 mr-1" />
                              Not Scanned
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!scanStatus && (
                          <Button
                            size="sm"
                            onClick={() => scanFile(file.file_url, reportId, file.file_type)}
                            disabled={scanning === file.file_url}
                            className="bg-blue-600 hover:bg-blue-700"
                            aria-label={`Scan ${file.threat_type} file`}
                          >
                            {scanning === file.file_url ? (
                              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                              <Scan className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                        
                        {scanStatus?.scan_result === 'clean' && (
                          <>
                            {(file.file_type.includes('image') || file.file_type.includes('video')) && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMediaView(file.file_url, file.file_type, reportId)}
                                className="border-green-500 text-green-300 hover:bg-green-600/20"
                                aria-label={`View ${file.file_type}`}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(file.file_url, '_blank')}
                              className="border-blue-500 text-blue-300 hover:bg-blue-600/20"
                              aria-label="Download file"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        
                        {scanStatus && ['infected', 'suspicious'].includes(scanStatus.scan_result) && (
                          <div className="text-red-400 text-sm font-medium">
                            ⚠️ BLOCKED
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Scan Logs */}
      <Card className="bg-gray-800/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white">Recent Scan Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto" role="region" aria-label="Recent scan activity">
            {scanLogs.slice(0, 10).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                role="listitem"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(log.file_type)}
                  <div>
                    <p className="text-white text-sm font-medium">
                      File scanned - {log.file_size?.toLocaleString()} bytes
                    </p>
                    <p className="text-gray-400 text-xs">
                      {new Date(log.scan_timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  {getScanStatusBadge(log.scan_result)}
                  {log.threats_detected?.length > 0 && (
                    <p className="text-red-400 text-xs mt-1">
                      {log.threats_detected.length} threat(s)
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Media Viewer Modal */}
      {selectedMedia && (
        <MediaViewerModal
          isOpen={mediaViewerOpen}
          onClose={() => {
            setMediaViewerOpen(false);
            setSelectedMedia(null);
          }}
          mediaUrl={selectedMedia.url}
          mediaType={selectedMedia.type}
          reportId={selectedMedia.reportId}
        />
      )}
    </div>
  );
};

export default FileScanDashboard;
