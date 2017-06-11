//Explicitly bring in packages needed
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const amazon = require('amazon-product-api');
const CronJob = require('cron').CronJob;
const PriceFinder = require('price-finder');
const app = express();

// Deals with cross origin access
app.use(cors());
// Deals with getting request in json form
app.use(bodyParser.json());

// Initial expressJS page grab by client request
app.post('/', (req, res) => {
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
  client.itemSearch({
    keywords: req.body.key,
    responseGroup: 'ItemAttributes,Offers,Images'
  }, function(err, results, response) {
    if(err) {
      console.log(err.Error);
    } else {
      res.json({'results': results});
    }
  })
})

const uri = 'http://www.amazon.com/Albanese-Candy-Sugar-Assorted-5-pound/dp/B00DE4GWWY?';

//Schedule an amazon job.
var amazonJob = new CronJob('* * 1 * * * *', function(req, res, uri) {
  const priceFinder = new PriceFinder();
  priceFinder.findItemPrice(uri, function(err, price) {
    console.log("updated every minute: " + price);
    myPrice = price;
  });
});


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
