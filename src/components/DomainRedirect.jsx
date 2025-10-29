import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminLogin from '@/pages/AdminLogin';

/**
 * Componente para manejar redirecciones basadas en dominio
 * 
 * Reglas:
 * 1. joltcab.com/admin → Redirige a admin.joltcab.com
 * 2. admin.joltcab.com → Muestra formulario de login admin
 */
export default function DomainRedirect({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;

  useEffect(() => {
    // Regla 1: Si estamos en joltcab.com/admin → Redirigir a admin.joltcab.com
    if (hostname === 'joltcab.com' || hostname === 'app.joltcab.com') {
      if (pathname === '/admin' || pathname === '/Admin') {
        // Redirigir al subdominio admin
        window.location.href = 'https://admin.joltcab.com';
        return;
      }
    }
  }, [location, navigate, hostname, pathname]);

  // Regla 2: Si estamos en admin.joltcab.com → Mostrar AdminLogin
  if (hostname === 'admin.joltcab.com') {
    // Si está en la raíz o /Admin, mostrar AdminLogin
    if (pathname === '/' || pathname === '/Admin') {
      return <AdminLogin />;
    }
    // Si está en /AdminPanel, dejar pasar (ya está autenticado)
    if (pathname === '/AdminPanel') {
      return children;
    }
    // Para cualquier otra ruta, redirigir a AdminLogin
    navigate('/Admin');
    return <AdminLogin />;
  }

  // Para otros dominios (localhost, joltcab.com), mostrar contenido normal
  return children;
}
