/**
 * Base44 Client Adapter
 * Reemplaza @base44/sdk con JoltCab API client
 */
import joltcabAPI from '@/lib/joltcab-api';

// Export joltcabAPI como base44 para mantener compatibilidad
export const base44 = joltcabAPI;

// Export default también
export default joltcabAPI;
