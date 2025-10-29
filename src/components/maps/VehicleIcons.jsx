import React from "react";

/**
 * Vehicle Icons for Map Markers
 * Diferentes iconos según el tipo de vehículo y estado
 */

// 🔧 FIX: Export que faltaba
export const VEHICLE_ICON_URL = {
  standard: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIyMCIgZmlsbD0iIzE1QjQ2QSIvPgogIDxwYXRoIGQ9Ik0yNCAxNkMxOS41ODE3IDE2IDE2IDE5LjU4MTcgMTYgMjRDMTYgMjguNDE4MyAxOS41ODE3IDMyIDI0IDMyQzI4LjQxODMgMzIgMzIgMjguNDE4MyAzMiAyNEMzMiAxOS41ODE3IDI4LjQxODMgMTYgMjQgMTZaIiBmaWxsPSJ3aGl0ZSIvPgogIDxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0iIzE1QjQ2QSIvPgo8L3N2Zz4=',
  xl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIyMCIgZmlsbD0iIzBGOTQ1NiIvPgogIDxwYXRoIGQ9Ik0yNCAxNkMxOS41ODE3IDE2IDE2IDE5LjU4MTcgMTYgMjRDMTYgMjguNDE4MyAxOS41ODE3IDMyIDI0IDMyQzI4LjQxODMgMzIgMzIgMjguNDE4MyAzMiAyNEMzMiAxOS41ODE3IDI4LjQxODMgMTYgMjQgMTZaIiBmaWxsPSJ3aGl0ZSIvPgogIDxyZWN0IHg9IjE4IiB5PSIxOCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjEyIiBmaWxsPSIjMEY5NDU2Ii8+Cjwvc3ZnPg==',
  premium: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIyMCIgZmlsbD0iI0ZGRDcwMCIvPgogIDxwYXRoIGQ9Ik0yNCAxNkMxOS41ODE3IDE2IDE2IDE5LjU4MTcgMTYgMjRDMTYgMjguNDE4MyAxOS41ODE3IDMyIDI0IDMyQzI4LjQxODMgMzIgMzIgMjguNDE4MyAzMiAyNEMzMiAxOS41ODE3IDI4LjQxODMgMTYgMjQgMTZaIiBmaWxsPSJ3aGl0ZSIvPgogIDxwb2x5Z29uIHBvaW50cz0iMjQsMTggMjYsMjIgMzAsMjIgMjcsMjUgMjgsMjkgMjQsMjcgMjAsMjkgMjEsMjUgMTgsMjIgMjIsMjIiIGZpbGw9IiNGRkQ3MDAiLz4KPC9zdmc+'
};

// Vehicle type colors
export const VEHICLE_COLORS = {
  standard: '#15B46A',
  xl: '#0F9456',
  premium: '#FFD700',
  suv: '#4A90E2',
  electric: '#00D4AA'
};

// 🔧 FIX: Función que faltaba - Rotar icono del marcador según heading
export const rotateMarkerIcon = (heading) => {
  return heading || 0;
};

// Get SVG icon for vehicle
export const getVehicleIcon = (vehicleType = 'standard', status = 'available') => {
  const color = VEHICLE_COLORS[vehicleType] || VEHICLE_COLORS.standard;
  const opacity = status === 'busy' ? '0.5' : '1';

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" fill="${color}" opacity="${opacity}"/>
      <path d="M24 16C19.5817 16 16 19.5817 16 24C16 28.4183 19.5817 32 24 32C28.4183 32 32 28.4183 32 24C32 19.5817 28.4183 16 24 16Z" fill="white"/>
      <rect x="20" y="20" width="8" height="8" rx="1" fill="${color}"/>
      ${status === 'busy' ? '<circle cx="24" cy="24" r="3" fill="red"/>' : ''}
    </svg>
  `)}`;
};

// Get vehicle marker HTML
export const getVehicleMarkerHTML = (driver, vehicleType = 'standard', status = 'available') => {
  const color = VEHICLE_COLORS[vehicleType] || VEHICLE_COLORS.standard;
  const statusColor = status === 'busy' ? '#EF4444' : '#10B981';

  return `
    <div style="position: relative;">
      <div style="
        width: 48px;
        height: 48px;
        background: ${color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        border: 3px solid white;
      ">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H15V3H9V5H6.5C5.84 5 5.28 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01ZM6.85 7H17.14L18.22 10H5.78L6.85 7ZM19 17H5V12H19V17Z"/>
          <circle cx="7.5" cy="14.5" r="1.5"/>
          <circle cx="16.5" cy="14.5" r="1.5"/>
        </svg>
      </div>
      <div style="
        position: absolute;
        top: -4px;
        right: -4px;
        width: 16px;
        height: 16px;
        background: ${statusColor};
        border: 2px solid white;
        border-radius: 50%;
      "></div>
    </div>
  `;
};

// React Component version
export default function VehicleIcon({ vehicleType = 'standard', status = 'available', size = 48 }) {
  const color = VEHICLE_COLORS[vehicleType] || VEHICLE_COLORS.standard;
  const statusColor = status === 'busy' ? '#EF4444' : '#10B981';

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <div 
        style={{
          width: size,
          height: size,
          background: color,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          border: '3px solid white'
        }}
      >
        <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="white">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H15V3H9V5H6.5C5.84 5 5.28 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01ZM6.85 7H17.14L18.22 10H5.78L6.85 7ZM19 17H5V12H19V17Z"/>
          <circle cx="7.5" cy="14.5" r="1.5"/>
          <circle cx="16.5" cy="14.5" r="1.5"/>
        </svg>
      </div>
      <div 
        style={{
          position: 'absolute',
          top: -4,
          right: -4,
          width: 16,
          height: 16,
          background: statusColor,
          border: '2px solid white',
          borderRadius: '50%'
        }}
      />
    </div>
  );
}