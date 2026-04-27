const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  const session = await Stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.description,
            images: [`https://natours.dev/img/tours/${tour.imageCover}`],
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
  });

  res.status(200).json({
    status: 'success',
    session,
  });
});

// this is only temporary because it's not secure, everyone can make bookings without paying, only for testing purposes
// gets the tour, user, price for the query
const createBooking = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;
  if (!tour || !user || !price) return next();

  await Booking.create({ tour, user, price });
  res.redirect(req.originalUrl.split('?')[0]); // this will call the same url without query parameter so it will go to the next middleware because of the gaurding early return ;)
});

const getBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find();
  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings,
    },
  });
});

module.exports = {
  getCheckoutSession,
  createBooking,
  getBookings,
};
