const AppError = require('../utils/appError');

const deleteOne = (model) => async (req, res) => {
  const doc = await model.findByIdAndDelete(req.params.id);

  if (!doc) {
    throw new AppError('No document found with that ID', 404);
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

module.exports = {
  deleteOne,
};
