
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

    // Generate serial number if not provided
    const generateSerialNumber = () => {
      const year = new Date().getFullYear();
      const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
      const randomNum = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
      return `${year}${month}${randomNum}`;
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

    // Prepare report data for database insertion
    const dbReportData = {
      serial_number: generateSerialNumber(),
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
        }
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Inserting report data:', dbReportData);

    // Insert the report
    const { data: insertedReport, error: insertError } = await supabaseClient
      .from('reports')
      .insert([dbReportData])
      .select()
      .single();

    if (insertError) {
      console.error('Report insertion error:', insertError);
      throw insertError;
    }

    console.log('Report inserted successfully:', insertedReport);

    return new Response(
      JSON.stringify({
        success: true,
        reportId: insertedReport.id,
        serialNumber: insertedReport.serial_number,
        message: 'Report submitted successfully'
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
