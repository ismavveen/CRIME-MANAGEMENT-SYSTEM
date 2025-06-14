import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { MapPin, Shield, AlertTriangle, ArrowLeft } from "lucide-react";
import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom";

const AUTHORITY_NAME = "Defence Headquarters Emergency Response";

type LocationCoords = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

const EmergencyLocation = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // Update map marker when location changes
  useEffect(() => {
    if (location && mapRef.current && window.google) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: location.latitude, lng: location.longitude },
        zoom: 17,
      });
      new window.google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: "#22c55e",
          fillOpacity: 0.9,
          strokeWeight: 2,
          strokeColor: "#be123c"
        },
        title: "You"
      });
    }
  }, [location]);

  // Load Google Maps API only when needed
  const [mapLoaded, setMapLoaded] = useState(false);
  useEffect(() => {
    if (sharing && !window.google && !mapLoaded) {
      // Only load script if needed
      const script = document.createElement("script");
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyDwhXSGX7S9ISS4LF2UUzRnXQobS2MYWMI";
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
      return () => {
        document.head.removeChild(script);
      };
    } else if (window.google) {
      setMapLoaded(true);
    }
  }, [sharing, mapLoaded]);

  // Stop sharing location
  const stopSharing = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setLocation(null);
    setSharing(false);
    setError(null);
  };

  // Start real-time location sharing
  const handleShareLocation = () => {
    setModalOpen(true);
  };

  const confirmShare = () => {
    setModalOpen(false);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setSharing(true);
    setError(null);
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setError(null);
      },
      (e) => {
        setError("Unable to retrieve your location. Please check permissions.");
        setSharing(false);
      },
      { enableHighAccuracy: true }
    );
    setWatchId(id);
  };

  // Clean up watcher on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-xl flex flex-col flex-1">
        {/* Back Link */}
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center text-green-700 hover:text-green-800 hover:bg-green-50 p-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Title & Header */}
        <Card className="bg-red-700 p-0 rounded-lg mb-8 shadow-lg">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-center">
              <MapPin className="h-10 w-10 text-white mr-2" />
              <CardTitle className="text-3xl font-bold text-white">
                Emergency Location Sharing
              </CardTitle>
            </div>
            <h2 className="pt-2 text-lg text-center text-red-100 font-medium">
              Turn on your location only if you're in danger.
            </h2>
          </CardHeader>
        </Card>

        {/* Purpose Section */}
        <Card className="mb-6 border-l-4 border-green-500 bg-green-50">
          <CardContent className="p-4">
            <div className="text-green-800 text-md flex items-start">
              <Shield className="h-6 w-6 mr-2 flex-shrink-0 mt-0.5" />
              <span>
                By turning on your location, you allow relevant authorities to track your real-time position and provide assistance in emergencies. <b>Use this feature responsibly.</b>
              </span>
            </div>
          </CardContent>
        </Card>
        {/* Warning Message */}
        <Card className="mb-6 border-l-4 border-red-600 bg-red-50">
          <CardContent className="p-4 flex items-center">
            <AlertTriangle className="text-red-600 h-6 w-6 mr-2 flex-shrink-0" />
            <span className="text-red-700 font-bold">
              ⚠️ Only enable this feature if you are in immediate danger or need urgent help.
            </span>
          </CardContent>
        </Card>

        {/* Action Button & Info */}
        {!sharing && (
          <div className="flex flex-col items-center mb-6">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white text-xl px-8 py-5 rounded-lg font-bold shadow-md"
              onClick={handleShareLocation}
            >
              <MapPin className="mr-2 h-6 w-6" />
              Share My Location
            </Button>
          </div>
        )}

        {/* Confirmation Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <MapPin className="mr-2" />
                Share Location Confirmation
              </DialogTitle>
            </DialogHeader>
            <div className="my-4">
              Are you sure you want to share your location with {AUTHORITY_NAME}?
            </div>
            <DialogFooter className="flex-row space-x-2">
              <Button onClick={confirmShare} className="bg-green-600 hover:bg-green-700 text-white flex-1">
                Yes, Share
              </Button>
              <Button onClick={() => setModalOpen(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Real-time Location Sharing */}
        {sharing && (
          <Card className="mb-6 border-green-400 border-2">
            <CardHeader className="bg-green-50 border-b py-2">
              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-green-600 mr-2" />
                <span className="font-semibold text-green-700">
                  Your location is being shared with {AUTHORITY_NAME}. Stay safe.
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {error && (
                <div className="bg-red-100 text-red-700 p-2 mb-2 rounded">{error}</div>
              )}
              <div ref={mapRef} className="w-full h-56 rounded-lg border border-green-100 shadow-sm mb-4 bg-gray-100" />
              {location && (
                <div className="mb-4 text-center text-green-800">
                  Sharing live: <span className="font-mono">{location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</span>
                  {location.accuracy && (
                    <span className="ml-2 text-xs text-gray-500">(±{location.accuracy.toFixed(0)}m)</span>
                  )}
                </div>
              )}
              <Button
                variant="destructive"
                className="w-full font-bold text-lg py-4"
                onClick={stopSharing}
              >
                Stop Sharing
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Privacy Notice */}
        <div className="mt-auto mb-4">
          <div className="text-xs text-gray-500 text-center max-w-md mx-auto border-t pt-4">
            <span>
              Your location data is securely transmitted and used solely for emergency response purposes. It will not be stored or shared for other uses.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyLocation;
