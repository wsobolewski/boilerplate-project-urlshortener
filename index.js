require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const validator = require('validator');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));

let urlDataStore = {}; // In-memory data store for URL mappings
let count = 1; // Counter for generating unique short URLs

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;

  if (!validator.isURL(url)) {
    return res.json({ error: 'invalid url' });
  }

  // Check if the URL already exists in the data store
  for (const key in urlDataStore) {
    if (urlDataStore[key] === url) {
      return res.json({ original_url: url, short_url: parseInt(key) });
    }
  }

  // Create a new shortened URL entry
  urlDataStore[count] = url;
  const shortUrl = count;

  count++; // Increment the counter for the next short URL

  res.json({ original_url: url, short_url: shortUrl });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
