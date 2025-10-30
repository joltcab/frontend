// @desc    Obtener lista de posts del blog
// @route   GET /api/v1/blog/posts
// @access  Public
export const getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // TODO: Implementar consulta a base de datos

    res.json({
      success: true,
      data: {
        posts: [],
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

// @desc    Obtener un post por ID
// @route   GET /api/v1/blog/posts/:id
// @access  Public
export const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    // TODO: Implementar consulta a base de datos

    res.json({
      success: true,
      data: {
        post: null,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getPosts,
  getPost,
};
