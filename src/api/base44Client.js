/**
 * JoltCab Client Adapter
 * Punto único para importar la instancia de JoltCab
 */
import joltcab from '@/lib/joltcab-api';

// Export explícito de joltcab
export { joltcab };

// Compatibilidad temporal: exportar alias base44 apuntando a joltcab
export const base44 = joltcab;

// Export default
export default joltcab;
