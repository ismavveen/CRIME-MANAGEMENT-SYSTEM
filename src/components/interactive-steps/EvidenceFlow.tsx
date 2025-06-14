import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Upload, File, X, Camera, ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import { FormData } from "../../types/FormData";

interface EvidenceFlowProps {
  onNext: () => void;
  onBack: () => void;
  onUpdate: (data: Partial<FormData>) => void;
  data: FormData;
}

const EvidenceFlow = ({ onNext, onBack, onUpdate, data }: EvidenceFlowProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>(data.evidence.files || []);

  const handleEvidenceUpdate = (field: string, value: boolean | File[]) => {
    const newEvidence = { ...data.evidence, [field]: value };
    onUpdate({ evidence: newEvidence });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles([...selectedFiles, ...files]);
    handleEvidenceUpdate("files", [...selectedFiles, ...files]);
  };

  const handleFileRemove = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    handleEvidenceUpdate("files", updatedFiles);
  };

  const canProceed = () => {
    return !data.evidence.hasEvidence || (data.evidence.hasEvidence && selectedFiles.length > 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Upload className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-800">Do you have any evidence to submit?</h2>
        <p className="text-green-600">
          Photos, videos, documents, or any other files related to the incident can be uploaded here.
        </p>
      </div>

      {/* Evidence Toggle */}
      <Card className="border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Camera className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  Upload Evidence
                </h3>
                <p className="text-green-600">
                  Add photos, videos, or documents related to the incident.
                </p>
              </div>
            </div>
            <Switch
              checked={data.evidence.hasEvidence}
              onCheckedChange={(checked) => handleEvidenceUpdate("hasEvidence", checked)}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* File Upload Section */}
      {data.evidence.hasEvidence && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <Label htmlFor="evidenceUpload" className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium cursor-pointer hover:bg-blue-700 transition-colors">
                <Upload className="mr-2 h-4 w-4" />
                Select Files to Upload
              </Label>
              <input
                type="file"
                id="evidenceUpload"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-green-800">Uploaded Files:</h4>
                <ul className="space-y-1">
                  {selectedFiles.map((file, index) => (
                    <li key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md">
                      <div className="flex items-center space-x-3">
                        <File className="h-5 w-5 text-blue-600" />
                        <span className="text-sm text-green-700">{file.name}</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleFileRemove(index)}>
                        <X className="h-4 w-4 text-red-500 hover:text-red-700" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Evidence Tips */}
            <Card className="border-blue-200 bg-white">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-800 mb-2">Tips for Providing Good Evidence:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Ensure photos and videos are clear and well-lit</li>
                  <li>• Include relevant details like date, time, and location</li>
                  <li>• Describe what the evidence shows in the file name or description</li>
                  <li>• Only upload files directly related to the incident</li>
                </ul>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}

      {/* No Evidence Alternative */}
      {!data.evidence.hasEvidence && (
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <AlertCircle className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-800">No Evidence?</span>
            </div>
            <p className="text-sm text-gray-700">
              You can still submit your report without providing any evidence. Providing detailed information about the incident can be helpful even without visual or document evidence.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack} className="border-green-300 text-green-700">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <Button onClick={onNext} disabled={data.evidence.hasEvidence && selectedFiles.length === 0} className="bg-green-700 hover:bg-green-800">
          Continue to Contact Info <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EvidenceFlow;
