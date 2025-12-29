const express = require('express');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Supabase admin client (only if needed for other endpoints)
// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint to get sheet metadata
app.get('/api/sheets/:sheetId/metadata', async (req, res) => {
  try {
    const { sheetId } = req.params;

    // Use Google Sheets API v4 to get spreadsheet metadata (works with public sheets)
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?fields=sheets.properties&key=${process.env.GOOGLE_SHEETS_API_KEY}`;

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

// API endpoint to fetch sheet data using Google Sheets API v4
app.get('/api/sheets/:sheetId/:range', async (req, res) => {
  try {
    const { sheetId, range } = req.params;
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;

    console.log('API Key loaded:', apiKey ? 'Yes' : 'No');
    console.log('Sheet ID:', sheetId);
    console.log('Range:', range);

    // Parse the range to extract sheet name and range (e.g., "Sheet1!A:Z" -> sheetName: "Sheet1", range: "A:Z")
    const [sheetName, dataRange] = range.split('!');

    // First get metadata to find the correct sheet name
    const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?fields=sheets.properties&key=${apiKey}`;
    const metadataResponse = await axios.get(metadataUrl);
    const sheets = metadataResponse.data.sheets;

    console.log('Available sheets:', sheets.map(s => s.properties.title));

    // Find the sheet that matches (case-insensitive)
    const targetSheet = sheets.find(sheet =>
      sheet.properties.title.toLowerCase() === sheetName.toLowerCase()
    );

    if (!targetSheet) {
      return res.status(404).json({
        error: `Sheet "${sheetName}" not found. Available sheets: ${sheets.map(s => s.properties.title).join(', ')}`
      });
    }

    const actualSheetName = targetSheet.properties.title;
    console.log('Using sheet name:', actualSheetName);

    // Get all values from the sheet
    const fullSheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(actualSheetName)}?key=${apiKey}`;
    console.log('Full sheet URL:', fullSheetUrl);

    const response = await axios.get(fullSheetUrl);
    const values = response.data.values;

    console.log('Values received:', values ? values.length : 0, 'rows');

    if (!values || values.length === 0) {
      return res.status(404).json({ error: 'No data found in sheet' });
    }

    // Convert to JSON format with headers
    const headers = values[0] || [];
    const data = values.slice(1).filter(row => row && row.some(cell => cell)).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });

    res.json({ data, headers });
  } catch (error) {
    console.error('Error fetching sheet data:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to fetch sheet data. Make sure the Google Sheet is public and the API key is set.'
    });
  }
});

// API endpoint to invite user
app.post('/api/users/invite', async (req, res) => {
  try {
    const { email, full_name, role } = req.body;

    if (!email || !full_name || !role) {
      return res.status(400).json({ error: 'Email, full_name, and role are required' });
    }

    // Generate a temporary user ID for the invitation
    const tempUserId = crypto.randomUUID();

    // Store invitation data in a temporary table or just return success
    // In a real app, you'd want to store this in a database table
    const invitationData = {
      id: tempUserId,
      email,
      full_name,
      role,
      invited_at: new Date().toISOString(),
      status: 'pending'
    };

    console.log('User invitation created:', invitationData);

    // For now, we'll just return success and the user can sign up manually
    // In production, you'd send an email with a signup link
    res.json({
      message: 'Invitation created successfully. User will need to sign up manually.',
      invitation: invitationData
    });
  } catch (error) {
    console.error('Error creating invitation:', error);
    res.status(500).json({ error: 'Failed to create invitation' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Make sure your Google Sheet is set to "Anyone with the link can view"`);
});
