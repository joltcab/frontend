/**
 * Base44 Client Adapter
 * Reemplaza @base44/sdk con nuestro API client
 */
import apiClient from '@/lib/api-client';

// Export apiClient como base44 para mantener compatibilidad
export const base44 = apiClient;

// Export default también
export default apiClient;
