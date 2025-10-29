import React from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LogoutButton from "./LogoutButton";
import NotificationCenter from "../notifications/NotificationCenter";

export default function DashboardHeader({ 
  sidebarOpen, 
  setSidebarOpen, 
  title, 
  user 
}) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Left side: Menu button + Title */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          
          {title && (
            <h1 className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
              {title}
            </h1>
          )}
        </div>

        {/* Right side: Notifications + User info + Logout */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <NotificationCenter />

          {/* User info */}
          {user && (
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user.full_name || user.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          )}

          {/* Logout button */}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}