
import React, { useState } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Shield, User, Lock, Globe, Monitor, BellOff, Eye, PieChart, Key, Map, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const [googleMapsKey, setGoogleMapsKey] = useState('');
  const [mapboxKey, setMapboxKey] = useState('');
  const [showGoogleKey, setShowGoogleKey] = useState(false);
  const [showMapboxKey, setShowMapboxKey] = useState(false);
  const { toast } = useToast();

  const handleSaveGoogleMapsKey = () => {
    if (googleMapsKey.trim()) {
      localStorage.setItem('google_maps_api_key', googleMapsKey);
      toast({
        title: "Google Maps API Key Saved",
        description: "Your API key has been saved locally and will be used for map features.",
      });
    }
  };

  const handleSaveMapboxKey = () => {
    if (mapboxKey.trim()) {
      localStorage.setItem('mapbox_api_key', mapboxKey);
      toast({
        title: "Mapbox API Key Saved", 
        description: "Your API key has been saved locally and will be used for map features.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-dhq-dark-bg">
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
              <p className="text-gray-400">
                Configure application settings and user preferences
              </p>
            </div>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="bg-gray-800/50 border border-gray-700 mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="integrations">API Integration</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* API Integration Tab */}
          <TabsContent value="integrations">
            <div className="bg-gray-800/30 rounded-lg p-6">
              <div className="flex items-center mb-6">
                <Map className="h-6 w-6 text-dhq-blue mr-3" />
                <h3 className="text-lg font-medium text-white">Map Services Integration</h3>
              </div>
              
              <p className="text-gray-400 mb-8">
                Configure API keys for map services to enable location-based features in the application.
              </p>

              <div className="space-y-8">
                {/* Google Maps API Configuration */}
                <div className="bg-gray-700/30 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-white font-bold">G</span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Google Maps API</h4>
                        <p className="text-gray-400 text-sm">Interactive maps with detailed location data</p>
                      </div>
                    </div>
                    <a 
                      href="https://console.cloud.google.com/google/maps-apis" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-dhq-blue hover:text-blue-400 flex items-center gap-1"
                    >
                      Get API Key <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-300 block mb-2">Google Maps API Key</label>
                      <div className="flex gap-3">
                        <div className="flex-1 relative">
                          <Input
                            type={showGoogleKey ? 'text' : 'password'}
                            value={googleMapsKey}
                            onChange={(e) => setGoogleMapsKey(e.target.value)}
                            placeholder="Enter your Google Maps API key"
                            className="bg-gray-600 border-gray-500 text-white pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            onClick={() => setShowGoogleKey(!showGoogleKey)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button 
                          onClick={handleSaveGoogleMapsKey}
                          className="bg-dhq-blue hover:bg-blue-700"
                          disabled={!googleMapsKey.trim()}
                        >
                          Save
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Required for Google Maps integration and location services
                      </p>
                    </div>

                    <div className="bg-gray-600/30 p-4 rounded-md">
                      <h5 className="text-white text-sm font-medium mb-2">Required APIs:</h5>
                      <ul className="text-gray-300 text-xs space-y-1">
                        <li>• Maps JavaScript API</li>
                        <li>• Places API</li>
                        <li>• Geocoding API</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Mapbox API Configuration */}
                <div className="bg-gray-700/30 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-white font-bold">M</span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Mapbox API</h4>
                        <p className="text-gray-400 text-sm">Alternative mapping service with custom styling</p>
                      </div>
                    </div>
                    <a 
                      href="https://account.mapbox.com/access-tokens/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-dhq-blue hover:text-blue-400 flex items-center gap-1"
                    >
                      Get API Key <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-300 block mb-2">Mapbox Access Token</label>
                      <div className="flex gap-3">
                        <div className="flex-1 relative">
                          <Input
                            type={showMapboxKey ? 'text' : 'password'}
                            value={mapboxKey}
                            onChange={(e) => setMapboxKey(e.target.value)}
                            placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIi..."
                            className="bg-gray-600 border-gray-500 text-white pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            onClick={() => setShowMapboxKey(!showMapboxKey)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button 
                          onClick={handleSaveMapboxKey}
                          className="bg-dhq-blue hover:bg-blue-700"
                          disabled={!mapboxKey.trim()}
                        >
                          Save
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Public access token for Mapbox services
                      </p>
                    </div>
                  </div>
                </div>

                {/* Connection Status */}
                <div className="bg-gray-700/30 p-6 rounded-lg">
                  <h4 className="text-white font-medium mb-4">Integration Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-gray-300">Supabase Database</span>
                      </div>
                      <Badge className="bg-green-500 text-white">Connected</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${googleMapsKey ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                        <span className="text-gray-300">Google Maps</span>
                      </div>
                      <Badge className={googleMapsKey ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                        {googleMapsKey ? 'Configured' : 'Not Configured'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${mapboxKey ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                        <span className="text-gray-300">Mapbox</span>
                      </div>
                      <Badge className={mapboxKey ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                        {mapboxKey ? 'Configured' : 'Not Configured'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* General Settings */}
          <TabsContent value="general">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="bg-gray-800/30 rounded-lg p-5">
                  <h3 className="text-lg font-medium text-white mb-6">Interface Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Monitor className="h-5 w-5 mr-3 text-gray-400" />
                        <div>
                          <p className="text-gray-200">Dark Mode</p>
                          <p className="text-xs text-gray-400">Use dark theme across the application</p>
                        </div>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Eye className="h-5 w-5 mr-3 text-gray-400" />
                        <div>
                          <p className="text-gray-200">Compact View</p>
                          <p className="text-xs text-gray-400">Reduce spacing in lists and tables</p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 mr-3 text-gray-400" />
                        <div>
                          <p className="text-gray-200">Language</p>
                          <p className="text-xs text-gray-400">Select interface language</p>
                        </div>
                      </div>
                      <select className="bg-gray-700 border border-gray-600 rounded-md text-gray-200 py-1 px-2">
                        <option>English (US)</option>
                        <option>French</option>
                        <option>Hausa</option>
                        <option>Yoruba</option>
                        <option>Igbo</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <PieChart className="h-5 w-5 mr-3 text-gray-400" />
                        <div>
                          <p className="text-gray-200">Dashboard Refresh</p>
                          <p className="text-xs text-gray-400">How often to update dashboard data</p>
                        </div>
                      </div>
                      <select className="bg-gray-700 border border-gray-600 rounded-md text-gray-200 py-1 px-2">
                        <option>1 minute</option>
                        <option>5 minutes</option>
                        <option>15 minutes</option>
                        <option>30 minutes</option>
                        <option>1 hour</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="bg-gray-800/30 rounded-lg p-5">
                  <h3 className="text-lg font-medium text-white mb-6">System Preferences</h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <label className="text-sm text-gray-400 block mb-1">Default Homepage</label>
                          <select className="w-full bg-gray-700 border border-gray-600 rounded-md text-gray-200 py-2 px-3">
                            <option>Dashboard</option>
                            <option>Reports</option>
                            <option>Intelligence Feed</option>
                            <option>Map View</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-sm text-gray-400 block mb-1">Time Zone</label>
                          <select className="w-full bg-gray-700 border border-gray-600 rounded-md text-gray-200 py-2 px-3">
                            <option>Africa/Lagos (GMT+1:00)</option>
                            <option>UTC (GMT+0:00)</option>
                            <option>America/New_York (GMT-5:00)</option>
                            <option>Europe/London (GMT+0:00)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="text-sm text-gray-400 block mb-1">Date Format</label>
                          <select className="w-full bg-gray-700 border border-gray-600 rounded-md text-gray-200 py-2 px-3">
                            <option>DD/MM/YYYY</option>
                            <option>MM/DD/YYYY</option>
                            <option>YYYY-MM-DD</option>
                            <option>MMM D, YYYY</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-sm text-gray-400 block mb-1">Export Format</label>
                          <select className="w-full bg-gray-700 border border-gray-600 rounded-md text-gray-200 py-2 px-3">
                            <option>PDF</option>
                            <option>Excel (.xlsx)</option>
                            <option>CSV</option>
                            <option>JSON</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="bg-gray-700" />
                    
                    <div className="space-y-4">
                      <h4 className="text-gray-200 font-medium">Data Settings</h4>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-200">Enable Data Analytics</p>
                          <p className="text-xs text-gray-400">Collect usage data for system improvements</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-200">Automatic Data Backup</p>
                          <p className="text-xs text-gray-400">Regularly backup your data to secure storage</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-200">Cache Map Data</p>
                          <p className="text-xs text-gray-400">Store map data for offline access</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                      <button className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">
                        Reset to Defaults
                      </button>
                      <button className="px-4 py-2 bg-dhq-blue text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Account Settings */}
          <TabsContent value="account">
            <div className="bg-gray-800/30 rounded-lg p-5">
              <h3 className="text-lg font-medium text-white mb-6">Account Information</h3>
              <p className="text-gray-400 mb-6">Manage your account details and preferences</p>
              
              <div className="bg-gray-700/30 p-6 rounded-lg mb-8">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center text-2xl text-white font-bold">
                    MA
                  </div>
                  <div>
                    <h4 className="text-white text-xl font-medium">Murat Alpay</h4>
                    <p className="text-gray-400">DHQ Analyst</p>
                    <div className="mt-3 space-x-3">
                      <button className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-md hover:bg-gray-600 transition-colors">
                        Change Avatar
                      </button>
                      <button className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-md hover:bg-gray-600 transition-colors">
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value="Murat Alpay"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md text-gray-200 py-2 px-3"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value="murat.alpay@dhq.gov.ng"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md text-gray-200 py-2 px-3"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      value="+234 80 1234 5678"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md text-gray-200 py-2 px-3"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Department</label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-md text-gray-200 py-2 px-3">
                      <option>Intelligence Analysis</option>
                      <option>Field Operations</option>
                      <option>Cyber Security</option>
                      <option>Command & Control</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-dhq-blue text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Security Settings */}
          <TabsContent value="security">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="bg-gray-800/30 rounded-lg p-5">
                  <div className="flex items-center mb-6">
                    <Shield className="h-6 w-6 text-dhq-blue mr-3" />
                    <h3 className="text-lg font-medium text-white">Security Settings</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-200">Two-Factor Authentication</p>
                        <p className="text-xs text-gray-400">Add an extra layer of security</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-200">Biometric Login</p>
                        <p className="text-xs text-gray-400">Enable fingerprint or face ID</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-200">Device Trust</p>
                        <p className="text-xs text-gray-400">Remember trusted devices</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-200">Session Timeout</p>
                        <p className="text-xs text-gray-400">Auto logout after inactivity</p>
                      </div>
                      <select className="bg-gray-700 border border-gray-600 rounded-md text-gray-200 py-1 px-2">
                        <option>15 minutes</option>
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>4 hours</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="bg-gray-800/30 rounded-lg p-5 mb-6">
                  <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Current Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••••••"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md text-gray-200 py-2 px-3"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">New Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••••••"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md text-gray-200 py-2 px-3"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Confirm New Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••••••"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md text-gray-200 py-2 px-3"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <button className="px-4 py-2 bg-dhq-blue text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/30 rounded-lg p-5">
                  <h3 className="text-lg font-medium text-white mb-4">Login History</h3>
                  
                  <div className="space-y-3">
                    <div className="bg-gray-700/30 p-3 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm">Current Session</p>
                        <p className="text-xs text-gray-400">Lagos, Nigeria • Chrome on Windows • IP: 41.58.xx.xx</p>
                      </div>
                      <Badge className="bg-green-500 text-white">Active</Badge>
                    </div>
                    
                    <div className="bg-gray-700/30 p-3 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm">Yesterday, 15:42</p>
                        <p className="text-xs text-gray-400">Lagos, Nigeria • Chrome on Windows • IP: 41.58.xx.xx</p>
                      </div>
                      <button className="text-xs text-dhq-red hover:underline">Terminate</button>
                    </div>
                    
                    <div className="bg-gray-700/30 p-3 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm">May 20, 2023, 09:18</p>
                        <p className="text-xs text-gray-400">Abuja, Nigeria • Mobile App on iPhone • IP: 102.89.xx.xx</p>
                      </div>
                      <button className="text-xs text-dhq-red hover:underline">Terminate</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Notifications Settings */}
          <TabsContent value="notifications">
            <div className="bg-gray-800/30 rounded-lg p-5">
              <div className="flex items-center mb-6">
                <Bell className="h-6 w-6 text-dhq-blue mr-3" />
                <h3 className="text-lg font-medium text-white">Notification Preferences</h3>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-white mb-4">System Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-200">Critical Alerts</p>
                        <p className="text-xs text-gray-400">High priority security notifications</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-200">System Updates</p>
                        <p className="text-xs text-gray-400">Software updates and maintenance notices</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-200">Performance Alerts</p>
                        <p className="text-xs text-gray-400">System performance and outage notifications</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-gray-700" />
                
                <div>
                  <h4 className="text-white mb-4">Intelligence & Operations</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-200">New Reports</p>
                        <p className="text-xs text-gray-400">Alert when new reports are submitted</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-200">Status Changes</p>
                        <p className="text-xs text-gray-400">Alert when report status is updated</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-200">Threat Intelligence</p>
                        <p className="text-xs text-gray-400">Notifications for new threat assessments</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-200">Field Operations</p>
                        <p className="text-xs text-gray-400">Updates on active field operations</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-gray-700" />
                
                <div>
                  <h4 className="text-white mb-4">Communication</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-200">Direct Messages</p>
                        <p className="text-xs text-gray-400">Notification for new messages</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-200">Mentions</p>
                        <p className="text-xs text-gray-400">Alert when you are mentioned</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-200">Meeting Reminders</p>
                        <p className="text-xs text-gray-400">Calendar event notifications</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-gray-700" />
                
                <div>
                  <h4 className="text-white mb-4">Notification Delivery</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-700/30 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="text-white">In-App</h5>
                        <Switch defaultChecked={true} />
                      </div>
                      <p className="text-xs text-gray-400">Receive notifications in the application interface</p>
                    </div>
                    
                    <div className="bg-gray-700/30 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="text-white">Email</h5>
                        <Switch defaultChecked={true} />
                      </div>
                      <p className="text-xs text-gray-400">Send notifications to your email address</p>
                    </div>
                    
                    <div className="bg-gray-700/30 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="text-white">SMS</h5>
                        <Switch />
                      </div>
                      <p className="text-xs text-gray-400">Send critical alerts via text message</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">
                    Reset to Defaults
                  </button>
                  <button className="px-4 py-2 bg-dhq-blue text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* API Settings */}
          <TabsContent value="api">
            <div className="bg-gray-800/30 rounded-lg p-5">
              <div className="flex items-center mb-6">
                <Key className="h-6 w-6 text-dhq-blue mr-3" />
                <h3 className="text-lg font-medium text-white">API Access & Integration</h3>
              </div>
              
              <p className="text-gray-400 mb-6">
                Manage API keys and external service integrations for the platform
              </p>
              
              <div className="bg-gray-700/30 p-5 rounded-lg mb-8">
                <h4 className="text-white mb-4">API Key Management</h4>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-gray-400">Platform API Key</label>
                    <button className="text-xs text-dhq-blue hover:underline">Generate New</button>
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value="dhq_api_1234567890abcdef1234567890abcdef"
                      readOnly
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-l-md text-gray-300 py-2 px-3 font-mono text-sm"
                    />
                    <button className="bg-gray-600 text-gray-300 px-4 rounded-r-md hover:bg-gray-500 transition-colors">
                      Copy
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    This key provides full access to the API. Keep it secure and never share it publicly.
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-gray-400">Webhook Secret</label>
                    <button className="text-xs text-dhq-blue hover:underline">Rotate Secret</button>
                  </div>
                  <div className="flex">
                    <input
                      type="password"
                      value="whsec_abcdef1234567890abcdef1234567890"
                      readOnly
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-l-md text-gray-300 py-2 px-3 font-mono text-sm"
                    />
                    <button className="bg-gray-600 text-gray-300 px-4 rounded-r-md hover:bg-gray-500 transition-colors">
                      Show
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Used to verify webhook requests from our servers.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <h4 className="text-white">Integrated Services</h4>
                
                <div className="space-y-4">
                  <div className="bg-gray-700/30 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-white font-bold">M</span>
                      </div>
                      <div>
                        <p className="text-white">Mapbox API</p>
                        <p className="text-xs text-gray-400">Geolocation and mapping services</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white">Connected</Badge>
                  </div>
                  
                  <div className="bg-gray-700/30 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-white font-bold">T</span>
                      </div>
                      <div>
                        <p className="text-white">Twilio</p>
                        <p className="text-xs text-gray-400">SMS messaging and voice services</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white">Connected</Badge>
                  </div>
                  
                  <div className="bg-gray-700/30 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-white font-bold">F</span>
                      </div>
                      <div>
                        <p className="text-white">Filecoin Storage</p>
                        <p className="text-xs text-gray-400">Decentralized data archiving</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 border border-gray-500 rounded-md text-gray-300 text-sm">
                      Connect
                    </button>
                  </div>
                  
                  <div className="bg-gray-700/30 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-white font-bold">G</span>
                      </div>
                      <div>
                        <p className="text-white">Google Translate API</p>
                        <p className="text-xs text-gray-400">Language translation services</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 border border-gray-500 rounded-md text-gray-300 text-sm">
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
