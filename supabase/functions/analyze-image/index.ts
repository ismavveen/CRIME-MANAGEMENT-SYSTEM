
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VisionAnalysisResult {
  labels: Array<{
    description: string;
    score: number;
  }>;
  text: string;
  objects: Array<{
    name: string;
    score: number;
    boundingBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;
  faces: Array<{
    boundingBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    landmarks: any[];
    emotions: {
      joy: number;
      sorrow: number;
      anger: number;
      surprise: number;
    };
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, reportId } = await req.json();
    
    if (!imageUrl || !reportId) {
      return new Response(
        JSON.stringify({ error: 'Missing imageUrl or reportId' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const googleApiKey = Deno.env.get('GOOGLE_CLOUD_VISION_API_KEY');
    if (!googleApiKey) {
      console.error('Google Cloud Vision API key not found');
      return new Response(
        JSON.stringify({ error: 'API configuration error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Fetch the image from Supabase storage
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch image from storage');
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));

    console.log('Starting Vision API analysis for report:', reportId);

    // Analyze the image using Google Cloud Vision API
    const analysisResult = await analyzeImageWithVision(base64Image, googleApiKey);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Store analysis results in the database
    const { error: insertError } = await supabase
      .from('image_analysis')
      .insert({
        report_id: reportId,
        image_url: imageUrl,
        labels: analysisResult.labels,
        extracted_text: analysisResult.text,
        detected_objects: analysisResult.objects,
        detected_faces: analysisResult.faces,
        analyzed_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error storing analysis results:', insertError);
      throw insertError;
    }

    console.log('Analysis completed and stored for report:', reportId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysisResult,
        message: 'Image analysis completed successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in image analysis:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Image analysis failed', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

async function analyzeImageWithVision(base64Image: string, apiKey: string): Promise<VisionAnalysisResult> {
  const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
  
  const requestBody = {
    requests: [
      {
        image: {
          content: base64Image
        },
        features: [
          { type: 'LABEL_DETECTION', maxResults: 10 },
          { type: 'TEXT_DETECTION', maxResults: 10 },
          { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
          { type: 'FACE_DETECTION', maxResults: 10 }
        ]
      }
    ]
  };

  const response = await fetch(visionApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Vision API error:', errorText);
    throw new Error(`Vision API request failed: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  const annotations = result.responses[0];

  // Parse labels
  const labels = (annotations.labelAnnotations || []).map((label: any) => ({
    description: label.description,
    score: label.score
  }));

  // Parse text
  const textAnnotations = annotations.textAnnotations || [];
  const extractedText = textAnnotations.length > 0 ? textAnnotations[0].description : '';

  // Parse objects
  const objects = (annotations.localizedObjectAnnotations || []).map((obj: any) => ({
    name: obj.name,
    score: obj.score,
    boundingBox: {
      x: obj.boundingPoly.normalizedVertices[0].x || 0,
      y: obj.boundingPoly.normalizedVertices[0].y || 0,
      width: (obj.boundingPoly.normalizedVertices[2].x || 0) - (obj.boundingPoly.normalizedVertices[0].x || 0),
      height: (obj.boundingPoly.normalizedVertices[2].y || 0) - (obj.boundingPoly.normalizedVertices[0].y || 0)
    }
  }));

  // Parse faces
  const faces = (annotations.faceAnnotations || []).map((face: any) => ({
    boundingBox: {
      x: face.boundingPoly.vertices[0].x || 0,
      y: face.boundingPoly.vertices[0].y || 0,
      width: (face.boundingPoly.vertices[2].x || 0) - (face.boundingPoly.vertices[0].x || 0),
      height: (face.boundingPoly.vertices[2].y || 0) - (face.boundingPoly.vertices[0].y || 0)
    },
    landmarks: face.landmarks || [],
    emotions: {
      joy: getLikelihoodScore(face.joyLikelihood),
      sorrow: getLikelihoodScore(face.sorrowLikelihood),
      anger: getLikelihoodScore(face.angerLikelihood),
      surprise: getLikelihoodScore(face.surpriseLikelihood)
    }
  }));

  return {
    labels,
    text: extractedText,
    objects,
    faces
  };
}

function getLikelihoodScore(likelihood: string): number {
  const scores: { [key: string]: number } = {
    'VERY_UNLIKELY': 0.1,
    'UNLIKELY': 0.3,
    'POSSIBLE': 0.5,
    'LIKELY': 0.7,
    'VERY_LIKELY': 0.9
  };
  return scores[likelihood] || 0;
}
