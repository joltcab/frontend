// @desc    Obtener lista de eventos
// @route   GET /api/v1/events
// @access  Public
export const getEvents = async (req, res, next) => {
  try {
    // TODO: Implementar consulta a base de datos
    
    res.json({
      success: true,
      data: {
        events: [],
        total: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener un evento por ID
// @route   GET /api/v1/events/:id
// @access  Public
export const getEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    // TODO: Implementar consulta a base de datos

    res.json({
      success: true,
      data: {
        event: null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener calendario de shows
// @route   GET /api/v1/calendar/shows
// @access  Public
export const getCalendar = async (req, res, next) => {
  try {
    // TODO: Implementar calendario de shows

    res.json({
      success: true,
      data: {
        shows: [],
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getEvents,
  getEvent,
  getCalendar,
};
