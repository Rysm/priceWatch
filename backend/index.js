//Explicitly bring in packages needed
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const amazon = require('amazon-product-api');
const request = require('request');
const cheerio = require('cheerio');
const crypto = require("crypto-js");
const CronJob = require('cron').CronJob;
const app = express();

// Deals with cross origin access
app.use(cors());
// Deals with getting request in json form
app.use(bodyParser.json());

function getSignatureKey(Crypto, key, dateStamp, regionName, serviceName) {
  var kDate = Crypto.HmacSHA256(dateStamp, "AWS4" + key);
  var kRegion = Crypto.HmacSHA256(regionName, kDate);
  var kService = Crypto.HmacSHA256(serviceName, kRegion);
  var kSigning = Crypto.HmacSHA256("aws4_request", kService);
  return kSigning;
}
var sKey = getSignatureKey(crypto, "D4QGBwcsZYF6h9gI4mutvTfmp7lzm9hoPcGXgKxS", '20120215', 'us-east-1', 'iam');

// Configuration for using Amaon API
var client = amazon.createClient({
  awsId: "AKIAJ7MDWZA3THQRR4CQ",
  awsSecret: "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",
  awsTag: "andyliwang-20"
});
client.itemSearch({
  keywords: 'gummy',
}, function(err, results, response) {
  if(err) {
    console.log(err.Error);
  } else {
    console.log(results);
    console.log(response);
  }
})

// Initial expressJS page grab by client request
app.post('/', (req, res) => {
  const PriceFinder = require('price-finder');
  const priceFinder = new PriceFinder();
  const url = req.body.url;

  priceFinder.findItemPrice(url, function(err, price) {
    console.log("Current price " +   price);
    res.json({'price': price});
  });

  amazonJob.start();
});

// Handles request for item search
app.post('/itemSearch', (req, res) => {
  // request(req.body.url, (err, response, html) => {
  //   if (!err && response.statusCode == 200) {
  //     var $ = cheerio.load(html);
  //     var itemTitle = $('#productTitle').text().trim();
  //     while(itemTitle == "") {
  //       itemTitle = $('#productTitle').text().trim();
  //     }
  //     res.json({'itemTitle': itemTitle});
  //   }
  // })

  client.itemSearch({
    keywords: req.body.key,
  }, function(err, results, response) {
    if(err) {
      console.log(err.Error);
    } else {
      console.log(results);
      console.log(response);
    }
  })
})

const uri = 'http://www.amazon.com/Albanese-Candy-Sugar-Assorted-5-pound/dp/B00DE4GWWY?';

//Schedule an amazon job.
var amazonJob = new CronJob('* 1 * * * * *', function(req, res, uri){

    const PriceFinder = require('price-finder');
    const priceFinder = new PriceFinder();

    priceFinder.findItemPrice(uri, function(err, price) {

        console.log("updated every minute: " + price);

    });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
