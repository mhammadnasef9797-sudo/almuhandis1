const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// API Endpoint for submitting orders
app.post('/submit-order', (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).send('Name, email, and phone are required fields.');
  }

  const query = `INSERT INTO orders (name, email, phone, message) VALUES (?, ?, ?, ?)`;
  const params = [name, email, phone, message];

  db.run(query, params, function (err) {
    if (err) {
      console.error('Error inserting order:', err.message);
      return res.status(500).send('Failed to submit order.');
    }

    res.status(200).send({ orderId: this.lastID, message: 'Order submitted successfully!' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
