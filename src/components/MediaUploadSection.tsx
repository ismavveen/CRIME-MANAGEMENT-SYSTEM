
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Camera, Video, Upload, X, Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MediaUploadSectionProps {
  images: File[];
  videos: File[];
  onImagesChange: (images: File[]) => void;
  onVideosChange: (videos: File[]) => void;
  uploading: boolean;
}

const MediaUploadSection = ({ 
  images, 
  videos, 
  onImagesChange, 
  onVideosChange, 
  uploading 
}: MediaUploadSectionProps) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/mp4' });
        const file = new File([blob], `recorded-video-${Date.now()}.mp4`, {
          type: 'video/mp4'
        });
        onVideosChange([...videos, file]);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);

      toast({
        title: "Recording started",
        description: "Recording video with audio",
      });
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Could not access camera and microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
      setMediaRecorder(null);
    }
  };

  const handleFileUpload = (files: FileList | null, type: 'image' | 'video') => {
    if (!files) return;

    const fileArray = Array.from(files);
    const maxSize = type === 'image' ? 10 * 1024 * 1024 : 50 * 1024 * 1024; // 10MB for images, 50MB for videos
    
    const validFiles = fileArray.filter(file => {
      if (file.size > maxSize) {
        toast({
          title: `File too large`,
          description: `${file.name} exceeds the ${type === 'image' ? '10MB' : '50MB'} limit`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    if (type === 'image') {
      onImagesChange([...images, ...validFiles]);
    } else {
      onVideosChange([...videos, ...validFiles]);
    }

    // Simulate upload progress
    validFiles.forEach((file, index) => {
      const fileKey = `${type}-${file.name}-${index}`;
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadProgress(prev => {
            const updated = { ...prev };
            delete updated[fileKey];
            return updated;
          });
        }
        setUploadProgress(prev => ({ ...prev, [fileKey]: progress }));
      }, 200);
    });
  };

  const removeFile = (index: number, type: 'image' | 'video') => {
    if (type === 'image') {
      onImagesChange(images.filter((_, i) => i !== index));
    } else {
      onVideosChange(videos.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Recording Section */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Video className="h-5 w-5 text-blue-400" />
          Live Video Recording
        </h3>
        
        <div className="space-y-4">
          {recording && (
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full max-w-md h-48 bg-gray-900 rounded-lg"
            />
          )}
          
          <div className="flex gap-3">
            {!recording ? (
              <Button
                type="button"
                onClick={startRecording}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                Start Recording
              </Button>
            ) : (
              <Button
                type="button"
                onClick={stopRecording}
                className="bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2"
              >
                <Pause className="h-4 w-4" />
                Stop Recording
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Camera className="h-5 w-5 text-green-400" />
          Upload Images
        </h3>
        
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileUpload(e.target.files, 'image')}
          className="w-full bg-gray-900/50 border border-gray-600 rounded-md px-3 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
        />
        <p className="text-xs text-gray-400 mt-2">Maximum 10MB per image. Supported formats: JPG, PNG, GIF, WebP</p>
        
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-24 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeFile(index, 'image')}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-md">
                  {(image.size / 1024 / 1024).toFixed(1)} MB
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Upload */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Video className="h-5 w-5 text-blue-400" />
          Upload Videos
        </h3>
        
        <input
          type="file"
          multiple
          accept="video/*"
          onChange={(e) => handleFileUpload(e.target.files, 'video')}
          className="w-full bg-gray-900/50 border border-gray-600 rounded-md px-3 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />
        <p className="text-xs text-gray-400 mt-2">Maximum 50MB per video. Supported formats: MP4, AVI, MOV, WebM</p>
        
        {videos.length > 0 && (
          <div className="mt-4 space-y-3">
            {videos.map((video, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-900/30 p-3 rounded-md group">
                <div className="flex items-center space-x-3 flex-1">
                  <Video className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 truncate">{video.name}</p>
                    <p className="text-xs text-gray-500">
                      {(video.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index, 'video')}
                  className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-white mb-3">Upload Progress</h4>
          {Object.entries(uploadProgress).map(([fileKey, progress]) => (
            <div key={fileKey} className="mb-2">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{fileKey.split('-')[1]}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="text-center text-blue-400">
          <div className="animate-spin w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p>Uploading media files...</p>
        </div>
      )}
    </div>
  );
};

export default MediaUploadSection;
