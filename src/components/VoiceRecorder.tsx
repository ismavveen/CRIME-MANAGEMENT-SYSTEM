
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Square, Play, Pause, Download, Trash2, Video, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceRecorderProps {
  onRecordingComplete?: (audioBlob: Blob, duration: number) => void;
  className?: string;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete, className }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingMode, setRecordingMode] = useState<'audio' | 'video'>('audio');
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioUrl, videoUrl]);

  const startRecording = async () => {
    try {
      const constraints = recordingMode === 'video' 
        ? { 
            audio: true, 
            video: { 
              width: { ideal: 640 }, 
              height: { ideal: 480 },
              facingMode: 'user' // Front camera for selfie-style recording
            } 
          }
        : { audio: true };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // Show live preview for video
      if (recordingMode === 'video' && previewVideoRef.current) {
        previewVideoRef.current.srcObject = stream;
        previewVideoRef.current.play();
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: recordingMode === 'video' 
          ? 'video/webm;codecs=vp9,opus' 
          : 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { 
          type: recordingMode === 'video' ? 'video/webm' : 'audio/webm' 
        });
        
        if (recordingMode === 'video') {
          setVideoBlob(blob);
          const url = URL.createObjectURL(blob);
          setVideoUrl(url);
          
          // Stop preview
          if (previewVideoRef.current) {
            previewVideoRef.current.srcObject = null;
          }
        } else {
          setAudioBlob(blob);
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          
          if (onRecordingComplete) {
            onRecordingComplete(blob, duration);
          }
        }

        // Stop all tracks to release camera/microphone
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      toast({
        title: `${recordingMode === 'video' ? 'Video' : 'Audio'} Recording Started`,
        description: `Speak clearly into your ${recordingMode === 'video' ? 'camera and microphone' : 'microphone'}.`,
      });
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: "Media Access Denied",
        description: `Please allow ${recordingMode === 'video' ? 'camera and microphone' : 'microphone'} access to record.`,
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

      // Stop preview
      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = null;
      }

      toast({
        title: "Recording Stopped",
        description: `Your ${recordingMode === 'video' ? 'video' : 'audio'} has been saved.`,
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

  const playMedia = () => {
    const mediaElement = recordingMode === 'video' ? videoRef.current : audioRef.current;
    if (mediaElement) {
      if (isPlaying) {
        mediaElement.pause();
        setIsPlaying(false);
      } else {
        mediaElement.play();
        setIsPlaying(true);
      }
    }
  };

  const deleteRecording = () => {
    if (recordingMode === 'video') {
      setVideoBlob(null);
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      setVideoUrl('');
    } else {
      setAudioBlob(null);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioUrl('');
    }
    
    setDuration(0);
    setIsPlaying(false);
    
    toast({
      title: "Recording Deleted",
      description: `The ${recordingMode === 'video' ? 'video' : 'audio'} recording has been removed.`,
    });
  };

  const downloadRecording = () => {
    const blob = recordingMode === 'video' ? videoBlob : audioBlob;
    const url = recordingMode === 'video' ? videoUrl : audioUrl;
    
    if (blob && url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = `crime-report-${recordingMode}-${new Date().toISOString().slice(0, 19)}.${recordingMode === 'video' ? 'webm' : 'webm'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Download Started",
        description: `Your ${recordingMode === 'video' ? 'video' : 'audio'} recording is being downloaded.`,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const hasRecording = recordingMode === 'video' ? videoBlob : audioBlob;

  return (
    <Card className={`border-green-200 ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-green-800">Media Recording</h3>
            <p className="text-sm text-green-600">Record voice testimony or video evidence</p>
          </div>

          {/* Recording Mode Toggle */}
          <div className="flex justify-center space-x-2">
            <Button
              variant={recordingMode === 'audio' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRecordingMode('audio')}
              disabled={isRecording}
              className={recordingMode === 'audio' ? 'bg-green-600 text-white' : 'border-green-600 text-green-600'}
            >
              <Mic className="mr-2 h-4 w-4" />
              Audio Only
            </Button>
            <Button
              variant={recordingMode === 'video' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRecordingMode('video')}
              disabled={isRecording}
              className={recordingMode === 'video' ? 'bg-green-600 text-white' : 'border-green-600 text-green-600'}
            >
              <Video className="mr-2 h-4 w-4" />
              Video + Audio
            </Button>
          </div>

          {/* Live Preview for Video */}
          {recordingMode === 'video' && isRecording && (
            <div className="flex justify-center">
              <video
                ref={previewVideoRef}
                className="w-80 h-60 bg-gray-900 rounded-lg"
                autoPlay
                muted
                playsInline
              />
            </div>
          )}

          {/* Timer */}
          <div className="text-center">
            <div className="text-2xl font-mono text-green-700">
              {formatTime(duration)}
            </div>
          </div>

          {/* Recording Controls */}
          <div className="flex justify-center space-x-4">
            {!isRecording && !hasRecording && (
              <Button 
                onClick={startRecording}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {recordingMode === 'video' ? <Camera className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                Start {recordingMode === 'video' ? 'Video' : 'Audio'} Recording
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
                  Stop
                </Button>
              </>
            )}
          </div>

          {/* Playback and Actions */}
          {hasRecording && (
            <div className="space-y-4">
              {/* Media Element */}
              {recordingMode === 'video' ? (
                <div className="flex justify-center">
                  <video 
                    ref={videoRef} 
                    src={videoUrl} 
                    onEnded={() => setIsPlaying(false)}
                    className="w-80 h-60 bg-gray-900 rounded-lg"
                    controls
                  />
                </div>
              ) : (
                <audio 
                  ref={audioRef} 
                  src={audioUrl} 
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
              )}
              
              {/* Control Buttons */}
              <div className="flex justify-center space-x-2">
                {recordingMode === 'audio' && (
                  <Button 
                    onClick={playMedia}
                    variant="outline"
                    size="sm"
                    className="border-green-500 text-green-700 hover:bg-green-50"
                  >
                    {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                )}
                
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
                onClick={startRecording}
                variant="outline"
                className="w-full border-green-500 text-green-700 hover:bg-green-50"
              >
                {recordingMode === 'video' ? <Camera className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                Record New {recordingMode === 'video' ? 'Video' : 'Audio'}
              </Button>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Recording Tips:</strong> 
              {recordingMode === 'video' 
                ? ' Look directly at the camera and speak clearly. Ensure good lighting for better video quality.' 
                : ' Speak clearly and avoid background noise for better audio quality.'
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceRecorder;
