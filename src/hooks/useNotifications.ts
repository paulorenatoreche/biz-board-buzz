
import { useEffect, useState } from 'react';
import { getUnreadNotifications, markNotificationAsRead, Notification } from '@/lib/supabase';
import { toast } from 'sonner';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  const checkForNewNotifications = async () => {
    try {
      const unreadNotifications = await getUnreadNotifications();
      
      // Filter notifications that are newer than last check
      const newNotifications = unreadNotifications.filter(notification => 
        new Date(notification.created_at) > lastChecked
      );

      if (newNotifications.length > 0) {
        // Show toast for new notifications
        newNotifications.forEach(notification => {
          toast.success(notification.message, {
            description: 'Clique para ver o post',
            duration: 5000,
          });
        });
        
        setLastChecked(new Date());
      }

      setNotifications(unreadNotifications);
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    // Check immediately
    checkForNewNotifications();

    // Then check every 30 seconds
    const interval = setInterval(checkForNewNotifications, 30000);

    return () => clearInterval(interval);
  }, [lastChecked]);

  return {
    notifications,
    unreadCount: notifications.length,
    markAsRead,
    checkForNewNotifications
  };
};
