/* eslint-disable */

import axios from 'axios';
const stripe = Stripe(
  'pk_test_51TOLsAPYRloiJBu2h6lf6XqdVkwPq6EtxTy3Ntj9sGYsHrCaYiM0fYMnkhDudB2B0bazLeDWCmnumnZcdYLw0B49000psXIXpi',
);
// todo: get book session using axios
// use stripe client side sdk to redirect to checkout page (needs the session)
const bookTour = async (tourId) => {
  try {
    const axiosRes = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`,
    );

    const session = axiosRes.data.session;
    window.location.href = session.url;
  } catch (err) {
    console.error(err);
  }
};

export { bookTour };
