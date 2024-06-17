const express = require('express');
const mysql = require('mysql');
const axios = require('axios');
const app = express();
const port = 3000;

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'fxratedb'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Endpoint to fetch exchange rates and store them in the database
app.get('/fetch-rates', async (req, res) => {
  try {
    const response = await axios.get('https://fcsapi.com/api-v3/forex/latest?id=1&access_key=K9izZeK9cwB2rKS86EalHszK');
    const rates = response.data.response;

    // Store rates in the database
    const query = 'REPLACE INTO fx_rates (currency, rate, date) VALUES ?';
    const values = rates.map(rate => [rate.currency, rate.rate, new Date()]);

    db.query(query, [values], (err, result) => {
      if (err) throw err;
      res.send('Exchange rates updated');
    });
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    res.status(500).send('Error fetching exchange rates');
  }
});

// Endpoint to get the exchange rate for a specific date and currency pair
app.get('/rate', (req, res) => {
  const { date, from, to } = req.query;
  const query = 'SELECT rate FROM fx_rates WHERE currency = ? AND date = ?';

  db.query(query, [`${from}/${to}`, date], (err, result) => {
    if (err) {
      console.error('Error querying the database:', err);
      res.status(500).send('Error querying the database');
      return;
    }
    if (result.length > 0) {
      res.json({ rate: result[0].rate });
    } else {
      res.status(404).send('Rate not found');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
