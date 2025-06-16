import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export type Language = 'en-US' | 'fr-FR' | 'es-ES';
export type RefreshRate = '1 minute' | '5 minutes' | '15 minutes' | '30 minutes';
export type Homepage = 'Dashboard' | 'Reports' | 'Intelligence' | 'Settings';
export type Timezone = 'Africa/Lagos' | 'UTC' | 'America/New_York' | 'Europe/London';
export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
export type ExportFormat = 'PDF' | 'CSV' | 'Excel';
export type SessionTimeout = '15 minutes' | '30 minutes' | '1 hour' | '2 hours';

interface SettingsState {
  // General Settings
  darkMode: boolean;
  compactView: boolean;
  language: Language;
  dashboardRefreshRate: RefreshRate;
  defaultHomepage: Homepage;
  timezone: Timezone;
  dateFormat: DateFormat;
  exportFormat: ExportFormat;
  dataAnalytics: boolean;
  autoBackup: boolean;
  cacheMapData: boolean;

  // API Keys
  googleMapsKey: string;
  mapboxKey: string;

  // Security Settings
  twoFactorAuth: boolean;
  biometricLogin: boolean;
  deviceTrust: boolean;
  sessionTimeout: SessionTimeout;

  // Notification Settings
  notifications: {
    criticalAlerts: boolean;
    systemUpdates: boolean;
    performanceAlerts: boolean;
    newReports: boolean;
    statusChanges: boolean;
    threatIntelligence: boolean;
    fieldOperations: boolean;
    directMessages: boolean;
    mentions: boolean;
    meetingReminders: boolean;
  };
  notificationDelivery: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
  };
  notificationSounds: {
    enabled: boolean;
    volume: number;
    customSound: string | null;
    sounds: {
      newReport: string;
      criticalAlert: string;
      statusChange: string;
      message: string;
    };
  };
}

interface SettingsActions {
  toggleDarkMode: () => void;
  toggleCompactView: () => void;
  setLanguage: (lang: Language) => void;
  setDashboardRefreshRate: (rate: RefreshRate) => void;
  setDefaultHomepage: (page: Homepage) => void;
  setTimezone: (zone: Timezone) => void;
  setDateFormat: (format: DateFormat) => void;
  setExportFormat: (format: ExportFormat) => void;
  toggleDataAnalytics: () => void;
  toggleAutoBackup: () => void;
  toggleCacheMapData: () => void;
  setGoogleMapsKey: (key: string) => void;
  setMapboxKey: (key: string) => void;
  toggleTwoFactorAuth: () => void;
  toggleBiometricLogin: () => void;
  toggleDeviceTrust: () => void;
  setSessionTimeout: (timeout: SessionTimeout) => void;
  toggleNotification: (key: keyof SettingsState['notifications']) => void;
  toggleNotificationDelivery: (method: keyof SettingsState['notificationDelivery']) => void;
  toggleNotificationSounds: () => void;
  setNotificationVolume: (volume: number) => void;
  setCustomNotificationSound: (sound: string | null) => void;
  setNotificationSound: (type: keyof SettingsState['notificationSounds']['sounds'], sound: string) => void;
  resetToDefaults: () => void;
  saveSettings: () => void;
}

type SettingsContextType = SettingsState & SettingsActions;

const defaultSettings: SettingsState = {
  darkMode: true,
  compactView: false,
  language: 'en-US',
  dashboardRefreshRate: '5 minutes',
  defaultHomepage: 'Dashboard',
  timezone: 'Africa/Lagos',
  dateFormat: 'DD/MM/YYYY',
  exportFormat: 'PDF',
  dataAnalytics: true,
  autoBackup: true,
  cacheMapData: false,
  googleMapsKey: '',
  mapboxKey: '',
  twoFactorAuth: true,
  biometricLogin: false,
  deviceTrust: true,
  sessionTimeout: '30 minutes',
  notifications: {
    criticalAlerts: true,
    systemUpdates: true,
    performanceAlerts: false,
    newReports: true,
    statusChanges: true,
    threatIntelligence: true,
    fieldOperations: false,
    directMessages: true,
    mentions: true,
    meetingReminders: false,
  },
  notificationDelivery: {
    inApp: true,
    email: true,
    sms: false,
  },
  notificationSounds: {
    enabled: true,
    volume: 0.7,
    customSound: null,
    sounds: {
      newReport: '/sounds/new-report.mp3',
      criticalAlert: '/sounds/critical-alert.mp3',
      statusChange: '/sounds/status-change.mp3',
      message: '/sounds/message.mp3',
    },
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const { toast } = useToast();

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('app_settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('app_settings', JSON.stringify(settings));
  }, [settings]);

  const toggleDarkMode = () => {
    setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const toggleCompactView = () => {
    setSettings(prev => ({ ...prev, compactView: !prev.compactView }));
  };

  const setLanguage = (lang: Language) => {
    setSettings(prev => ({ ...prev, language: lang }));
  };

  const setDashboardRefreshRate = (rate: RefreshRate) => {
    setSettings(prev => ({ ...prev, dashboardRefreshRate: rate }));
  };

  const setDefaultHomepage = (page: Homepage) => {
    setSettings(prev => ({ ...prev, defaultHomepage: page }));
  };

  const setTimezone = (zone: Timezone) => {
    setSettings(prev => ({ ...prev, timezone: zone }));
  };

  const setDateFormat = (format: DateFormat) => {
    setSettings(prev => ({ ...prev, dateFormat: format }));
  };

  const setExportFormat = (format: ExportFormat) => {
    setSettings(prev => ({ ...prev, exportFormat: format }));
  };

  const toggleDataAnalytics = () => {
    setSettings(prev => ({ ...prev, dataAnalytics: !prev.dataAnalytics }));
  };

  const toggleAutoBackup = () => {
    setSettings(prev => ({ ...prev, autoBackup: !prev.autoBackup }));
  };

  const toggleCacheMapData = () => {
    setSettings(prev => ({ ...prev, cacheMapData: !prev.cacheMapData }));
  };

  const setGoogleMapsKey = (key: string) => {
    setSettings(prev => ({ ...prev, googleMapsKey: key }));
    localStorage.setItem('google_maps_api_key', key);
  };

  const setMapboxKey = (key: string) => {
    setSettings(prev => ({ ...prev, mapboxKey: key }));
    localStorage.setItem('mapbox_api_key', key);
  };

  const toggleTwoFactorAuth = () => {
    setSettings(prev => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }));
  };

  const toggleBiometricLogin = () => {
    setSettings(prev => ({ ...prev, biometricLogin: !prev.biometricLogin }));
  };

  const toggleDeviceTrust = () => {
    setSettings(prev => ({ ...prev, deviceTrust: !prev.deviceTrust }));
  };

  const setSessionTimeout = (timeout: SessionTimeout) => {
    setSettings(prev => ({ ...prev, sessionTimeout: timeout }));
  };

  const toggleNotification = (key: keyof SettingsState['notifications']) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const toggleNotificationDelivery = (method: keyof SettingsState['notificationDelivery']) => {
    setSettings(prev => ({
      ...prev,
      notificationDelivery: {
        ...prev.notificationDelivery,
        [method]: !prev.notificationDelivery[method],
      },
    }));
  };

  const toggleNotificationSounds = () => {
    setSettings(prev => ({
      ...prev,
      notificationSounds: {
        ...prev.notificationSounds,
        enabled: !prev.notificationSounds.enabled,
      },
    }));
  };

  const setNotificationVolume = (volume: number) => {
    setSettings(prev => ({
      ...prev,
      notificationSounds: {
        ...prev.notificationSounds,
        volume,
      },
    }));
  };

  const setCustomNotificationSound = (sound: string | null) => {
    setSettings(prev => ({
      ...prev,
      notificationSounds: {
        ...prev.notificationSounds,
        customSound: sound,
      },
    }));
  };

  const setNotificationSound = (type: keyof SettingsState['notificationSounds']['sounds'], sound: string) => {
    setSettings(prev => ({
      ...prev,
      notificationSounds: {
        ...prev.notificationSounds,
        sounds: {
          ...prev.notificationSounds.sounds,
          [type]: sound,
        },
      },
    }));
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to their default values.",
    });
  };

  const saveSettings = () => {
    localStorage.setItem('app_settings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully.",
    });
  };

  const value: SettingsContextType = {
    ...settings,
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
    setGoogleMapsKey,
    setMapboxKey,
    toggleTwoFactorAuth,
    toggleBiometricLogin,
    toggleDeviceTrust,
    setSessionTimeout,
    toggleNotification,
    toggleNotificationDelivery,
    toggleNotificationSounds,
    setNotificationVolume,
    setCustomNotificationSound,
    setNotificationSound,
    resetToDefaults,
    saveSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}; 