import React, { useState } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Shield, User, Lock, Globe, Monitor, BellOff, Eye, PieChart, Key, Map, ExternalLink, Badge } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Import the types from SettingsContext
import type { Language, RefreshRate, Homepage, Timezone, DateFormat, ExportFormat, SessionTimeout } from '@/contexts/SettingsContext';

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    // General Settings
    darkMode,
    compactView,
    language,
    dashboardRefreshRate,
    defaultHomepage,
    timezone,
    dateFormat,
    exportFormat,
    dataAnalytics,
    autoBackup,
    cacheMapData,
    toggleDarkMode,
    toggleCompactView,
    setLanguage,
    setDashboardRefreshRate,
    setDefaultHomepage,
    setTimezone,
    setDateFormat,
    setExportFormat,
    toggleDataAnalytics,
    toggleAutoBackup,
    toggleCacheMapData,

    // API Keys
    googleMapsKey,
    mapboxKey,
    setGoogleMapsKey,
    setMapboxKey,

    // Security Settings
    twoFactorAuth,
    biometricLogin,
    deviceTrust,
    sessionTimeout,
    toggleTwoFactorAuth,
    toggleBiometricLogin,
    toggleDeviceTrust,
    setSessionTimeout,

    // Notification Settings
    notifications,
    notificationDelivery,
    toggleNotification,
    toggleNotificationDelivery,

    // Notification Sounds
    notificationSounds,
    toggleNotificationSounds,
    setNotificationVolume,
    setCustomNotificationSound,
    setNotificationSound,

    // Actions
    resetToDefaults,
    saveSettings,
  } = useSettings();

  const [showGoogleKey, setShowGoogleKey] = useState(false);
  const [showMapboxKey, setShowMapboxKey] = useState(false);

  const handleSaveGoogleMapsKey = () => {
    if (googleMapsKey.trim()) {
      setGoogleMapsKey(googleMapsKey);
      toast({
        title: "Google Maps API Key Saved",
        description: "Your API key has been saved and will be used for map features.",
      });
    }
  };

  const handleSaveMapboxKey = () => {
    if (mapboxKey.trim()) {
      setMapboxKey(mapboxKey);
      toast({
        title: "Mapbox API Key Saved", 
        description: "Your API key has been saved and will be used for map features.",
      });
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Language;
    setLanguage(value);
  };

  const handleRefreshRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as RefreshRate;
    setDashboardRefreshRate(value);
  };

  const handleHomepageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Homepage;
    setDefaultHomepage(value);
  };

  const handleTimezoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Timezone;
    setTimezone(value);
  };

  const handleDateFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as DateFormat;
    setDateFormat(value);
  };

  const handleExportFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as ExportFormat;
    setExportFormat(value);
  };

  const handleSessionTimeoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as SessionTimeout;
    setSessionTimeout(value);
  };

  return (
    <div className="min-h-screen bg-dhq-dark-bg flex">
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex-1 p-8">
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
                      <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Eye className="h-5 w-5 mr-3 text-gray-400" />
                          <div>
                            <p className="text-gray-200">Compact View</p>
                            <p className="text-xs text-gray-400">Reduce spacing in lists and tables</p>
                          </div>
                        </div>
                      <Switch checked={compactView} onCheckedChange={toggleCompactView} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Globe className="h-5 w-5 mr-3 text-gray-400" />
                          <div>
                            <p className="text-gray-200">Language</p>
                            <p className="text-xs text-gray-400">Select interface language</p>
                          </div>
                        </div>
                      <select 
                        className="bg-gray-700 border border-gray-600 rounded-md text-gray-200 py-1 px-2"
                        value={language}
                        onChange={handleLanguageChange}
                      >
                        <option value="en-US">English (US)</option>
                        <option value="fr-FR">French</option>
                        <option value="es-ES">Spanish</option>
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
                      <select 
                        className="bg-gray-700 border border-gray-600 rounded-md text-gray-200 py-1 px-2"
                        value={dashboardRefreshRate}
                        onChange={handleRefreshRateChange}
                      >
                        <option value="1 minute">1 minute</option>
                        <option value="5 minutes">5 minutes</option>
                        <option value="15 minutes">15 minutes</option>
                        <option value="30 minutes">30 minutes</option>
                        <option value="1 hour">1 hour</option>
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
                          <select 
                            className="w-full bg-gray-700 border border-gray-600 rounded-md text-gray-200 py-2 px-3"
                            value={defaultHomepage}
                            onChange={handleHomepageChange}
                          >
                            <option value="Dashboard">Dashboard</option>
                            <option value="Reports">Reports</option>
                            <option value="Intelligence Feed">Intelligence Feed</option>
                            <option value="Map View">Map View</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="text-sm text-gray-400 block mb-1">Time Zone</label>
                          <select 
                            className="w-full bg-gray-700 border border-gray-600 rounded-md text-gray-200 py-2 px-3"
                            value={timezone}
                            onChange={handleTimezoneChange}
                          >
                            <option value="Africa/Lagos">Africa/Lagos</option>
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">America/New York</option>
                            <option value="Europe/London">Europe/London</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <div>
                            <label className="text-sm text-gray-400 block mb-1">Date Format</label>
                          <select 
                            className="w-full bg-gray-700 border border-gray-600 rounded-md text-gray-200 py-2 px-3"
                            value={dateFormat}
                            onChange={handleDateFormatChange}
                          >
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            <option value="MMM D, YYYY">MMM D, YYYY</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="text-sm text-gray-400 block mb-1">Export Format</label>
                          <select 
                            className="w-full bg-gray-700 border border-gray-600 rounded-md text-gray-200 py-2 px-3"
                            value={exportFormat}
                            onChange={handleExportFormatChange}
                          >
                            <option value="PDF">PDF</option>
                            <option value="Excel">Excel (.xlsx)</option>
                            <option value="CSV">CSV</option>
                            <option value="JSON">JSON</option>
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
                        <Switch checked={dataAnalytics} onCheckedChange={toggleDataAnalytics} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-200">Automatic Data Backup</p>
                            <p className="text-xs text-gray-400">Regularly backup your data to secure storage</p>
                          </div>
                        <Switch checked={autoBackup} onCheckedChange={toggleAutoBackup} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-200">Cache Map Data</p>
                            <p className="text-xs text-gray-400">Store map data for offline access</p>
                          </div>
                        <Switch checked={cacheMapData} onCheckedChange={toggleCacheMapData} />
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3 pt-4">
                      <Button variant="outline" onClick={resetToDefaults}>
                          Reset to Defaults
                      </Button>
                      <Button onClick={saveSettings}>
                          Save Changes
                      </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
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
                      <label className="text-sm text-gray-400 block mb-1">API Key</label>
                      <div className="flex gap-2">
                        <Input
                          type={showGoogleKey ? "text" : "password"}
                          value={googleMapsKey}
                          onChange={(e) => setGoogleMapsKey(e.target.value)}
                          placeholder="Enter your Google Maps API key"
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                        <Button
                          variant="outline"
                          onClick={() => setShowGoogleKey(!showGoogleKey)}
                          className="text-gray-400"
                        >
                          {showGoogleKey ? "Hide" : "Show"}
                        </Button>
                      </div>
                    </div>
                    <Button onClick={handleSaveGoogleMapsKey}>
                      Save API Key
                    </Button>
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
                      <label className="text-sm text-gray-400 block mb-1">API Key</label>
                      <div className="flex gap-2">
                        <Input
                          type={showMapboxKey ? "text" : "password"}
                          value={mapboxKey}
                          onChange={(e) => setMapboxKey(e.target.value)}
                          placeholder="Enter your Mapbox API key"
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                        <Button
                          variant="outline"
                          onClick={() => setShowMapboxKey(!showMapboxKey)}
                          className="text-gray-400"
                        >
                          {showMapboxKey ? "Hide" : "Show"}
                        </Button>
                      </div>
                    </div>
                    <Button onClick={handleSaveMapboxKey}>
                      Save API Key
                    </Button>
                  </div>
                    </div>
                    
                {/* Integration Status */}
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

          {/* Account Settings */}
          <TabsContent value="account">
            <div className="bg-gray-800/30 rounded-lg p-5">
              <h3 className="text-lg font-medium text-white mb-6">Account Information</h3>
              <p className="text-gray-400 mb-6">Manage your account details and preferences</p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    {user?.user_metadata?.avatar ? (
                      <img src={user.user_metadata.avatar} alt={user.user_metadata.full_name || 'User'} className="w-16 h-16 rounded-full" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-medium">
                        {(user?.user_metadata?.full_name || 'User').split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-white text-xl font-medium">{user?.user_metadata?.full_name || 'User'}</h4>
                    <p className="text-gray-400">{user?.user_metadata?.role || 'User'}</p>
                  </div>
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
                      <Switch checked={twoFactorAuth} onCheckedChange={toggleTwoFactorAuth} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-200">Biometric Login</p>
                          <p className="text-xs text-gray-400">Enable fingerprint or face ID</p>
                        </div>
                      <Switch checked={biometricLogin} onCheckedChange={toggleBiometricLogin} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-200">Device Trust</p>
                          <p className="text-xs text-gray-400">Remember trusted devices</p>
                        </div>
                      <Switch checked={deviceTrust} onCheckedChange={toggleDeviceTrust} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-200">Session Timeout</p>
                          <p className="text-xs text-gray-400">Auto logout after inactivity</p>
                        </div>
                      <select 
                        className="bg-gray-700 border border-gray-600 rounded-md text-gray-200 py-1 px-2"
                        value={sessionTimeout}
                        onChange={handleSessionTimeoutChange}
                      >
                        <option value="15 minutes">15 minutes</option>
                        <option value="30 minutes">30 minutes</option>
                        <option value="1 hour">1 hour</option>
                        <option value="2 hours">2 hours</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
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
                      <Button variant="ghost" size="sm" className="text-dhq-red hover:text-red-400">
                        Terminate
                      </Button>
                      </div>
                      
                      <div className="bg-gray-700/30 p-3 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm">May 20, 2023, 09:18</p>
                          <p className="text-xs text-gray-400">Abuja, Nigeria • Mobile App on iPhone • IP: 102.89.xx.xx</p>
                        </div>
                      <Button variant="ghost" size="sm" className="text-dhq-red hover:text-red-400">
                        Terminate
                      </Button>
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
                {/* System Notifications */}
                  <div>
                    <h4 className="text-white mb-4">System Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-200">Critical Alerts</p>
                          <p className="text-xs text-gray-400">High priority security notifications</p>
                        </div>
                      <Switch 
                        checked={notifications.criticalAlerts} 
                        onCheckedChange={() => toggleNotification('criticalAlerts')} 
                      />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-200">System Updates</p>
                          <p className="text-xs text-gray-400">Software updates and maintenance notices</p>
                        </div>
                      <Switch 
                        checked={notifications.systemUpdates} 
                        onCheckedChange={() => toggleNotification('systemUpdates')} 
                      />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-200">Performance Alerts</p>
                          <p className="text-xs text-gray-400">System performance and outage notifications</p>
                        </div>
                      <Switch 
                        checked={notifications.performanceAlerts} 
                        onCheckedChange={() => toggleNotification('performanceAlerts')} 
                      />
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="bg-gray-700" />
                  
                {/* Intelligence & Operations */}
                  <div>
                    <h4 className="text-white mb-4">Intelligence & Operations</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-200">New Reports</p>
                          <p className="text-xs text-gray-400">Alert when new reports are submitted</p>
                        </div>
                      <Switch 
                        checked={notifications.newReports} 
                        onCheckedChange={() => toggleNotification('newReports')} 
                      />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-200">Status Changes</p>
                          <p className="text-xs text-gray-400">Alert when report status is updated</p>
                        </div>
                      <Switch 
                        checked={notifications.statusChanges} 
                        onCheckedChange={() => toggleNotification('statusChanges')} 
                      />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-200">Threat Intelligence</p>
                          <p className="text-xs text-gray-400">Notifications for new threat assessments</p>
                        </div>
                      <Switch 
                        checked={notifications.threatIntelligence} 
                        onCheckedChange={() => toggleNotification('threatIntelligence')} 
                      />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-200">Field Operations</p>
                          <p className="text-xs text-gray-400">Updates on active field operations</p>
                        </div>
                      <Switch 
                        checked={notifications.fieldOperations} 
                        onCheckedChange={() => toggleNotification('fieldOperations')} 
                      />
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="bg-gray-700" />
                  
                {/* Communication */}
                  <div>
                    <h4 className="text-white mb-4">Communication</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-200">Direct Messages</p>
                          <p className="text-xs text-gray-400">Notification for new messages</p>
                        </div>
                      <Switch 
                        checked={notifications.directMessages} 
                        onCheckedChange={() => toggleNotification('directMessages')} 
                      />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-200">Mentions</p>
                          <p className="text-xs text-gray-400">Alert when you are mentioned</p>
                        </div>
                      <Switch 
                        checked={notifications.mentions} 
                        onCheckedChange={() => toggleNotification('mentions')} 
                      />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-200">Meeting Reminders</p>
                          <p className="text-xs text-gray-400">Calendar event notifications</p>
                        </div>
                      <Switch 
                        checked={notifications.meetingReminders} 
                        onCheckedChange={() => toggleNotification('meetingReminders')} 
                      />
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="bg-gray-700" />
                  
                {/* Notification Delivery */}
                  <div>
                    <h4 className="text-white mb-4">Notification Delivery</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-700/30 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="text-white">In-App</h5>
                        <Switch 
                          checked={notificationDelivery.inApp} 
                          onCheckedChange={() => toggleNotificationDelivery('inApp')} 
                        />
                        </div>
                        <p className="text-xs text-gray-400">Receive notifications in the application interface</p>
                      </div>
                      
                      <div className="bg-gray-700/30 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="text-white">Email</h5>
                        <Switch 
                          checked={notificationDelivery.email} 
                          onCheckedChange={() => toggleNotificationDelivery('email')} 
                        />
                        </div>
                        <p className="text-xs text-gray-400">Send notifications to your email address</p>
                      </div>
                      
                      <div className="bg-gray-700/30 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="text-white">SMS</h5>
                        <Switch 
                          checked={notificationDelivery.sms} 
                          onCheckedChange={() => toggleNotificationDelivery('sms')} 
                        />
                        </div>
                        <p className="text-xs text-gray-400">Send critical alerts via text message</p>
                      </div>
                    </div>
                  </div>
                  
                <Separator className="bg-gray-700" />

                {/* Notification Sounds */}
                <div>
                  <h4 className="text-white mb-4">Notification Sounds</h4>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-200">Enable Sound Notifications</p>
                        <p className="text-xs text-gray-400">Play sounds for notifications</p>
                  </div>
                      <Switch 
                        checked={notificationSounds.enabled} 
                        onCheckedChange={toggleNotificationSounds} 
                      />
                    </div>
                    
                    {notificationSounds.enabled && (
                      <>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-gray-200">Volume</p>
                            <p className="text-xs text-gray-400">{Math.round(notificationSounds.volume * 100)}%</p>
                      </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={notificationSounds.volume}
                            onChange={(e) => setNotificationVolume(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                          />
                  </div>
                    
                    <div className="space-y-4">
                          <div>
                            <p className="text-gray-200 mb-2">Custom Notification Sound</p>
                            <div className="flex items-center gap-4">
                              <Input
                                type="file"
                                accept="audio/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const url = URL.createObjectURL(file);
                                    setCustomNotificationSound(url);
                                  }
                                }}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                              {notificationSounds.customSound && (
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    const audio = new Audio(notificationSounds.customSound!);
                                    audio.volume = notificationSounds.volume;
                                    audio.play();
                                  }}
                                >
                                  Test Sound
                                </Button>
                              )}
                          </div>
                      </div>
                      
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-700/30 p-4 rounded-lg">
                              <p className="text-white mb-2">New Report Sound</p>
                              <div className="flex items-center gap-2">
                                <select
                                  value={notificationSounds.sounds.newReport}
                                  onChange={(e) => setNotificationSound('newReport', e.target.value)}
                                  className="bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 w-full"
                                >
                                  <option value="/sounds/new-report.mp3">Default</option>
                                  <option value="/sounds/alert1.mp3">Alert 1</option>
                                  <option value="/sounds/alert2.mp3">Alert 2</option>
                                  <option value="/sounds/alert3.mp3">Alert 3</option>
                                </select>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    const audio = new Audio(notificationSounds.sounds.newReport);
                                    audio.volume = notificationSounds.volume;
                                    audio.play();
                                  }}
                                >
                                  Test
                                </Button>
                          </div>
                          </div>

                            <div className="bg-gray-700/30 p-4 rounded-lg">
                              <p className="text-white mb-2">Critical Alert Sound</p>
                              <div className="flex items-center gap-2">
                                <select
                                  value={notificationSounds.sounds.criticalAlert}
                                  onChange={(e) => setNotificationSound('criticalAlert', e.target.value)}
                                  className="bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 w-full"
                                >
                                  <option value="/sounds/critical-alert.mp3">Default</option>
                                  <option value="/sounds/urgent1.mp3">Urgent 1</option>
                                  <option value="/sounds/urgent2.mp3">Urgent 2</option>
                                  <option value="/sounds/urgent3.mp3">Urgent 3</option>
                                </select>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    const audio = new Audio(notificationSounds.sounds.criticalAlert);
                                    audio.volume = notificationSounds.volume;
                                    audio.play();
                                  }}
                                >
                                  Test
                                </Button>
                        </div>
                      </div>
                      
                            <div className="bg-gray-700/30 p-4 rounded-lg">
                              <p className="text-white mb-2">Status Change Sound</p>
                              <div className="flex items-center gap-2">
                                <select
                                  value={notificationSounds.sounds.statusChange}
                                  onChange={(e) => setNotificationSound('statusChange', e.target.value)}
                                  className="bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 w-full"
                                >
                                  <option value="/sounds/status-change.mp3">Default</option>
                                  <option value="/sounds/update1.mp3">Update 1</option>
                                  <option value="/sounds/update2.mp3">Update 2</option>
                                  <option value="/sounds/update3.mp3">Update 3</option>
                                </select>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    const audio = new Audio(notificationSounds.sounds.statusChange);
                                    audio.volume = notificationSounds.volume;
                                    audio.play();
                                  }}
                                >
                                  Test
                                </Button>
                          </div>
                      </div>
                      
                            <div className="bg-gray-700/30 p-4 rounded-lg">
                              <p className="text-white mb-2">Message Sound</p>
                              <div className="flex items-center gap-2">
                                <select
                                  value={notificationSounds.sounds.message}
                                  onChange={(e) => setNotificationSound('message', e.target.value)}
                                  className="bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 w-full"
                                >
                                  <option value="/sounds/message.mp3">Default</option>
                                  <option value="/sounds/message1.mp3">Message 1</option>
                                  <option value="/sounds/message2.mp3">Message 2</option>
                                  <option value="/sounds/message3.mp3">Message 3</option>
                                </select>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    const audio = new Audio(notificationSounds.sounds.message);
                                    audio.volume = notificationSounds.volume;
                                    audio.play();
                                  }}
                                >
                                  Test
                                </Button>
                          </div>
                          </div>
                        </div>
                        </div>
                      </>
                    )}
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
