// @desc    Obtener notificaciones del usuario
// @route   GET /api/v1/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // TODO: Implementar consulta a base de datos

    res.json({
      success: true,
      data: {
        notifications: [],
        unread_count: 0,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Marcar notificación como leída
// @route   PUT /api/v1/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    // TODO: Implementar actualización en base de datos

    res.json({
      success: true,
      message: 'Notification marked as read.',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getNotifications,
  markAsRead,
};
