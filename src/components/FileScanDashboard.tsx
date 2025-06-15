
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Shield, AlertTriangle, CheckCircle, Scan, Download, Eye, Clock, FileText, Image, Video, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import MediaViewerModal from './MediaViewerModal';

interface FileScanLog {
  id: string;
  file_url: string;
  report_id: string;
  file_type: string;
  file_size: number;
  scan_result: string;
  threats_detected: string[];
  scan_timestamp: string;
  scanner_version: string;
  scan_details: any;
}

interface ReportFile {
  id: string;
  file_url: string;
  file_type: string;
  threat_type: string;
  description: string;
  created_at: string;
}

const FileScanDashboard = () => {
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

  useEffect(() => {
    fetchScanLogs();
    fetchReportFiles();
  }, []);

  const fetchScanLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('file_scan_logs')
        .select('*')
        .order('scan_timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      setScanLogs(data || []);
    } catch (error: any) {
      console.error('Error fetching scan logs:', error);
      toast({
        title: "Failed to load scan logs",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchReportFiles = async () => {
    try {
      setLoading(true);
      const { data: reports, error } = await supabase
        .from('crime_reports')
        .select('id, threat_type, description, created_at, images, videos, documents')
        .not('images', 'is', null)
        .or('not.videos.is.null,not.documents.is.null');

      if (error) throw error;

      const files: ReportFile[] = [];
      reports?.forEach(report => {
        // Add images
        report.images?.forEach((url: string) => {
          files.push({
            id: `${report.id}-img-${url}`,
            file_url: url,
            file_type: 'image',
            threat_type: report.threat_type,
            description: report.description,
            created_at: report.created_at
          });
        });

        // Add videos
        report.videos?.forEach((url: string) => {
          files.push({
            id: `${report.id}-vid-${url}`,
            file_url: url,
            file_type: 'video',
            threat_type: report.threat_type,
            description: report.description,
            created_at: report.created_at
          });
        });

        // Add documents
        report.documents?.forEach((url: string) => {
          files.push({
            id: `${report.id}-doc-${url}`,
            file_url: url,
            file_type: 'document',
            threat_type: report.threat_type,
            description: report.description,
            created_at: report.created_at
          });
        });
      });

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
  };

  const scanFile = async (fileUrl: string, reportId: string, fileType: string) => {
    try {
      setScanning(fileUrl);
      
      const { data, error } = await supabase.functions.invoke('scan-file', {
        body: {
          fileUrl,
          reportId,
          fileType
        }
      });

      if (error) throw error;

      toast({
        title: data.scanResult === 'clean' ? "File is safe" : "Scan completed",
        description: data.message,
        variant: data.scanResult === 'clean' ? "default" : "destructive",
      });

      // Refresh scan logs
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
  };

  const getScanStatusBadge = (scanResult: string) => {
    switch (scanResult) {
      case 'clean':
        return (
          <Badge className="bg-green-600 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Safe
          </Badge>
        );
      case 'infected':
        return (
          <Badge className="bg-red-600 text-white">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Infected
          </Badge>
        );
      case 'suspicious':
        return (
          <Badge className="bg-orange-600 text-white">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Suspicious
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-600 text-white">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-600 text-white">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <Image className="w-4 h-4 text-blue-400" />;
    if (fileType.includes('video')) return <Video className="w-4 h-4 text-green-400" />;
    return <FileText className="w-4 h-4 text-yellow-400" />;
  };

  const getFileScanStatus = (fileUrl: string) => {
    const scanLog = scanLogs.find(log => log.file_url === fileUrl);
    return scanLog || null;
  };

  const handleMediaView = (fileUrl: string, fileType: string, reportId: string) => {
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
  };

  const filteredFiles = reportFiles.filter(file => {
    const scanStatus = getFileScanStatus(file.file_url);
    const matchesFilter = filter === 'all' || 
      (filter === 'scanned' && scanStatus) ||
      (filter === 'unscanned' && !scanStatus) ||
      (filter === 'infected' && scanStatus?.scan_result === 'infected') ||
      (filter === 'clean' && scanStatus?.scan_result === 'clean');
    
    const matchesSearch = searchTerm === '' ||
      file.threat_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gray-800/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Shield className="h-6 w-6 text-cyan-400" />
            <span>File Security Dashboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h3 className="text-white font-semibold">Total Files</h3>
              <p className="text-2xl font-bold text-cyan-400">{reportFiles.length}</p>
            </div>
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h3 className="text-white font-semibold">Scanned Files</h3>
              <p className="text-2xl font-bold text-green-400">{scanLogs.length}</p>
            </div>
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h3 className="text-white font-semibold">Clean Files</h3>
              <p className="text-2xl font-bold text-green-400">
                {scanLogs.filter(log => log.scan_result === 'clean').length}
              </p>
            </div>
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <h3 className="text-white font-semibold">Threats Detected</h3>
              <p className="text-2xl font-bold text-red-400">
                {scanLogs.filter(log => ['infected', 'suspicious'].includes(log.scan_result)).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="bg-gray-800/50 border-gray-700/50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by threat type or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48 bg-gray-700/50 border-gray-600">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All Files</SelectItem>
                <SelectItem value="unscanned">Unscanned</SelectItem>
                <SelectItem value="scanned">Scanned</SelectItem>
                <SelectItem value="clean">Clean</SelectItem>
                <SelectItem value="infected">Infected/Suspicious</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                fetchScanLogs();
                fetchReportFiles();
              }}
              variant="outline"
              className="bg-cyan-600/20 border-cyan-500 text-cyan-300"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Files Table */}
      <Card className="bg-gray-800/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white">Uploaded Files ({filteredFiles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="space-y-2">
              {loading ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="animate-spin w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                  Loading files...
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
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
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(file.file_url, '_blank')}
                              className="border-blue-500 text-blue-300 hover:bg-blue-600/20"
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
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {scanLogs.slice(0, 10).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(log.file_type)}
                  <div>
                    <p className="text-white text-sm font-medium">
                      File scanned - {log.file_size} bytes
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
