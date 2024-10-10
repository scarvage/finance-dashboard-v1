const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Yahoo Finance API route
app.get('/api/stock/:ticker', async (req, res) => {
  const { ticker } = req.params;

  try {
    // Fetch stock data from Yahoo Finance API
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=7d&interval=1d`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
