require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('./database');
const bodyParser = require('body-parser');
const { Resolver } = require('dns/promises');
const resolver = new Resolver();
const app = express();
const URL = require('./models/url');
const urlRegex = new RegExp(/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm)
const dns = require('node:dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async (req, res) => {
  const urlParameter = req.body.url;
  if (!urlParameter.match(urlRegex)) return res.json({error: 'Invalid URL'});
  
  try {
    //await dns.promises.resolve(urlParameter.replace(/^https?:\/\//, ''));
    let urlInstance = await URL.findOne({
      original_url : urlParameter
    });

    if (urlInstance) {
      res.json({
        original_url : urlInstance.original_url,
        short_url : urlInstance.id
      });
    }

    else {
      urlInstance = new URL({
        original_url : urlParameter
      });
      await urlInstance.save();
      res.json({
        original_url : urlInstance.original_url,
        short_url : urlInstance.id
      });
    }

  }

  catch(error) {
    console.log(error);
    res.json(error);
  }
  
});

app.get('/api/shorturl/:urlId', async function(req, res) {
  
  let urlId = req.params.urlId;

  try {
    let urlInstance = await URL.findOne({
      id : urlId
    });
    res.redirect(urlInstance.original_url);
  }

  catch (err) {
    res.json({'error' :	'No short URL found for the given input'});
  }

});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

