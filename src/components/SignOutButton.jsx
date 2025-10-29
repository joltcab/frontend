import React from 'react';
import { useNavigate } from 'react-router-dom';
import { joltcab } from '@/lib/joltcab-api';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Botón de Sign Out reutilizable para todos los dashboards
 * Maneja el logout y redirige a la página principal
 */
export default function SignOutButton({ variant = 'outline', className = '' }) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      try {
        console.log('🔓 Signing out...');
        
        // Logout en el backend
        await joltcab.auth.logout();
        
        // Limpiar token local
        joltcab.clearToken();
        
        toast.success('Signed out successfully');
        
        // Redirigir a home
        navigate('/');
        
      } catch (error) {
        console.error('❌ Sign out error:', error);
        
        // Aunque falle, limpiar token local y redirigir
        joltcab.clearToken();
        navigate('/');
      }
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleSignOut}
      className={`${className}`}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </Button>
  );
}
