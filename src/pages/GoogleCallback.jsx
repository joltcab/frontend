import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { joltcab } from '@/lib/joltcab-api';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Página de callback para Google OAuth
 * Procesa el token y redirige al usuario
 */
export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Authenticating with Google...');

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Obtener token de la URL
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        throw new Error(error);
      }

      if (!token) {
        throw new Error('No authentication token received');
      }

      console.log('🔐 Processing Google OAuth callback...');
      
      // Guardar token
      joltcab.setToken(token);
      
      // Obtener datos del usuario
      const user = await joltcab.auth.me();
      console.log('👤 User authenticated:', user);

      // Verificar que sea admin
      if (user.user_type !== 1) {
        setStatus('error');
        setMessage('Access denied. Admin credentials required.');
        await joltcab.auth.logout();
        setTimeout(() => {
          navigate('/Admin');
        }, 2000);
        return;
      }

      // Verificar estado
      if (user.status === 'suspended') {
        setStatus('error');
        setMessage('Your account has been suspended.');
        await joltcab.auth.logout();
        setTimeout(() => {
          navigate('/Admin');
        }, 2000);
        return;
      }

      // Éxito
      setStatus('success');
      setMessage('Successfully authenticated!');
      toast.success('Welcome back, Admin!');
      
      // Redirigir al Admin Panel
      setTimeout(() => {
        navigate('/AdminPanel');
      }, 1000);

    } catch (error) {
      console.error('❌ OAuth callback error:', error);
      setStatus('error');
      setMessage(error.message || 'Authentication failed');
      toast.error('Authentication failed');
      
      setTimeout(() => {
        navigate('/Admin');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="text-center">
        {status === 'processing' && (
          <>
            <Loader2 className="w-16 h-16 text-[#15B46A] animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Authenticating...</h2>
            <p className="text-gray-400">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
            <p className="text-gray-400">{message}</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting to Admin Panel...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Authentication Failed</h2>
            <p className="text-gray-400">{message}</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting to login...</p>
          </>
        )}
      </div>
    </div>
  );
}
