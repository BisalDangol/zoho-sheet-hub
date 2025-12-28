const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint to get sheet metadata
app.get('/api/sheets/:sheetId/metadata', async (req, res) => {
  try {
    const { sheetId } = req.params;

    // Use Google Sheets API v4 to get spreadsheet metadata (works with public sheets)
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?fields=sheets.properties`;

    const response = await axios.get(apiUrl);
    const sheets = response.data.sheets.map(sheet => ({
      title: sheet.properties.title,
      sheetId: sheet.properties.sheetId,
      gridProperties: sheet.properties.gridProperties
    }));

    res.json({ sheets });
  } catch (error) {
    console.error('Error fetching sheet metadata:', error);
    // Fallback to basic metadata if API fails - include common sheet names
    res.json({
      sheets: [
        {
          title: 'Sheet1',
          sheetId: 0,
          gridProperties: { rowCount: 1000, columnCount: 26 }
        },
        {
          title: 'Sheet2',
          sheetId: 1,
          gridProperties: { rowCount: 1000, columnCount: 26 }
        }
      ]
    });
  }
});

// API endpoint to fetch sheet data using CSV export (works with public sheets)
app.get('/api/sheets/:sheetId/:range', async (req, res) => {
  try {
    const { sheetId, range } = req.params;

    // Parse the range to extract sheet name and range (e.g., "Sheet2!A:Z" -> sheetName: "Sheet2", range: "A:Z")
    const [sheetName, dataRange] = range.split('!');

    // First get metadata to find the sheet ID for the sheet name
    const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?fields=sheets.properties`;
    const metadataResponse = await axios.get(metadataUrl);
    const targetSheet = metadataResponse.data.sheets.find(sheet => sheet.properties.title === sheetName);

    if (!targetSheet) {
      return res.status(404).json({ error: `Sheet "${sheetName}" not found` });
    }

    // Use Google Sheets CSV export URL with specific sheet ID (gid parameter)
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${targetSheet.properties.sheetId}`;

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Make sure your Google Sheet is set to "Anyone with the link can view"`);
});
