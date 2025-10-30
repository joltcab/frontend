import { VehicleType } from '../models/VehicleType.js';

// @desc    Estimar tarifa de viaje
// @route   POST /api/v1/trips/estimate
// @access  Public
export const estimateFare = async (req, res, next) => {
  try {
    const { pickup_lat, pickup_lng, destination_lat, destination_lng, vehicle_type_id } = req.body;

    if (!pickup_lat || !pickup_lng || !destination_lat || !destination_lng) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Please provide pickup and destination coordinates.',
      });
    }

    // Calcular distancia usando fórmula de Haversine
    const distance = calculateDistance(
      pickup_lat,
      pickup_lng,
      destination_lat,
      destination_lng
    );

    // Estimar duración (velocidad promedio 40 km/h en ciudad)
    const duration = (distance / 40) * 60; // en minutos

    // Obtener tipos de vehículos activos
    const vehicleTypes = await VehicleType.find({ is_active: true }).sort({ sort_order: 1 });

    if (vehicleTypes.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'No vehicle types available.',
      });
    }

    // Calcular tarifas para cada tipo de vehículo
    const estimates = vehicleTypes.map(vehicle => {
      const fare = calculateFare(vehicle, distance, duration);
      
      return {
        vehicle_type_id: vehicle._id,
        vehicle_name: vehicle.vehicle_name,
        vehicle_image: vehicle.vehicle_image,
        capacity: vehicle.capacity,
        estimated_fare: Math.round(fare * 100) / 100,
        distance: Math.round(distance * 100) / 100,
        duration: Math.round(duration),
        base_fare: vehicle.base_fare,
        per_km_charge: vehicle.per_km_charge,
      };
    });

    res.json({
      success: true,
      data: {
        estimates,
        pickup: {
          lat: pickup_lat,
          lng: pickup_lng,
        },
        destination: {
          lat: destination_lat,
          lng: destination_lng,
        },
        distance: Math.round(distance * 100) / 100,
        duration: Math.round(duration),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Crear solicitud de viaje
// @route   POST /api/v1/trips
// @access  Private
export const createTrip = async (req, res, next) => {
  try {
    // TODO: Implementar creación de viaje
    res.json({
      success: true,
      message: 'Trip creation endpoint - to be implemented',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener viajes del usuario
// @route   GET /api/v1/trips
// @access  Private
export const getUserTrips = async (req, res, next) => {
  try {
    // TODO: Implementar obtención de viajes
    res.json({
      success: true,
      data: {
        trips: [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// Función auxiliar: Calcular distancia usando Haversine
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

// Función auxiliar: Calcular tarifa
function calculateFare(vehicle, distance, duration) {
  let fare = vehicle.base_fare;
  fare += distance * vehicle.per_km_charge;
  fare += duration * vehicle.per_minute_charge;
  
  // Aplicar tarifa mínima
  if (fare < vehicle.minimum_fare) {
    fare = vehicle.minimum_fare;
  }
  
  return fare;
}

export default {
  estimateFare,
  createTrip,
  getUserTrips,
};
