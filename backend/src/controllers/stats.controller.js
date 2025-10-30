import { User } from '../models/User.js';

// @desc    Obtener estadísticas del dashboard
// @route   GET /api/v1/stats/dashboard
// @access  Private (Admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    // Contar usuarios por tipo
    const totalUsers = await User.countDocuments({ user_type: 7 }); // Usuarios normales
    const totalDrivers = await User.countDocuments({ user_type: 2 }); // Conductores
    const totalAdmins = await User.countDocuments({ user_type: 1 }); // Admins
    const totalDispatchers = await User.countDocuments({ user_type: 3 }); // Dispatchers
    const totalCorporate = await User.countDocuments({ user_type: 4 }); // Corporativos
    const totalHotels = await User.countDocuments({ user_type: 5 }); // Hoteles

    // Conductores online (simulado por ahora)
    const onlineDrivers = 0; // TODO: Implementar lógica de conductores online

    // Estadísticas de viajes (simulado por ahora)
    const todayRequests = 0;
    const completedRequests = 0;
    const scheduledRequests = 0;
    const cancelledRequests = 0;

    // Ingresos (simulado por ahora)
    const todayRevenue = 0;
    const totalRevenue = 0;

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          drivers: totalDrivers,
          admins: totalAdmins,
          dispatchers: totalDispatchers,
          corporate: totalCorporate,
          hotels: totalHotels,
          onlineDrivers: onlineDrivers,
        },
        trips: {
          today: todayRequests,
          completed: completedRequests,
          scheduled: scheduledRequests,
          cancelled: cancelledRequests,
        },
        revenue: {
          today: todayRevenue,
          total: totalRevenue,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener lista de usuarios
// @route   GET /api/v1/stats/users
// @access  Private (Admin)
export const getUsers = async (req, res, next) => {
  try {
    const { role, limit = 100, offset = 0 } = req.query;

    let query = {};
    
    // Filtrar por rol si se especifica
    if (role === 'user') {
      query.user_type = 7;
    } else if (role === 'driver') {
      query.user_type = 2;
    } else if (role === 'admin') {
      query.user_type = 1;
    } else if (role === 'dispatcher') {
      query.user_type = 3;
    } else if (role === 'corporate') {
      query.user_type = 4;
    } else if (role === 'hotel') {
      query.user_type = 5;
    }

    const users = await User.find(query)
      .select('-password -token')
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .sort({ created_at: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener lista de conductores (drivers)
// @route   GET /api/v1/stats/drivers
// @access  Private (Admin)
export const getDrivers = async (req, res, next) => {
  try {
    const { limit = 100, offset = 0 } = req.query;

    const drivers = await User.find({ user_type: 2 })
      .select('-password -token')
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .sort({ created_at: -1 });

    const total = await User.countDocuments({ user_type: 2 });

    res.json({
      success: true,
      data: {
        drivers,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener lista de viajes (simulado)
// @route   GET /api/v1/stats/rides
// @access  Private (Admin)
export const getRides = async (req, res, next) => {
  try {
    // Por ahora retornamos un array vacío
    // TODO: Implementar modelo de Rides
    res.json({
      success: true,
      data: {
        rides: [],
        total: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getDashboardStats,
  getUsers,
  getDrivers,
  getRides,
};
