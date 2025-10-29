import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, X, Smartphone, Apple } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // Listen for install prompt (Android/Desktop)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after 30 seconds on homepage
      setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-prompt-dismissed');
        if (!dismissed) {
          setShowPrompt(true);
        }
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
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
      setShowPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
      >
        <Card className="bg-white shadow-2xl border-2 border-[#15B46A]">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#15B46A] to-[#0F9456] rounded-xl flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Install JoltCab</h3>
                  <p className="text-sm text-gray-600">Access faster from your home screen</p>
                </div>
              </div>
              <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isIOS ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-900 mb-2 font-semibold flex items-center gap-2">
                  <Apple className="w-4 h-4" />
                  Install on iPhone:
                </p>
                <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Tap the Share button <span className="inline-block">⬆️</span></li>
                  <li>Scroll down and tap "Add to Home Screen"</li>
                  <li>Tap "Add" in the top right</li>
                </ol>
              </div>
            ) : (
              <Button 
                onClick={handleInstall}
                className="w-full bg-gradient-to-r from-[#15B46A] to-[#0F9456] hover:opacity-90 text-white font-semibold"
              >
                <Download className="w-5 h-5 mr-2" />
                Install App
              </Button>
            )}

            <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-gray-600">
              <div className="text-center">
                <div className="font-semibold text-[#15B46A]">⚡ Fast</div>
                <div>Quick access</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-[#15B46A]">📱 Native</div>
                <div>Like an app</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-[#15B46A]">🔔 Alerts</div>
                <div>Push notifications</div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}