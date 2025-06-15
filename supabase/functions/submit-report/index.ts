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
    console.log('Files to upload:', files?.length || 0);

    // Generate a secure serial number in the format DHQ-YYYY-NNNNNN
    const generateSecureSerialNumber = () => {
      const year = new Date().getFullYear();
      const randomNumber = Math.floor(Math.random() * 1000000);
      return `DHQ-${year}-${String(randomNumber).padStart(6, '0')}`;
    };

    // Upload files if any with proper error handling
    let uploadedImages: string[] = [];
    let uploadedVideos: string[] = [];
    let uploadedDocuments: string[] = [];

    if (files && files.length > 0) {
      console.log('Processing file uploads...');
      
      for (const file of files) {
        try {
          // Convert array back to Uint8Array for proper upload
          const fileData = new Uint8Array(file.data);
          const fileName = `${Date.now()}-${file.name}`;
          
          console.log(`Uploading file: ${fileName} (${fileData.length} bytes)`);

          const { data: uploadData, error: fileError } = await supabaseClient.storage
            .from('report-files')
            .upload(fileName, fileData, {
              contentType: file.type,
              duplex: 'half'
            });

          if (fileError) {
            console.error('File upload error for', fileName, ':', fileError);
            continue; // Skip this file but continue with others
          }

          const { data: { publicUrl } } = supabaseClient.storage
            .from('report-files')
            .getPublicUrl(uploadData.path);

          console.log(`File uploaded successfully: ${publicUrl}`);

          // Categorize files by type, including live witness videos
          if (file.type.startsWith('image/')) {
            uploadedImages.push(publicUrl);
          } else if (file.type.startsWith('video/') || file.name.includes('live-witness')) {
            uploadedVideos.push(publicUrl);
          } else {
            uploadedDocuments.push(publicUrl);
          }
        } catch (error) {
          console.error('Error processing file:', file.name, error);
          // Continue with other files
        }
      }
      
      console.log('File upload summary:', {
        images: uploadedImages.length,
        videos: uploadedVideos.length,
        documents: uploadedDocuments.length
      });
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
          documents: uploadedDocuments.length,
          totalFiles: uploadedImages.length + uploadedVideos.length + uploadedDocuments.length
        },
        serialNumberGenerated: new Date().toISOString(),
        hasLiveWitness: files?.some((f: any) => f.name.includes('live-witness')) || false
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
      throw new Error(`Database error: ${insertError.message}`);
    }

    console.log('Report inserted successfully with serial number:', insertedReport.serial_number);

    return new Response(
      JSON.stringify({
        success: true,
        reportId: insertedReport.id,
        serialNumber: insertedReport.serial_number,
        message: 'Report submitted successfully with secure reference number',
        filesUploaded: {
          images: uploadedImages.length,
          videos: uploadedVideos.length,
          documents: uploadedDocuments.length
        }
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
        error: error.message || 'Failed to submit report',
        details: error.stack || 'No additional details available'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
