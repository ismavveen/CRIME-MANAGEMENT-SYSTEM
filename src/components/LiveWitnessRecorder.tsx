
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Square, Play, Pause, Download, Trash2, Camera, Mic, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LiveWitnessRecorderProps {
  onRecordingComplete?: (videoBlob: Blob) => void;
  onCancel?: () => void;
  className?: string;
}

const LiveWitnessRecorder: React.FC<LiveWitnessRecorderProps> = ({ 
  onRecordingComplete, 
  onCancel,
  className 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    // Initialize camera when component mounts
    initializeCamera();
    
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const initializeCamera = async () => {
    setIsInitializing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user' // Front camera for selfie-style recording
        } 
      });
      
      streamRef.current = stream;

      // Show live preview
      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = stream;
        previewVideoRef.current.play();
      }

      toast({
        title: "Camera Ready",
        description: "Your camera is now active and ready for recording.",
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera and microphone access to record witness testimony.",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const startRecording = async () => {
    if (!streamRef.current) {
      await initializeCamera();
      return;
    }

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setVideoBlob(blob);
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        
        // Stop preview
        if (previewVideoRef.current) {
          previewVideoRef.current.srcObject = null;
        }

        if (onRecordingComplete) {
          onRecordingComplete(blob);
        }

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      toast({
        title: "Recording Started",
        description: "Speak clearly and describe what you witnessed.",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Failed",
        description: "Unable to start recording. Please check your camera and microphone.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      toast({
        title: "Recording Completed",
        description: "Your witness testimony has been recorded successfully.",
      });
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        // Resume timer
        timerRef.current = setInterval(() => {
          setDuration(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        // Pause timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
    }
  };

  const playVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const deleteRecording = () => {
    setVideoBlob(null);
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl('');
    setDuration(0);
    setIsPlaying(false);
    
    // Reinitialize camera for new recording
    initializeCamera();
    
    toast({
      title: "Recording Deleted",
      description: "The witness recording has been removed.",
    });
  };

  const downloadRecording = () => {
    if (videoBlob && videoUrl) {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = `witness-testimony-${new Date().toISOString().slice(0, 19)}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Download Started",
        description: "Your witness recording is being downloaded.",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={`border-blue-200 ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-blue-800">Live Witness Recording</h3>
              <p className="text-sm text-blue-600">Record your testimony or witness account</p>
            </div>
            {onCancel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Camera Preview */}
          {!videoBlob && (
            <div className="relative">
              <video
                ref={previewVideoRef}
                className="w-full max-w-md mx-auto bg-gray-900 rounded-lg"
                autoPlay
                muted
                playsInline
                style={{ height: '300px', objectFit: 'cover' }}
              />
              {isInitializing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <div className="text-white text-center">
                    <Camera className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                    <p>Initializing camera...</p>
                  </div>
                </div>
              )}
              {isRecording && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                  REC {formatTime(duration)}
                </div>
              )}
            </div>
          )}

          {/* Recorded Video Playback */}
          {videoBlob && (
            <div className="text-center">
              <video 
                ref={videoRef} 
                src={videoUrl} 
                onEnded={() => setIsPlaying(false)}
                className="w-full max-w-md mx-auto bg-gray-900 rounded-lg"
                controls
                style={{ height: '300px' }}
              />
            </div>
          )}

          {/* Timer Display */}
          <div className="text-center">
            <div className="text-3xl font-mono text-blue-700 font-bold">
              {formatTime(duration)}
            </div>
            {isRecording && (
              <p className="text-sm text-blue-600 mt-1">
                {isPaused ? 'Recording paused' : 'Recording in progress...'}
              </p>
            )}
          </div>

          {/* Recording Controls */}
          <div className="flex justify-center space-x-4">
            {!isRecording && !videoBlob && (
              <Button 
                onClick={startRecording}
                disabled={isInitializing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                <Video className="mr-2 h-5 w-5" />
                Start Recording
              </Button>
            )}

            {isRecording && (
              <>
                <Button 
                  onClick={pauseRecording}
                  variant="outline"
                  className="border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                >
                  {isPaused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                
                <Button 
                  onClick={stopRecording}
                  variant="outline"
                  className="border-red-500 text-red-700 hover:bg-red-50"
                >
                  <Square className="mr-2 h-4 w-4" />
                  Stop Recording
                </Button>
              </>
            )}
          </div>

          {/* Playback and Actions */}
          {videoBlob && (
            <div className="space-y-4">
              <div className="flex justify-center space-x-3">
                <Button 
                  onClick={downloadRecording}
                  variant="outline"
                  size="sm"
                  className="border-blue-500 text-blue-700 hover:bg-blue-50"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                
                <Button 
                  onClick={deleteRecording}
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
              
              <Button 
                onClick={() => {
                  deleteRecording();
                }}
                variant="outline"
                className="w-full border-blue-500 text-blue-700 hover:bg-blue-50"
              >
                <Video className="mr-2 h-4 w-4" />
                Record New Testimony
              </Button>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Recording Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Look directly at the camera and speak clearly</li>
              <li>• Ensure good lighting for better video quality</li>
              <li>• Describe what you witnessed in detail</li>
              <li>• Include important details like time, location, and people involved</li>
              <li>• You can pause and resume recording if needed</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveWitnessRecorder;
