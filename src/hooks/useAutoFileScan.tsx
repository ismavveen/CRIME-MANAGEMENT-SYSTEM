
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FileScanService } from '@/components/file-security/FileScanService';

export const useAutoFileScan = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to new reports to scan their files automatically
    const channel = supabase
      .channel('auto-file-scan')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reports'
        },
        async (payload) => {
          console.log('New report detected, scanning files...', payload);
          const report = payload.new;
          
          // Scan all files in the report
          const filesToScan = [];
          
          // Add images
          if (report.images && Array.isArray(report.images)) {
            report.images.forEach((url: string, index: number) => {
              if (url?.trim()) {
                filesToScan.push({
                  url: url.trim(),
                  type: 'image',
                  id: `${report.id}-img-${index}`
                });
              }
            });
          }
          
          // Add videos
          if (report.videos && Array.isArray(report.videos)) {
            report.videos.forEach((url: string, index: number) => {
              if (url?.trim()) {
                filesToScan.push({
                  url: url.trim(),
                  type: 'video',
                  id: `${report.id}-vid-${index}`
                });
              }
            });
          }
          
          // Add documents
          if (report.documents && Array.isArray(report.documents)) {
            report.documents.forEach((url: string, index: number) => {
              if (url?.trim()) {
                filesToScan.push({
                  url: url.trim(),
                  type: 'document',
                  id: `${report.id}-doc-${index}`
                });
              }
            });
          }

          // Scan each file
          for (const file of filesToScan) {
            try {
              console.log(`Auto-scanning file: ${file.url}`);
              const scanResult = await FileScanService.scanFile(file.url, report.id, file.type);
              
              if (scanResult.scanResult === 'infected' || scanResult.scanResult === 'suspicious') {
                toast({
                  title: "🚨 Security Alert",
                  description: `Virus detected in uploaded file from report ${report.serial_number || report.id.slice(0, 8)}`,
                  variant: "destructive",
                });
              }
            } catch (error) {
              console.error(`Failed to scan file ${file.url}:`, error);
            }
          }

          if (filesToScan.length > 0) {
            toast({
              title: "🔍 File Security Scan",
              description: `Automatically scanned ${filesToScan.length} file(s) from new report`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);
};
