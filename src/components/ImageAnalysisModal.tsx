
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Eye, Tag, Type, Users, Search } from 'lucide-react';

interface ImageAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
  imageUrl: string;
}

interface AnalysisResult {
  id: string;
  labels: Array<{
    description: string;
    score: number;
  }>;
  extracted_text: string;
  detected_objects: Array<{
    name: string;
    score: number;
    boundingBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;
  detected_faces: Array<{
    boundingBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    emotions: {
      joy: number;
      sorrow: number;
      anger: number;
      surprise: number;
    };
  }>;
  analyzed_at: string;
}

const ImageAnalysisModal = ({ isOpen, onClose, reportId, imageUrl }: ImageAnalysisModalProps) => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && reportId) {
      fetchAnalysisResult();
    }
  }, [isOpen, reportId]);

  const fetchAnalysisResult = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('image_analysis')
        .select('*')
        .eq('report_id', reportId)
        .eq('image_url', imageUrl)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setAnalysisResult({
          id: data.id,
          labels: data.labels || [],
          extracted_text: data.extracted_text || '',
          detected_objects: data.detected_objects || [],
          detected_faces: data.detected_faces || [],
          analyzed_at: data.analyzed_at
        });
      }
    } catch (error: any) {
      console.error('Error fetching analysis result:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeImage = async () => {
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-image', {
        body: { imageUrl, reportId }
      });

      if (error) throw error;

      toast({
        title: "Analysis Complete",
        description: "Image has been analyzed successfully",
      });

      // Refresh the analysis result
      await fetchAnalysisResult();
    } catch (error: any) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze image",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score > 0.8) return 'bg-green-100 text-green-800 border-green-300';
    if (score > 0.6) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            Image Analysis Results
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Display */}
          <div className="relative">
            <img 
              src={imageUrl} 
              alt="Evidence" 
              className="w-full max-h-64 object-contain rounded-lg bg-gray-800"
            />
            {!analysisResult && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <Button 
                  onClick={analyzeImage}
                  disabled={analyzing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {analyzing ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Analyze Image
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Loading analysis results...</p>
            </div>
          )}

          {analysisResult && (
            <Tabs defaultValue="labels" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                <TabsTrigger value="labels" className="data-[state=active]:bg-gray-700">
                  <Tag className="w-4 h-4 mr-2" />
                  Labels
                </TabsTrigger>
                <TabsTrigger value="text" className="data-[state=active]:bg-gray-700">
                  <Type className="w-4 h-4 mr-2" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="objects" className="data-[state=active]:bg-gray-700">
                  <Search className="w-4 h-4 mr-2" />
                  Objects
                </TabsTrigger>
                <TabsTrigger value="faces" className="data-[state=active]:bg-gray-700">
                  <Users className="w-4 h-4 mr-2" />
                  Faces
                </TabsTrigger>
              </TabsList>

              <TabsContent value="labels" className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Detected Labels</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {analysisResult.labels.map((label, index) => (
                    <Badge 
                      key={index}
                      className={`justify-between p-2 ${getConfidenceColor(label.score)}`}
                    >
                      <span>{label.description}</span>
                      <span className="text-xs">{Math.round(label.score * 100)}%</span>
                    </Badge>
                  ))}
                </div>
                {analysisResult.labels.length === 0 && (
                  <p className="text-gray-400 text-center py-4">No labels detected</p>
                )}
              </TabsContent>

              <TabsContent value="text" className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Extracted Text</h3>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  {analysisResult.extracted_text ? (
                    <p className="text-gray-300 whitespace-pre-wrap">{analysisResult.extracted_text}</p>
                  ) : (
                    <p className="text-gray-400 text-center py-4">No text detected</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="objects" className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Detected Objects</h3>
                <div className="space-y-3">
                  {analysisResult.detected_objects.map((obj, index) => (
                    <div key={index} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">{obj.name}</span>
                        <Badge className={getConfidenceColor(obj.score)}>
                          {Math.round(obj.score * 100)}%
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">
                        Position: ({Math.round(obj.boundingBox.x * 100)}%, {Math.round(obj.boundingBox.y * 100)}%) 
                        Size: {Math.round(obj.boundingBox.width * 100)}% × {Math.round(obj.boundingBox.height * 100)}%
                      </p>
                    </div>
                  ))}
                </div>
                {analysisResult.detected_objects.length === 0 && (
                  <p className="text-gray-400 text-center py-4">No objects detected</p>
                )}
              </TabsContent>

              <TabsContent value="faces" className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Detected Faces</h3>
                <div className="space-y-3">
                  {analysisResult.detected_faces.map((face, index) => (
                    <div key={index} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">Face {index + 1}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-400">Joy: </span>
                          <span className="text-white">{Math.round(face.emotions.joy * 100)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Sorrow: </span>
                          <span className="text-white">{Math.round(face.emotions.sorrow * 100)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Anger: </span>
                          <span className="text-white">{Math.round(face.emotions.anger * 100)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Surprise: </span>
                          <span className="text-white">{Math.round(face.emotions.surprise * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {analysisResult.detected_faces.length === 0 && (
                  <p className="text-gray-400 text-center py-4">No faces detected</p>
                )}
              </TabsContent>
            </Tabs>
          )}

          {analysisResult && (
            <div className="text-center text-sm text-gray-400">
              Analysis completed on {new Date(analysisResult.analyzed_at).toLocaleString()}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageAnalysisModal;
