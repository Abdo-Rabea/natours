const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  const session = await Stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking-success`,
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
            images: [
              `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`,
            ],
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
// const createBooking = catchAsync(async (req, res, next) => {
//   const { tour, user, price } = req.query;
//   if (!tour || !user || !price) return next();

//   await Booking.create({ tour, user, price });
//   res.redirect(req.originalUrl.split('?')[0]); // this will call the same url without query parameter so it will go to the next middleware because of the gaurding early return ;)
// });

async function createBookingCheckout(tour, email, price) {
  // create a new booking in the database
  // we can use the user email to find the user id in the database and then create the booking with the tour id, user id, and price
  const user = await User.findOne({ email });
  if (!user) {
    return;
  }

  await Booking.create({ tour, user: user._id, price });
}

const webhookCheckout = (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  const stripeWebhookSecret =
    process.env.NODE_ENV === 'development'
      ? process.env.STRIPE_WEBHOOK_SECRET_CLI
      : process.env.STRIPE_WEBHOOK_SECRET;

  try {
    // Verify event with webhook secret using the raw request body.
    event = Stripe.webhooks.constructEvent(req.body, sig, stripeWebhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const tour = session.client_reference_id;
    const userEmail = session.customer_email;
    const price = session.amount_total / 100;

    createBookingCheckout(tour, userEmail, price);

    res.status(200).json({ received: true });
  }
};

const createBookingApi = factory.createOne(Booking);
const getAllBookings = factory.getAll(Booking);
const getBooking = factory.getOne(Booking);
const updateBooking = factory.updateOne(Booking);
const deleteBooking = factory.deleteOne(Booking);

module.exports = {
  getCheckoutSession,
  createBookingApi,
  getAllBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  webhookCheckout,
};
