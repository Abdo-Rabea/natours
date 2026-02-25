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
    // BUILD THE QUERY
    // 1A. filtering
    const queryFilterObject = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryFilterObject[el]);

    // 1B. advanced filtering
    let queryStr = JSON.stringify(queryFilterObject);
    queryStr = queryStr.replace(/\b(gte?|lte?)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // 2. sorting
    const sortBy = req.query.sort?.replaceAll(',', ' ');
    if (sortBy) {
      query = query.sort(sortBy); // sort('-price ratingsAverage'); then you have sorting out of the box
    } else {
      query = query.sort('_id');
    }

    // 3. field limiting (projection)
    const fields = req.query.fields?.replaceAll(',', ' ');
    if (fields) {
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 4. pagination
    const page = Number(req.query.page) || 1; // if page = 0 then 1 return so no error as skip must be >= 0j
    const limit = Number(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    // if page exist which is always the case
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }
    query = query.skip(skip).limit(limit);

    // EXECUTE THE QUERY
    const tours = await query;

    // SEND RESPONSE
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
      message: err.message,
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

// function to delete tour by name (controller)
const deleteTourByName = async (req, res) => {
  try {
    await Tour.findOneAndDelete({ name: req.params.name });
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
