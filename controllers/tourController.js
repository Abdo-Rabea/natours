const Tour = require('../models/tourModel');

// mongoo will hanlde id check for us
// const checkID = (req, res, next, val) => {
//   const tourIndex = tours.findIndex((tour) => tour.id === Number(val));

//   if (tourIndex === -1) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'tour not found',
//     });
//   }

//   // i found tour
//   req.tourIndex = tourIndex; // <-- from me
//   next();
// };

// this check is done with our mongoose chema validation
// const checkBody = (req, res, next) => {
//   if (!req.body || !req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };

// 2. route handlers
const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();

    res.status(200).json({
      // it is Jsend specification which is a standard for structuring JSON responses in APIs. it has three main properties: status, data, and message. status is a string that indicates the status of the response, it can be 'success', 'fail', or 'error'. data is an object that contains the actual data being returned in the response. message is a string that provides additional information about the response, it is usually used in case of errors to provide more details about what went wrong.
      status: 'success',
      requestTime: req.requestTime,
      results: tours.length, // not part of Jsend specification but it is a common practice to include the number of results in the response when returning a list of items. Johnas opinion
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

const createTour = async (req, res) => {
  const newTour = await Tour.create(req.body);
  try {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err,
    });
  }
};

const getTour = async (req, res) => {
  // console.log(req.params);
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'fail',
      message: 'tour not found',
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update the tour',
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete the tour',
    });
  }
};

module.exports = {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
};
