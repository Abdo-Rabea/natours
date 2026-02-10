const fs = require('fs');

const TOURS_FILE = `${__dirname}/../dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(TOURS_FILE, 'utf-8'));

// 2. route handlers
const getAllTours = (req, res) => {
  res.status(200).json({
    // it is Jsend specification which is a standard for structuring JSON responses in APIs. it has three main properties: status, data, and message. status is a string that indicates the status of the response, it can be 'success', 'fail', or 'error'. data is an object that contains the actual data being returned in the response. message is a string that provides additional information about the response, it is usually used in case of errors to provide more details about what went wrong.
    status: 'success',
    requestTime: req.requestTime,
    results: tours.length, // not part of Jsend specification but it is a common practice to include the number of results in the response when returning a list of items. Johnas opinion
    data: {
      tours,
    },
  });
};

const createTour = (req, res) => {
  // create new tour
  const id = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id }, req.body);
  tours.push(newTour);
  // write new tour to file
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        res.status(500).json({
          status: 'error',
          message: 'Failed to save the new tour',
        });
      } else {
        res.status(201).json({
          status: 'success',
          data: {
            tour: newTour,
          },
        });
      }
    },
  );
};

const getTour = (req, res) => {
  // console.log(req.params);
  const id = Number(req.params.id);
  const tour = tours.find((tour) => tour.id === id);

  if (tour === undefined) {
    res.status(404).json({
      status: 'fail',
      message: 'tour not found',
    });
  } else {
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  }
};

const updateTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((tour) => tour.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }
  // update the tour
  // the next line will update tours[id] object
  Object.assign(tour, req.body);
  console.log(tour);
  // write the updated tour to file
  fs.writeFile(TOURS_FILE, JSON.stringify(tours), (err) => {
    if (err) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to update the tour',
      });
    } else {
      res.status(200).json({
        status: 'success',
        data: {
          tour,
        },
      });
    }
  });
};

const deleteTour = (req, res) => {
  const id = Number(req.params.id);
  const tourIndex = tours.findIndex((tour) => tour.id === id);
  if (tourIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  } else {
    tours.splice(tourIndex, 1);
    fs.writeFile(TOURS_FILE, JSON.stringify(tours), (err) => {
      if (err) {
        res.status(500).json({
          status: 'error',
          message: 'Failed to delete the tour',
        });
      } else {
        res.status(204).json({
          // 204 status code means no content, it is used when the server successfully processed the request but is not returning any content. it is commonly used in delete requests to indicate that the resource has been successfully deleted and there is no content to return in the response.
          status: 'success',
          data: null,
        });
      }
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
