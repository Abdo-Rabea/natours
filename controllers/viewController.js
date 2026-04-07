const getOverview = (req, res) => {
  res.status(200).render('overview', { title: 'All tours overview' });
};

const getTour = (req, res) => {
  res.status(200).render('tour', { title: 'The Forest Hiker' });
};

module.exports = {
  getOverview,
  getTour,
};
