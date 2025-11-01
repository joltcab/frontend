import React, { useState, useRef, useEffect } from "react";
import joltcab from "@/lib/joltcab-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, 
  BellRing,
  Car, 
  MapPin, 
  DollarSign, 
  MessageSquare, 
  Star, 
  AlertCircle, 
  Info,
  Tag,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Briefcase,
  Hotel,
  Radio,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const queryClient = useQueryClient();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Fetch current user
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const userData = await base44.auth.me();
        console.log('🔔 User loaded:', userData);
        return userData;
      } catch (error) {
        console.error('🔔 Error loading user:', error);
        return null;
      }
    },
  });

  // Fetch notifications
  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ['notifications', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      
      try {
        console.log('🔔 Fetching notifications for:', user.email);
        const result = await base44.entities.Notification.filter({
          user_email: user.email
        });
        
        console.log('🔔 Notifications fetched:', result.length);
        
        return result.sort((a, b) => 
          new Date(b.created_date) - new Date(a.created_date)
        );
      } catch (error) {
        console.error('🔔 Error fetching notifications:', error);
        return [];
      }
    },
    enabled: !!user?.email,
    refetchInterval: 30000,
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Mutations
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId) => 
      base44.entities.Notification.update(notificationId, { is_read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const unread = notifications.filter(n => !n.is_read);
      await Promise.all(
        unread.map(n => base44.entities.Notification.update(n.id, { is_read: true }))
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (notificationId) => 
      base44.entities.Notification.delete(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const getNotificationIcon = (type) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'ride_request':
        return <Car className={`${iconClass} text-blue-500`} />;
      case 'ride_accepted':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'ride_started':
        return <MapPin className={`${iconClass} text-purple-500`} />;
      case 'ride_completed':
        return <CheckCircle className={`${iconClass} text-green-600`} />;
      case 'ride_cancelled':
        return <XCircle className={`${iconClass} text-red-500`} />;
      case 'payment':
        return <DollarSign className={`${iconClass} text-green-500`} />;
      case 'message':
        return <MessageSquare className={`${iconClass} text-blue-500`} />;
      case 'rating':
        return <Star className={`${iconClass} text-yellow-500`} />;
      case 'alert':
        return <AlertCircle className={`${iconClass} text-red-500`} />;
      case 'promo':
        return <Tag className={`${iconClass} text-pink-500`} />;
      case 'info':
      default:
        return <Info className={`${iconClass} text-gray-500`} />;
    }
  };

  const getUserRoleIcon = (role) => {
    const iconClass = "w-4 h-4";
    switch (role) {
      case 'driver':
        return <Car className={`${iconClass} text-blue-500`} />;
      case 'corporate':
        return <Briefcase className={`${iconClass} text-purple-500`} />;
      case 'hotel':
        return <Hotel className={`${iconClass} text-pink-500`} />;
      case 'dispatcher':
        return <Radio className={`${iconClass} text-orange-500`} />;
      case 'admin':
        return <Users className={`${iconClass} text-red-500`} />;
      case 'partner':
        return <Briefcase className={`${iconClass} text-indigo-500`} />;
      case 'user':
      default:
        return <User className={`${iconClass} text-gray-500`} />;
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const handleNotificationClick = (notification) => {
    console.log('🔔 Notification clicked:', notification);
    
    if (!notification.is_read) {
      markAsReadMutation.mutate(notification.id);
    }
    
    if (notification.action_url) {
      setOpen(false);
      window.location.href = notification.action_url;
    }
  };

  const handleBellClick = () => {
    console.log('🔔 Bell clicked! Current open state:', open);
    setOpen(!open);
  };

  if (userLoading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Bell className="w-5 h-5 text-gray-400 animate-pulse" />
      </Button>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="relative">
      {/* Bell Button */}
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        className="relative hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={handleBellClick}
      >
        {unreadCount > 0 ? (
          <BellRing className="w-5 h-5 text-[#15B46A] animate-pulse" />
        ) : (
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        )}
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 px-1.5 py-0 text-xs bg-red-500 hover:bg-red-600 min-w-[20px] h-5 flex items-center justify-center"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[99999]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#15B46A]" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <Badge className="bg-[#15B46A] hover:bg-[#0F9456]">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              
              {notifications.length > 0 && unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAllAsReadMutation.mutate()}
                  disabled={markAllAsReadMutation.isPending}
                  className="text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {markAllAsReadMutation.isPending ? 'Marking...' : 'Mark all read'}
                </Button>
              )}
            </div>

            {/* User Role Badge */}
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                {getUserRoleIcon(user.role)}
                <span className="capitalize">{user.role} notifications</span>
                <span className="text-xs text-gray-400">({notifications.length} total)</span>
              </div>
            </div>

            {/* Notifications List */}
            <ScrollArea className="h-[400px] bg-white dark:bg-gray-800">
              {notificationsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-[#15B46A] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    No notifications yet
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    We'll notify you when something happens
                  </p>
                </div>
              ) : (
                <div className="divide-y dark:divide-gray-700">
                  <AnimatePresence>
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors relative ${
                          !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        {!notification.is_read && (
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#15B46A] rounded-full" />
                        )}

                        <div className="flex gap-3 ml-2">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm font-semibold ${
                                !notification.is_read 
                                  ? 'text-gray-900 dark:text-white' 
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {notification.title}
                              </p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-6 h-6 -mt-1 flex-shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteMutation.mutate(notification.id);
                                }}
                              >
                                <XCircle className="w-4 h-4 text-gray-400 hover:text-red-500" />
                              </Button>
                            </div>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                              {notification.message}
                            </p>

                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTimeAgo(notification.created_date)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </ScrollArea>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <Link to={createPageUrl('NotificationSettings')}>
                  <Button 
                    variant="ghost" 
                    className="w-full text-sm text-[#15B46A] hover:text-[#0F9456] hover:bg-green-50 dark:hover:bg-green-900/20"
                    onClick={() => setOpen(false)}
                  >
                    View All Notifications & Settings →
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}