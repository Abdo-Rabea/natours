const express = require('express');

const app = express();

console.log(app);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.get('/', (req, res) => {
  // res.status(200).send('hello from the server');
  // console.log(req);
  res.status(200).json({ message: 'hello from the server', app: 'Natours' });
});

app.post('/', (req, res) => {
  res.send('You can post to this endpoint...');
});

app.all('/test', (req, res) => {
  res.send('This endpoint accepts all HTTP methods');
});

// commit message
// feat: setup basic express server with routes
