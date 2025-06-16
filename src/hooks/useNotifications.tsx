import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/contexts/SettingsContext';

export interface Notification {
  id: string;
  type: 'new_report' | 'assignment' | 'resolution' | 'update' | 'info';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();
  const { notificationSounds } = useSettings();

  const playNotificationSound = (type: Notification['type']) => {
    if (!notificationSounds.enabled) return;

    let soundFile = '';
    switch (type) {
      case 'new_report':
        soundFile = notificationSounds.sounds.newReport;
        break;
      case 'assignment':
      case 'resolution':
        soundFile = notificationSounds.sounds.statusChange;
        break;
      case 'update':
        soundFile = notificationSounds.sounds.criticalAlert;
        break;
      default:
        soundFile = notificationSounds.sounds.message;
    }

    if (notificationSounds.customSound) {
      soundFile = notificationSounds.customSound;
    }

    const audio = new Audio(soundFile);
    audio.volume = notificationSounds.volume;
    audio.play().catch(error => {
      console.error('Error playing notification sound:', error);
    });
  };

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const typedNotifications = (data || []).map(notification => ({
        ...notification,
        type: notification.type as 'new_report' | 'assignment' | 'resolution' | 'update' | 'info'
      }));

      setNotifications(typedNotifications);
      setUnreadCount(typedNotifications.filter(n => !n.is_read).length);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          const newNotification = {
            ...payload.new,
            type: payload.new.type as 'new_report' | 'assignment' | 'resolution' | 'update' | 'info'
          } as Notification;
          
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          toast({
            title: newNotification.title,
            description: newNotification.message,
          });

          // Play notification sound
          playNotificationSound(newNotification.type);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast, notificationSounds]);

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  };
};
