// @desc    Obtener últimas noticias
// @route   GET /api/v1/news
// @access  Public
export const getNews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // TODO: Implementar consulta a base de datos

    res.json({
      success: true,
      data: {
        news: [],
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

// @desc    Obtener noticia por ID
// @route   GET /api/v1/news/:id
// @access  Public
export const getNewsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // TODO: Implementar consulta a base de datos

    res.json({
      success: true,
      data: {
        news: null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener noticias locales con IA
// @route   GET /api/v1/news/local
// @access  Public
export const getLocalNews = async (req, res, next) => {
  try {
    const { city, country } = req.query;

    // TODO: Implementar noticias locales con IA

    res.json({
      success: true,
      data: {
        local_news: [],
        location: {
          city,
          country,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getNews,
  getNewsById,
  getLocalNews,
};
