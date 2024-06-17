const mysql = require('mysql');
const axios = require('axios');

// MySQL connection setup
const db = mysql.createConnection({
  host: 'your-database-host',
  user: 'your-database-user',
  password: 'your-database-password',
  database: 'your-database-name'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

const fetchAndStoreRates = async () => {
  try {
    const response = await axios.get('https://fcsapi.com/api-v3/forex/latest?id=1&access_key=K9izZeK9cwB2rKS86EalHszK');
    const rates = response.data.response;

    // Store rates in the database
    const query = 'REPLACE INTO fx_rates (currency, rate, date) VALUES ?';
    const values = rates.map(rate => [`${rate.base}/${rate.counter}`, rate.rate, new Date()]);

    db.query(query, [values], (err, result) => {
      if (err) throw err;
      console.log('Exchange rates updated');
    });
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
  }
};

// Call the function to fetch and store rates
fetchAndStoreRates();

// Close the database connection when done
db.end();
