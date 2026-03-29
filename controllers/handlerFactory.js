const APIFeatures = require('../utils/apiFeature');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const updateOne = (model) =>
  catchAsync(async (req, res, next) => {
    const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (doc === null) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

const deleteOne = (model) =>
  catchAsync(async (req, res, next) => {
    const doc = await model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

const createOne = (model) =>
  catchAsync(async (req, res, next) => {
    const doc = await model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

const getOne = (model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (doc === null) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

const getAll = (model) =>
  catchAsync(async (req, res, next) => {
    // not that prefect but it works: needed for get all reviews to work for nested route GET /api/v1/tours/:tourId/reviews
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    // all of the information required in filter, sort, limitFields, and paginate is in the req.query object.
    const apiFeatures = new APIFeatures(model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await apiFeatures.query;

    // SEND RESPONSE
    res.status(200).json({
      // it is Jsend specification which is a standard for structuring JSON responses in APIs. it has three main properties: status, data, and message. status is a string that indicates the status of the response, it can be 'success', 'fail', or 'error'. data is an object that contains the actual data being returned in the response. message is a string that provides additional information about the response, it is usually used in case of errors to provide more details about what went wrong.
      status: 'success',
      requestTime: req.requestTime,
      results: docs.length, // not part of Jsend specification but it is a common practice to include the number of results in the response when returning a list of items. Johnas opinion
      data: {
        data: docs,
      },
    });
  });
module.exports = {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
};
