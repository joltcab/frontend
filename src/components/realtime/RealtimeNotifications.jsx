import React from "react";
import { Bell, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRealtime } from "./RealtimeProvider";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";

export default function RealtimeNotifications() {
  const { notifications, clearNotifications, markAsRead, connected } = useRealtime();
  const [isOpen, setIsOpen] = React.useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="relative">
      {/* Bell Icon */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs bg-red-500">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
        {!connected && (
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        )}
      </Button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-12 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {connected ? 'Live updates enabled' : 'Reconnecting...'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearNotifications}
                    className="text-xs"
                  >
                    Clear all
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <AnimatePresence>
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900 dark:text-white">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                            {moment(notification.created_date).fromNow()}
                          </p>
                        </div>
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsRead(notification.id)}
                            className="flex-shrink-0"
                          >
                            <Check className="w-4 h-4 text-blue-600" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}