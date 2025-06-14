
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Heart, 
  Network, 
  BookOpen, 
  Users, 
  MapPin, 
  Building, 
  HelpCircle,
  Loader2 
} from 'lucide-react';

interface NaturalLanguageAnalysisProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
  initialText?: string;
}

interface EntityResult {
  name: string;
  type: string;
  salience: number;
  mentions: Array<{
    text: string;
    type: string;
  }>;
}

interface SentimentResult {
  score: number;
  magnitude: number;
}

interface SyntaxResult {
  tokens: Array<{
    text: string;
    partOfSpeech: string;
    dependencyEdge: {
      headTokenIndex: number;
      label: string;
    };
  }>;
}

interface ClassificationResult {
  categories: Array<{
    name: string;
    confidence: number;
  }>;
}

const NaturalLanguageAnalysis = ({ isOpen, onClose, reportId, initialText = '' }: NaturalLanguageAnalysisProps) => {
  const [text, setText] = useState(initialText);
  const [entities, setEntities] = useState<EntityResult[]>([]);
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null);
  const [syntax, setSyntax] = useState<SyntaxResult | null>(null);
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const analyzeText = async (analysisType: string) => {
    if (!text.trim()) {
      toast({
        title: "No Text Provided",
        description: "Please enter some text to analyze",
        variant: "destructive",
      });
      return;
    }

    setLoading(prev => ({ ...prev, [analysisType]: true }));

    try {
      const { data, error } = await supabase.functions.invoke('analyze-text', {
        body: { 
          text, 
          reportId, 
          analysisType,
          apiKey: 'AIzaSyDwhXSGX7S9ISS4LF2UUzRnXQobS2MYWMI'
        }
      });

      if (error) throw error;

      switch (analysisType) {
        case 'entities':
          setEntities(data.entities || []);
          break;
        case 'sentiment':
          setSentiment(data.sentiment || null);
          break;
        case 'syntax':
          setSyntax(data.syntax || null);
          break;
        case 'classification':
          setClassification(data.classification || null);
          break;
      }

      toast({
        title: "Analysis Complete",
        description: `${analysisType} analysis completed successfully`,
      });
    } catch (error: any) {
      console.error(`Error analyzing ${analysisType}:`, error);
      toast({
        title: "Analysis Failed",
        description: error.message || `Failed to analyze ${analysisType}`,
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, [analysisType]: false }));
    }
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.2) return 'text-green-400';
    if (score < -0.2) return 'text-red-400';
    return 'text-yellow-400';
  };

  const getSentimentLabel = (score: number) => {
    if (score > 0.2) return 'Positive';
    if (score < -0.2) return 'Negative';
    return 'Neutral';
  };

  const getEntityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'person':
        return <Users className="w-4 h-4" />;
      case 'location':
        return <MapPin className="w-4 h-4" />;
      case 'organization':
        return <Building className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-400" />
            Natural Language Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Text Input */}
          <div className="space-y-2">
            <label className="text-white font-medium">Text to Analyze</label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the text you want to analyze..."
              className="bg-gray-800 border-gray-600 text-white min-h-32"
            />
          </div>

          {/* Analysis Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => analyzeText('entities')}
                    disabled={loading.entities}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                  >
                    {loading.entities ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Users className="w-4 h-4" />
                    )}
                    Entities
                    <HelpCircle className="w-3 h-3 ml-1" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>This feature identifies key entities like names, locations, and organizations in the submitted text. Useful for pinpointing critical details in a report.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => analyzeText('sentiment')}
                    disabled={loading.sentiment}
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                  >
                    {loading.sentiment ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Heart className="w-4 h-4" />
                    )}
                    Sentiment
                    <HelpCircle className="w-3 h-3 ml-1" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>This feature analyzes the emotional tone of the text, helping to determine whether it conveys positive, negative, or neutral emotions.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => analyzeText('syntax')}
                    disabled={loading.syntax}
                    className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                  >
                    {loading.syntax ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Network className="w-4 h-4" />
                    )}
                    Syntax
                    <HelpCircle className="w-3 h-3 ml-1" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Breaks down the text into grammatical components, such as nouns, verbs, and adjectives, to understand sentence structure.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => analyzeText('classification')}
                    disabled={loading.classification}
                    className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
                  >
                    {loading.classification ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <BookOpen className="w-4 h-4" />
                    )}
                    Classify
                    <HelpCircle className="w-3 h-3 ml-1" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Categorizes the text into topics or themes, such as crime, law enforcement, or general information.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Results */}
          <Tabs defaultValue="entities" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger value="entities" className="data-[state=active]:bg-gray-700">Entities</TabsTrigger>
              <TabsTrigger value="sentiment" className="data-[state=active]:bg-gray-700">Sentiment</TabsTrigger>
              <TabsTrigger value="syntax" className="data-[state=active]:bg-gray-700">Syntax</TabsTrigger>
              <TabsTrigger value="classification" className="data-[state=active]:bg-gray-700">Classification</TabsTrigger>
            </TabsList>

            <TabsContent value="entities" className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Detected Entities</h3>
              {entities.length > 0 ? (
                <div className="space-y-3">
                  {entities.map((entity, index) => (
                    <Card key={index} className="bg-gray-800 border-gray-700 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getEntityIcon(entity.type)}
                          <span className="text-white font-medium">{entity.name}</span>
                          <Badge className="bg-blue-600">{entity.type}</Badge>
                        </div>
                        <Badge className="bg-gray-600">
                          {Math.round(entity.salience * 100)}% relevance
                        </Badge>
                      </div>
                      <div className="text-gray-400 text-sm">
                        Mentions: {entity.mentions.map(m => m.text).join(', ')}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No entities analyzed yet. Click "Entities" button to analyze.</p>
              )}
            </TabsContent>

            <TabsContent value="sentiment" className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Sentiment Analysis</h3>
              {sentiment ? (
                <Card className="bg-gray-800 border-gray-700 p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getSentimentColor(sentiment.score)}`}>
                        {getSentimentLabel(sentiment.score)}
                      </div>
                      <div className="text-gray-400 mt-2">Overall Sentiment</div>
                      <div className="text-white mt-1">Score: {sentiment.score.toFixed(2)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">
                        {sentiment.magnitude.toFixed(2)}
                      </div>
                      <div className="text-gray-400 mt-2">Emotional Intensity</div>
                      <div className="text-white mt-1">Magnitude (0-1+)</div>
                    </div>
                  </div>
                </Card>
              ) : (
                <p className="text-gray-400 text-center py-8">No sentiment analyzed yet. Click "Sentiment" button to analyze.</p>
              )}
            </TabsContent>

            <TabsContent value="syntax" className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Syntax Analysis</h3>
              {syntax && syntax.tokens ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {syntax.tokens.map((token, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded border border-gray-700">
                      <span className="text-white font-mono">{token.text}</span>
                      <div className="flex gap-2">
                        <Badge className="bg-purple-600">{token.partOfSpeech}</Badge>
                        <Badge className="bg-gray-600">{token.dependencyEdge.label}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No syntax analyzed yet. Click "Syntax" button to analyze.</p>
              )}
            </TabsContent>

            <TabsContent value="classification" className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Content Classification</h3>
              {classification && classification.categories ? (
                <div className="space-y-3">
                  {classification.categories.map((category, index) => (
                    <div key={index} className="bg-gray-800 border border-gray-700 p-4 rounded">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">{category.name}</span>
                        <Badge className={`${category.confidence > 0.7 ? 'bg-green-600' : category.confidence > 0.4 ? 'bg-yellow-600' : 'bg-red-600'}`}>
                          {Math.round(category.confidence * 100)}% confidence
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No classification analyzed yet. Click "Classify" button to analyze.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NaturalLanguageAnalysis;
