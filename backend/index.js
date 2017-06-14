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

/*
Structure:

serverDict = {
  urls: a: {user1.id, user2.id},
        b: {user1.id, user2.id},
        c: {user1.id, user2.id},
}
*/
//Server's own Dictionary
var serverDict = {};
//Empty array to place into dictionary
serverDict['urls'] = []; //reference serverDict[key] to push to it

console.log(serverDict);


var client = amazon.createClient({
  awsId: "AKIAIVR5HQAG2XVERBOQ",
  awsSecret: "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",
  awsTag: "katakeda-20"
});

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

//Handles post request from add item
app.post('/addItem', (req, res)){
  client.addItem({
    res.json({'u fookin wot': 'it worker'});
  })
}

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
