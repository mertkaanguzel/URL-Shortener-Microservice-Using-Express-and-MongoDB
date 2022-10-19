require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
require('node:dns/promises')
const bodyParser = require('body-parser');
const { Resolver } = require('dns/promises');
const resolver = new Resolver();
const app = express();


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
/*
app.post('/api/shorturl', (req, res) => {
  res.json({original_url : req.body.url,
    short_url : dns.lookup(req.body.url)});
})

app.post('/api/shorturl', (req, res, next) => {
  dns.lookup(req.body.url, (err, address) => {
    if (err) res.json({error: 'Invalid URL'});
    console.log(address);
  })
  next();
}, (req, res) => {
  res.json({original_url : req.body.url,
    short_url : '1'});
});

*/
app.post('/api/shorturl', async (req, res) => {

  try {
    await resolver.resolve4(req.body.url);
    
    res.json({original_url : req.body.url,
      short_url : '1'});

  }
  catch(error) {
    console.log(error);
    res.json({error: 'Invalid URL'});
  }
  
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
