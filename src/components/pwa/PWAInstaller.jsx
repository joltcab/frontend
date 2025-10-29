import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, X, Smartphone, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after 5 seconds
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowInstallPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (isInstalled || !showInstallPrompt) return null;

  // Don't show if user dismissed recently
  if (localStorage.getItem('pwa_prompt_dismissed')) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 right-4 z-50 max-w-sm"
      >
        <Card className="shadow-2xl border-2 border-[#15B46A]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#15B46A] to-[#0F9456] rounded-xl flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Install JoltCab</h3>
                  <p className="text-xs text-gray-600">Get the app experience</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <ul className="space-y-2 mb-4 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Faster performance</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Work offline</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Push notifications</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Home screen access</span>
              </li>
            </ul>

            <Button
              onClick={handleInstall}
              className="w-full bg-gradient-to-r from-[#15B46A] to-[#0F9456] hover:from-[#0F9456] hover:to-[#15B46A]"
            >
              <Download className="w-4 h-4 mr-2" />
              Install App
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}