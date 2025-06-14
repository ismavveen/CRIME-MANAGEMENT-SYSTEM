
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

    const { reportData, files } = await req.json();

    console.log('Received report submission:', reportData);

    // Enhanced secure serial number generation with multiple layers
    const generateSecureSerialNumber = () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const day = currentDate.getDate().toString().padStart(2, '0');
      
      // Generate a more secure random component using crypto
      const randomBytes = new Uint8Array(6);
      crypto.getRandomValues(randomBytes);
      const randomComponent = Array.from(randomBytes)
        .map(b => b.toString(36))
        .join('')
        .substring(0, 8)
        .toUpperCase();
      
      // Add timestamp component for uniqueness
      const timestampComponent = currentDate.getTime().toString().slice(-6);
      
      // Combine components with DHQ prefix for official identification
      return `DHQ${year}${month}${day}${timestampComponent}${randomComponent}`;
    };

    // Upload files if any
    let uploadedImages: string[] = [];
    let uploadedVideos: string[] = [];
    let uploadedDocuments: string[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const fileName = `${Date.now()}-${file.name}`;
        const { data: fileData, error: fileError } = await supabaseClient.storage
          .from('report-files')
          .upload(fileName, file.data, {
            contentType: file.type,
          });

        if (fileError) {
          console.error('File upload error:', fileError);
          continue;
        }

        const { data: { publicUrl } } = supabaseClient.storage
          .from('report-files')
          .getPublicUrl(fileData.path);

        // Categorize files by type
        if (file.type.startsWith('image/')) {
          uploadedImages.push(publicUrl);
        } else if (file.type.startsWith('video/')) {
          uploadedVideos.push(publicUrl);
        } else {
          uploadedDocuments.push(publicUrl);
        }
      }
    }

    // Generate unique serial number with retry logic for ultimate uniqueness
    let serialNumber: string;
    let attempts = 0;
    const maxAttempts = 5;

    do {
      serialNumber = generateSecureSerialNumber();
      attempts++;
      
      // Check if serial number already exists
      const { data: existingReport } = await supabaseClient
        .from('reports')
        .select('id')
        .eq('serial_number', serialNumber)
        .maybeSingle();
      
      if (!existingReport) {
        break; // Unique serial number found
      }
      
      if (attempts >= maxAttempts) {
        throw new Error('Unable to generate unique serial number after multiple attempts');
      }
    } while (attempts < maxAttempts);

    // Prepare report data for database insertion with secure serial number
    const dbReportData = {
      serial_number: serialNumber,
      description: reportData.description,
      threat_type: reportData.threatType || reportData.threat_type,
      location: reportData.location,
      manual_location: reportData.manualLocation || reportData.manual_location,
      urgency: reportData.urgency || 'medium',
      priority: reportData.priority || (reportData.urgency === 'critical' ? 'high' : 'medium'),
      status: 'pending',
      state: reportData.state,
      local_government: reportData.localGovernment || reportData.local_government,
      full_address: reportData.fullAddress || reportData.full_address,
      landmark: reportData.landmark,
      latitude: reportData.latitude,
      longitude: reportData.longitude,
      location_accuracy: reportData.locationAccuracy || reportData.location_accuracy,
      reporter_type: 'external_portal',
      submission_source: 'external_portal',
      is_anonymous: reportData.isAnonymous ?? true,
      reporter_name: reportData.isAnonymous ? null : reportData.reporterName,
      reporter_contact: reportData.isAnonymous ? null : reportData.reporterContact,
      reporter_phone: reportData.isAnonymous ? null : reportData.reporterPhone,
      reporter_email: reportData.isAnonymous ? null : reportData.reporterEmail,
      timestamp: new Date().toISOString(),
      images: uploadedImages.length > 0 ? uploadedImages : null,
      videos: uploadedVideos.length > 0 ? uploadedVideos : null,
      documents: uploadedDocuments.length > 0 ? uploadedDocuments : null,
      validation_status: 'pending',
      metadata: {
        submissionTimestamp: new Date().toISOString(),
        userAgent: req.headers.get('user-agent'),
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        filesUploaded: {
          images: uploadedImages.length,
          videos: uploadedVideos.length,
          documents: uploadedDocuments.length
        },
        serialNumberGenerated: new Date().toISOString()
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Inserting report with secure serial number:', serialNumber);

    // Insert the report with the securely generated serial number
    const { data: insertedReport, error: insertError } = await supabaseClient
      .from('reports')
      .insert([dbReportData])
      .select()
      .single();

    if (insertError) {
      console.error('Report insertion error:', insertError);
      throw insertError;
    }

    console.log('Report inserted successfully with serial number:', insertedReport.serial_number);

    return new Response(
      JSON.stringify({
        success: true,
        reportId: insertedReport.id,
        serialNumber: insertedReport.serial_number,
        message: 'Report submitted successfully with secure reference number'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error processing report submission:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to submit report'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
