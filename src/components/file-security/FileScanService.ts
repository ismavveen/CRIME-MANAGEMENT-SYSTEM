
/**
 * File Security Service
 * Handles all file scanning operations and security checks
 * Implements secure API communication with proper error handling
 */
import { supabase } from '@/integrations/supabase/client';

export interface FileScanLog {
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

export interface ReportFile {
  id: string;
  file_url: string;
  file_type: string;
  threat_type: string;
  description: string;
  created_at: string;
}

/**
 * Secure file scanning service with proper error handling and validation
 */
export class FileScanService {
  /**
   * Fetches scan logs with proper error handling and type safety
   */
  static async fetchScanLogs(): Promise<FileScanLog[]> {
    try {
      const { data, error } = await supabase
        .from('file_scan_logs')
        .select('*')
        .order('scan_timestamp', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching scan logs:', error);
        throw new Error(`Failed to fetch scan logs: ${error.message}`);
      }

      return data || [];
    } catch (error: any) {
      console.error('File scan service error:', error);
      // Return empty array as fallback to prevent app crashes
      return [];
    }
  }

  /**
   * Fetches report files with comprehensive error handling
   */
  static async fetchReportFiles(): Promise<ReportFile[]> {
    try {
      const { data: reports, error } = await supabase
        .from('reports')
        .select('id, threat_type, description, created_at, images, videos, documents')
        .or('images.not.is.null,videos.not.is.null,documents.not.is.null');

      if (error) {
        console.error('Error fetching reports:', error);
        throw new Error(`Failed to fetch report files: ${error.message}`);
      }

      const files: ReportFile[] = [];

      // Process reports and extract file information with validation
      reports?.forEach(report => {
        // Validate report data before processing
        if (!report.id || !report.threat_type) {
          console.warn('Skipping invalid report:', report);
          return;
        }

        // Process images with type safety
        if (Array.isArray(report.images)) {
          report.images.forEach((url: string, index: number) => {
            if (typeof url === 'string' && url.trim()) {
              files.push({
                id: `${report.id}-img-${index}`,
                file_url: url,
                file_type: 'image',
                threat_type: report.threat_type,
                description: report.description || 'No description',
                created_at: report.created_at
              });
            }
          });
        }

        // Process videos with type safety
        if (Array.isArray(report.videos)) {
          report.videos.forEach((url: string, index: number) => {
            if (typeof url === 'string' && url.trim()) {
              files.push({
                id: `${report.id}-vid-${index}`,
                file_url: url,
                file_type: 'video',
                threat_type: report.threat_type,
                description: report.description || 'No description',
                created_at: report.created_at
              });
            }
          });
        }

        // Process documents with type safety
        if (Array.isArray(report.documents)) {
          report.documents.forEach((url: string, index: number) => {
            if (typeof url === 'string' && url.trim()) {
              files.push({
                id: `${report.id}-doc-${index}`,
                file_url: url,
                file_type: 'document',
                threat_type: report.threat_type,
                description: report.description || 'No description',
                created_at: report.created_at
              });
            }
          });
        }
      });

      return files;
    } catch (error: any) {
      console.error('Error processing report files:', error);
      throw new Error(`Failed to process report files: ${error.message}`);
    }
  }

  /**
   * Initiates secure file scan with proper validation
   */
  static async scanFile(fileUrl: string, reportId: string, fileType: string): Promise<any> {
    // Input validation
    if (!fileUrl?.trim() || !reportId?.trim() || !fileType?.trim()) {
      throw new Error('Invalid scan parameters: URL, report ID, and file type are required');
    }

    try {
      const { data, error } = await supabase.functions.invoke('scan-file', {
        body: {
          fileUrl: fileUrl.trim(),
          reportId: reportId.trim(),
          fileType: fileType.trim()
        }
      });

      if (error) {
        console.error('File scan error:', error);
        throw new Error(`Scan failed: ${error.message}`);
      }

      return data;
    } catch (error: any) {
      console.error('File scan service error:', error);
      throw new Error(`File scan failed: ${error.message}`);
    }
  }
}
