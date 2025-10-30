export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found.`,
    availableRoutes: {
      health: '/health',
      api: `/api/${process.env.API_VERSION || 'v1'}`,
    },
  });
};

export default notFound;
