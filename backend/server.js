const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint to fetch sheet data using CSV export (works with public sheets)
app.get('/api/sheets/:sheetId/:range', async (req, res) => {
  try {
    const { sheetId, range } = req.params;

    // Use Google Sheets CSV export URL (works for public sheets)
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

    const response = await axios.get(csvUrl);
    const csvData = response.data;

    // Parse CSV data
    const rows = csvData.split('\n').map(row =>
      row.split(',').map(cell => cell.replace(/"/g, '').trim())
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }

    // Convert to JSON format with headers
    const headers = rows[0];
    const data = rows.slice(1).filter(row => row.some(cell => cell)).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });

    res.json({ data, headers });
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    res.status(500).json({
      error: 'Failed to fetch sheet data. Make sure the Google Sheet is public and accessible.'
    });
  }
});

// API endpoint to get sheet metadata (simplified)
app.get('/api/sheets/:sheetId/metadata', async (req, res) => {
  try {
    const { sheetId } = req.params;

    // Return basic metadata for public sheets
    res.json({
      sheets: [{
        title: 'Sheet1',
        sheetId: 0,
        gridProperties: { rowCount: 1000, columnCount: 26 }
      }]
    });
  } catch (error) {
    console.error('Error fetching sheet metadata:', error);
    res.status(500).json({ error: 'Failed to fetch sheet metadata' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Make sure your Google Sheet is set to "Anyone with the link can view"`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
