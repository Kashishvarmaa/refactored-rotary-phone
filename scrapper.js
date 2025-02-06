const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Initialize Express app
const app = express();
const port = 3000;

// Use body parser middleware
app.use(bodyParser.json());

// Scrape data from a webpage using Puppeteer
async function scrapeData() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://x.com/*', { waitUntil: 'domcontentloaded' });

  // Scrape the posts data (modify selectors to match actual data)
  const data = await page.evaluate(() => {
    const posts = [];
    document.querySelectorAll('.post-class').forEach(post => {
      const content = post.querySelector('.content-class')?.innerText;
      const timestamp = post.querySelector('.timestamp-class')?.innerText;
      
      if (content && timestamp) {
        posts.push({ content, timestamp });
      }
    });
    return posts;
  });

  await browser.close();
  return data;
}

// Convert scraped data to CSV format
function convertToCSV(data) {
  const rows = [];
  const headers = Object.keys(data[0]);
  rows.push(headers.join(','));  // Add headers
  
  // Add each data row
  data.forEach(item => {
    rows.push(Object.values(item).join(','));
  });

  return rows.join('\n');
}

// Fetch route to scrape data and return it
app.get('/fetch', async (req, res) => {
  try {
    const data = await scrapeData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error scraping data' });
  }
});

// Append CSV data to a file
app.post('/append-csv', (req, res) => {
  const csvData = req.body.csvData;
  const filePath = path.join(__dirname, 'data.csv');

  // Check if file exists
  if (fs.existsSync(filePath)) {
    fs.appendFile(filePath, csvData + '\n', (err) => {
      if (err) return res.status(500).json({ message: 'Error appending data to CSV' });
      res.status(200).json({ message: 'Data appended to CSV' });
    });
  } else {
    fs.writeFile(filePath, csvData + '\n', (err) => {
      if (err) return res.status(500).json({ message: 'Error creating CSV file' });
      res.status(200).json({ message: 'CSV file created and data written' });
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});