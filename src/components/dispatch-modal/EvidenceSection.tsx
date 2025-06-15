
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Image, Video, Play, Eye } from 'lucide-react';

interface EvidenceSectionProps {
  report: any;
  onViewMedia: (url: string, type: 'image' | 'video') => void;
}

const EvidenceSection = ({ report, onViewMedia }: EvidenceSectionProps) => {
  return (
    <Card className="bg-gray-900/50 border-gray-700/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-gray-400 flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>Evidence & Attachments</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {(report.images?.length || report.videos?.length || report.documents?.length || report.live_witness_videos?.length) ? (
          <div className="space-y-6">
            {/* Images Section */}
            {report.images?.length > 0 && (
              <div>
                <h5 className="text-white font-medium mb-3 flex items-center">
                  <Image className="h-4 w-4 mr-2 text-blue-400" />
                  Images ({report.images.length})
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {report.images.map((image: string, index: number) => (
                    <div 
                      key={index}
                      className="relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors group"
                      onClick={() => onViewMedia(image, 'image')}
                    >
                      <img 
                        src={image} 
                        alt={`Evidence ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all">
                        <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos Section */}
            {report.videos?.length > 0 && (
              <div>
                <h5 className="text-white font-medium mb-3 flex items-center">
                  <Video className="h-4 w-4 mr-2 text-green-400" />
                  Videos ({report.videos.length})
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {report.videos.map((video: string, index: number) => (
                    <div 
                      key={index}
                      className="relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors group"
                      onClick={() => onViewMedia(video, 'video')}
                    >
                      <video 
                        src={video}
                        className="w-full h-24 object-cover"
                        muted
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-900/80 text-green-200 text-xs">Video</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Live Witness Videos Section */}
            {report.live_witness_videos?.length > 0 && (
              <div>
                <h5 className="text-white font-medium mb-3 flex items-center">
                  <Video className="h-4 w-4 mr-2 text-purple-400" />
                  Live Witness Recordings ({report.live_witness_videos.length})
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {report.live_witness_videos.map((video: string, index: number) => (
                    <div 
                      key={index}
                      className="relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors group"
                      onClick={() => onViewMedia(video, 'video')}
                    >
                      <video 
                        src={video}
                        className="w-full h-24 object-cover"
                        muted
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-purple-900/80 text-purple-200 text-xs animate-pulse">
                          Live Witness
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents Section */}
            {report.documents?.length > 0 && (
              <div>
                <h5 className="text-white font-medium mb-3 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-yellow-400" />
                  Documents ({report.documents.length})
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {report.documents.map((doc: string, index: number) => (
                    <div 
                      key={index}
                      className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => window.open(doc, '_blank')}
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-yellow-400" />
                        <div>
                          <p className="text-white font-medium">Document {index + 1}</p>
                          <p className="text-gray-400 text-sm">Click to view</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-500" />
            <p>No evidence files attached to this report</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EvidenceSection;
