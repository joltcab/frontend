import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import joltcab from "@/lib/joltcab-api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function EmergencyButton({ ride, user }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [activating, setActivating] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);

  const activateEmergency = async () => {
    setActivating(true);
    
    try {
      // 1. Get user's current location
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
        });
      });

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      // 2. Send emergency alert
  await joltcab.functions.invoke('triggerEmergency', {
        user_email: user.email,
        ride_id: ride?.id,
        location: location,
        timestamp: new Date().toISOString(),
      });

      // 3. Share location with emergency contacts
      if (user.emergency_contact_phone) {
  await joltcab.functions.invoke('notifyEmergencyContact', {
          contact_phone: user.emergency_contact_phone,
          contact_name: user.emergency_contact_name,
          user_name: user.full_name,
          location: location,
          ride: ride,
        });
      }

      setEmergencyActive(true);
      setShowConfirm(false);
      
      // Play emergency sound
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OmgUhELTKXh8bllHAU2jdXvyoIuBSp+yPDajzsIFGG56+qeUBEKSKHf8blpIAU0iNPuy4EvBSh9xvDajTsIF16z6OynVhEKSpzd7rBlHAUzhdLtyX8uBSh+yO/ajzwIFWC16+ujURMLSZ7e77hoHwU1is/px38wBSl8yO/cizwIFF616+yiUBELSaDf78BnHgU0iNPvyoEuBSh8xu/bjzwIFGC16+ykUBEKSaDf7rhnHgU0iNPvyX8uBSh8xvDbkDwIFV+z6+yjUBEKSZ/e77doHwU1is/px38wBSl8yO/bjzsIF1616eujURMLSZ7d7rhlHAU0iNPvyX8uBSh8xvDbkDwIFV6y6+ykUhEKSZ/e7rhnHgU2i8/sxn8wBSh8yO/bjzsIF1+06eyjUhEKSJ7e7rhnHgU0iNPvyX8uBSh8xu/bjTsIF1+z6+ykUBEKSaDf8LdnHgU1is/px38wBSl8yO/bjzsIF16z6e2kURMLSZ7d7rhlHAU0iNPvyX8uBSh8xu/bjTsIF1+y6+ykUhEKSJ/e77doHwU2i8/px38wBSl8yO/bjzsIF16y6e2lUREKSZ7e7rhlHAU0iNPvyX8uBSh8xu/cizwIFF+z6+ylUhEKSaDe7rhnHgU1is/rx38wBSl8yO/bjzsIF16y6+ylUhELSZ7d7rhlHAU0iNPvyX8uBSh8xu/cizwIF16y6+ylUhEKSZ/e77doHwU1is/px38wBSl8yO/bjzwIF16x6e2lUhEKSZ7d77hnHgU0iNPvyX8uBSh8xu/cizwIF16y6+ylUhEKSZ/e77doHwU1is/px38wBSl8yO/bjzwIF16x6e2lUhEKSZ7d77hnHgU0iNPvyX8uBSh8xvDbjDwIF16y6eylUhEKSZ/f7rhnHgU1is/px38wBSl8yO/bjzsIF16y6e2lUhEKSZ7d7rhlHAU0iNPvyX8uBSh8xu/cizwIF16y6+ylUhEKSZ/e77doHwU1is/px38wBSl8yO/bjzwIF16x6e2lUhEKSZ7d77hnHgU0iNPvyX8uBSh8xvDbjDwIF16y6eylUhEKSZ/f7rhnHgU1is/px38wBSl8yO/bjzsIF16y6e2lURIKSZ7d7rhlHAU0iNPvyX8uBSh8xu/cizwIF16y6+ylUhEKSZ/e77doHwU1is/px38wBSl8yO/bjzwIF16y6e2lUhEKSZ7d77hnHgU0iNPvyX8uBSh8xu/bjDwIF16y6eylUhEKSZ/f7rhnHgU1is/sx4AwBSh8yO/bjzsIF16y6e2lURIKSZ7d7rhlHAU0iNPvyX8uBSh8xu/cizwIF16y6+ylUhEKSZ/e77doHwU1is/px38wBSl8yO/bjzwIF16y6e2lUhEKSZ7d77hnHgU0iNPvyX8uBSh8xu/bjDwIF16y6eylUhEKSZ/f7rhnHgU1is/sx4AwBSh8yO/bjzsIF16y6e2lURIKSZ7d7rhlHAU0iNPvyX8uBSh8xu/cizwIF16y6+ylUhEKSZ/e77doHwU1is/px38wBSl8yO/bjzwIF16x6e2lUhEKSZ7d77hnHgU0iNPvyX8uBSh8xu/bjDwIF16y6eylUhEKSZ/f7rhnHgU1is/sx4AwBSh8yO/bjzsIF16y6e2lURIK');
      audio.volume = 1.0;
      audio.play();

    } catch (error) {
      console.error('❌ Error activating emergency:', error);
      alert('Error al activar emergencia. Llama al 911.');
    } finally {
      setActivating(false);
    }
  };

  return (
    <>
      {/* Emergency Button - Always visible during trip */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-24 right-6 z-50"
      >
        <Button
          size="lg"
          onClick={() => setShowConfirm(true)}
          className={`
            ${emergencyActive ? 'bg-red-600 animate-pulse' : 'bg-red-500 hover:bg-red-600'}
            text-white rounded-full w-16 h-16 shadow-2xl
          `}
        >
          <AlertTriangle className="w-8 h-8" />
        </Button>
      </motion.div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              Activar Emergencia
            </DialogTitle>
            <DialogDescription className="text-base space-y-3 pt-4">
              <p className="font-semibold">Esto hará lo siguiente:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Notificar a autoridades locales</li>
                <li>Enviar tu ubicación a contactos de emergencia</li>
                <li>Alertar al admin de JoltCab</li>
                <li>Grabar audio del viaje</li>
                <li>Compartir datos del conductor</li>
              </ul>
              <p className="text-red-600 font-bold mt-4">
                ⚠️ Solo presiona si estás en peligro real
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              disabled={activating}
            >
              Cancelar
            </Button>
            <Button
              onClick={activateEmergency}
              disabled={activating}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {activating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Activando...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Activar SOS
                </>
              )}
            </Button>
          </DialogFooter>

          {/* Emergency Contacts */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-semibold mb-2">O llama directamente:</p>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.location.href = 'tel:911'}
              >
                <Phone className="w-4 h-4 mr-2" />
                911 - Emergencias
              </Button>
              {user.emergency_contact_phone && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.location.href = `tel:${user.emergency_contact_phone}`}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {user.emergency_contact_name || 'Contacto de emergencia'}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Emergency Active Indicator */}
      <AnimatePresence>
        {emergencyActive && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-0 right-0 z-50 mx-4"
          >
            <div className="bg-red-600 text-white p-4 rounded-lg shadow-2xl max-w-md mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <div>
                  <p className="font-bold">🚨 EMERGENCIA ACTIVADA</p>
                  <p className="text-sm">Autoridades notificadas. Mantén la calma.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}