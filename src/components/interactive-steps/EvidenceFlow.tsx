
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Camera, FileText, Video, X, Check, ArrowLeft, ArrowRight } from "lucide-react";
import { FormData } from "../InteractiveReportForm";
import { toast } from "@/hooks/use-toast";

interface EvidenceFlowProps {
  onNext: () => void;
  onBack: () => void;
  onUpdate: (data: Partial<FormData>) => void;
  data: FormData;
}

const EvidenceFlow = ({ onNext, onBack, onUpdate, data }: EvidenceFlowProps) => {
  const [dragOver, setDragOver] = useState(false);

  const handleEvidenceChoice = (hasEvidence: boolean) => {
    const newEvidence = { ...data.evidence, hasEvidence };
    if (!hasEvidence) {
      newEvidence.files = [];
    }
    onUpdate({ evidence: newEvidence });
    
    if (!hasEvidence) {
      // Auto-proceed if no evidence
      setTimeout(() => {
        onNext();
      }, 500);
    }
  };

  const handleFileUpload = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => file.size <= 10 * 1024 * 1024); // 10MB limit
    
    if (validFiles.length !== fileArray.length) {
      toast({
        title: "Some files were too large",
        description: "Files must be under 10MB. Large files were not uploaded.",
        variant: "destructive"
      });
    }
    
    const newEvidence = { 
      ...data.evidence, 
      files: [...data.evidence.files, ...validFiles],
      hasEvidence: true
    };
    onUpdate({ evidence: newEvidence });
    
    if (validFiles.length > 0) {
      toast({
        title: "Files uploaded successfully",
        description: `${validFiles.length} file(s) ready for submission.`
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = data.evidence.files.filter((_, i) => i !== index);
    const newEvidence = { ...data.evidence, files: newFiles };
    onUpdate({ evidence: newEvidence });
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Camera;
    if (file.type.startsWith('video/')) return Video;
    return FileText;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Camera className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-800">Do you have any evidence to share?</h2>
        <p className="text-green-600">
          Photos, videos, documents, or other files can help support your report.
        </p>
      </div>

      {/* Evidence Choice */}
      {!data.evidence.hasEvidence && data.evidence.files.length === 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              className="cursor-pointer border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all duration-200 group"
              onClick={() => handleEvidenceChoice(true)}
            >
              <CardContent className="p-6 text-center">
                <Upload className="h-12 w-12 text-green-600 mx-auto mb-4 group-hover:text-green-700 transition-colors" />
                <h4 className="font-semibold text-green-800 mb-2">Yes, I have evidence</h4>
                <p className="text-sm text-green-600">
                  Upload photos, videos, documents, or other relevant files
                </p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer border-2 border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all duration-200 group"
              onClick={() => handleEvidenceChoice(false)}
            >
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4 group-hover:text-gray-700 transition-colors" />
                <h4 className="font-semibold text-gray-800 mb-2">No evidence to share</h4>
                <p className="text-sm text-gray-600">
                  Continue with the written report only
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* File Upload Area */}
      {(data.evidence.hasEvidence || data.evidence.files.length > 0) && (
        <div className="space-y-4">
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              dragOver 
                ? 'border-green-400 bg-green-50' 
                : 'border-green-300 hover:border-green-400 hover:bg-green-50'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
          >
            <Upload className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-green-800 mb-2">
              {dragOver ? 'Drop files here' : 'Upload Evidence Files'}
            </h4>
            <p className="text-green-600 mb-4">
              Drag and drop files here, or click to browse
            </p>
            <Input
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="cursor-pointer max-w-md mx-auto"
            />
            <p className="text-sm text-green-500 mt-3">
              Supports: Images, Videos, PDF, Word documents (Max 10MB per file)
            </p>
          </div>

          {/* File List */}
          {data.evidence.files.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-green-800">Uploaded Files:</h4>
              <div className="space-y-2">
                {data.evidence.files.map((file, index) => {
                  const FileIcon = getFileIcon(file);
                  return (
                    <Card key={index} className="border-green-200">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileIcon className="h-6 w-6 text-green-600" />
                            <div>
                              <p className="font-medium text-green-800">{file.name}</p>
                              <p className="text-sm text-green-600">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Check className="h-5 w-5 text-green-600" />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Privacy Notice */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-800 mb-2">Privacy & Security Notice:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• All files are encrypted during upload and storage</li>
                <li>• Only authorized security personnel will have access</li>
                <li>• Files are automatically deleted after case resolution</li>
                <li>• Make sure files don't contain personal information of others</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack} className="border-green-300 text-green-700">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        {(data.evidence.hasEvidence === false || data.evidence.files.length > 0) && (
          <Button onClick={onNext} className="bg-green-700 hover:bg-green-800">
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default EvidenceFlow;
