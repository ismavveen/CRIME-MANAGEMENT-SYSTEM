
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const virusTotalApiKey = Deno.env.get('VIRUSTOTAL_API_KEY');
    if (!virusTotalApiKey) {
      throw new Error('VirusTotal API key not configured');
    }

    const { fileUrl, reportId, fileType } = await req.json();

    console.log('Scanning file with VirusTotal:', fileUrl);

    // Fetch the file for scanning
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error('Failed to fetch file for scanning');
    }

    const fileBuffer = await fileResponse.arrayBuffer();
    const fileSize = fileBuffer.byteLength;

    // Basic file validation
    const maxFileSize = 50 * 1024 * 1024; // 50MB limit
    if (fileSize > maxFileSize) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'File too large for scanning',
          scanResult: 'rejected'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Perform VirusTotal scanning
    const scanResult = await performVirusTotalScan(fileBuffer, fileType, virusTotalApiKey);

    // Create scan log entry
    const { error: logError } = await supabaseClient
      .from('file_scan_logs')
      .insert({
        file_url: fileUrl,
        report_id: reportId,
        file_type: fileType,
        file_size: fileSize,
        scan_result: scanResult.status,
        threats_detected: scanResult.threats,
        scan_timestamp: new Date().toISOString(),
        scanner_version: 'VirusTotal v3',
        scan_details: scanResult.details
      });

    if (logError) {
      console.error('Failed to log scan result:', logError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        scanResult: scanResult.status,
        threats: scanResult.threats,
        fileSize: fileSize,
        scanDetails: scanResult.details,
        message: scanResult.status === 'clean' ? 'File is safe to access' : 'Threats detected in file'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error scanning file:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to scan file',
        scanResult: 'error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// VirusTotal file scanning function
async function performVirusTotalScan(fileBuffer: ArrayBuffer, fileType: string, apiKey: string) {
  try {
    // Create form data for file upload
    const formData = new FormData();
    const fileBlob = new Blob([fileBuffer], { type: fileType });
    formData.append('file', fileBlob);

    console.log('Uploading file to VirusTotal for analysis...');

    // Upload file to VirusTotal
    const uploadResponse = await fetch('https://www.virustotal.com/vtapi/v2/file/scan', {
      method: 'POST',
      headers: {
        'apikey': apiKey,
      },
      body: formData
    });

    if (!uploadResponse.ok) {
      throw new Error(`VirusTotal upload failed: ${uploadResponse.status}`);
    }

    const uploadResult = await uploadResponse.json();
    console.log('VirusTotal upload result:', uploadResult);

    if (!uploadResult.resource) {
      throw new Error('Failed to get scan resource from VirusTotal');
    }

    // Wait a moment for initial scan
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Get scan report
    const reportResponse = await fetch(`https://www.virustotal.com/vtapi/v2/file/report?apikey=${apiKey}&resource=${uploadResult.resource}`);
    
    if (!reportResponse.ok) {
      throw new Error(`VirusTotal report failed: ${reportResponse.status}`);
    }

    const reportResult = await reportResponse.json();
    console.log('VirusTotal scan report:', reportResult);

    // Parse results
    if (reportResult.response_code === 1) {
      const positives = reportResult.positives || 0;
      const total = reportResult.total || 0;
      
      if (positives > 0) {
        const threats = [];
        if (reportResult.scans) {
          for (const [engine, result] of Object.entries(reportResult.scans)) {
            if (result.detected) {
              threats.push(`${engine}: ${result.result}`);
            }
          }
        }
        
        return {
          status: 'infected',
          threats: threats.length > 0 ? threats : [`${positives} of ${total} engines detected threats`],
          details: {
            positives,
            total,
            scan_date: reportResult.scan_date,
            permalink: reportResult.permalink
          }
        };
      } else {
        return {
          status: 'clean',
          threats: [],
          details: {
            positives: 0,
            total,
            scan_date: reportResult.scan_date,
            permalink: reportResult.permalink
          }
        };
      }
    } else if (reportResult.response_code === 0) {
      // File not found in database, but upload was successful
      return {
        status: 'pending',
        threats: [],
        details: {
          message: 'File queued for analysis',
          resource: uploadResult.resource
        }
      };
    } else if (reportResult.response_code === -2) {
      // Still queued for analysis
      return {
        status: 'pending',
        threats: [],
        details: {
          message: 'File still being analyzed',
          resource: uploadResult.resource
        }
      };
    } else {
      throw new Error('Invalid response from VirusTotal');
    }

  } catch (error) {
    console.error('VirusTotal scanning error:', error);
    
    // Fallback to basic file type validation if VirusTotal fails
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/quicktime',
      'application/pdf', 'text/plain'
    ];

    if (!allowedTypes.includes(fileType)) {
      return {
        status: 'suspicious',
        threats: ['Unsupported file type'],
        details: { error: error.message, fallback: true }
      };
    }

    return {
      status: 'error',
      threats: [`Scan failed: ${error.message}`],
      details: { error: error.message, fallback: true }
    };
  }
}
