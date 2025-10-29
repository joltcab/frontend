import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";

export default function LogoutButton({ variant = "ghost", size = "default", className = "" }) {
  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      try {
        await base44.auth.logout();
      } catch (error) {
        console.error("Error logging out:", error);
      } finally {
        // Always redirect to Home, even if logout fails
        window.location.href = createPageUrl("Home");
      }
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={`gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 ${className}`}
    >
      <LogOut className="w-4 h-4" />
      Logout
    </Button>
  );
}