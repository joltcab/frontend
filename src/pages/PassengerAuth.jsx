import React, { useEffect } from "react";
import { createPageUrl } from "@/utils";
import { Loader2 } from "lucide-react";

export default function PassengerAuth() {
  useEffect(() => {
    // Redirigir a nuestro login custom, NO al nativo de Base44
    window.location.href = createPageUrl("Register");
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-[#15B46A] animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}