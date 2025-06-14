
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, reportId, analysisType, apiKey } = await req.json();

    if (!text || !analysisType || !apiKey) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const GOOGLE_CLOUD_API_KEY = apiKey;
    let analysisResult = {};

    console.log(`Starting ${analysisType} analysis for text: ${text.substring(0, 100)}...`);

    switch (analysisType) {
      case 'entities':
        analysisResult = await analyzeEntities(text, GOOGLE_CLOUD_API_KEY);
        break;
      case 'sentiment':
        analysisResult = await analyzeSentiment(text, GOOGLE_CLOUD_API_KEY);
        break;
      case 'syntax':
        analysisResult = await analyzeSyntax(text, GOOGLE_CLOUD_API_KEY);
        break;
      case 'classification':
        analysisResult = await classifyText(text, GOOGLE_CLOUD_API_KEY);
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid analysis type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    console.log(`${analysisType} analysis completed successfully`);

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-text function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function analyzeEntities(text: string, apiKey: string) {
  const url = `https://language.googleapis.com/v1/documents:analyzeEntities?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      document: {
        type: 'PLAIN_TEXT',
        content: text,
      },
      encodingType: 'UTF8',
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Entity analysis error:', errorData);
    throw new Error(`Entity analysis failed: ${response.status}`);
  }

  const data = await response.json();
  
  return {
    entities: data.entities?.map((entity: any) => ({
      name: entity.name,
      type: entity.type,
      salience: entity.salience,
      mentions: entity.mentions?.map((mention: any) => ({
        text: mention.text.content,
        type: mention.type,
      })) || [],
    })) || []
  };
}

async function analyzeSentiment(text: string, apiKey: string) {
  const url = `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      document: {
        type: 'PLAIN_TEXT',
        content: text,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Sentiment analysis error:', errorData);
    throw new Error(`Sentiment analysis failed: ${response.status}`);
  }

  const data = await response.json();
  
  return {
    sentiment: {
      score: data.documentSentiment?.score || 0,
      magnitude: data.documentSentiment?.magnitude || 0,
    }
  };
}

async function analyzeSyntax(text: string, apiKey: string) {
  const url = `https://language.googleapis.com/v1/documents:analyzeSyntax?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      document: {
        type: 'PLAIN_TEXT',
        content: text,
      },
      encodingType: 'UTF8',
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Syntax analysis error:', errorData);
    throw new Error(`Syntax analysis failed: ${response.status}`);
  }

  const data = await response.json();
  
  return {
    syntax: {
      tokens: data.tokens?.map((token: any) => ({
        text: token.text?.content || '',
        partOfSpeech: token.partOfSpeech?.tag || 'UNKNOWN',
        dependencyEdge: {
          headTokenIndex: token.dependencyEdge?.headTokenIndex || 0,
          label: token.dependencyEdge?.label || 'UNKNOWN',
        },
      })) || []
    }
  };
}

async function classifyText(text: string, apiKey: string) {
  const url = `https://language.googleapis.com/v1/documents:classifyText?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      document: {
        type: 'PLAIN_TEXT',
        content: text,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Classification error:', errorData);
    throw new Error(`Text classification failed: ${response.status}`);
  }

  const data = await response.json();
  
  return {
    classification: {
      categories: data.categories?.map((category: any) => ({
        name: category.name,
        confidence: category.confidence,
      })) || []
    }
  };
}
