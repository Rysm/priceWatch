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

//Server's own Dictionary
var serverDict = [];
//URL JOBS
var allURL = [];
//
var currURL;

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
app.post('/addItem', (req, res)=>{

    var result;

    var string = "";

    result = req.body;

    console.log("result : " + result.title);

    updateServe(result);

    res.json({"success":true});
})

//Schedule an amazon job.
var amazonJob = new CronJob('* 1 * * * * *', function(req, res, uri) {

  console.log("started a new cronjob at" + currURL);

  const priceFinder = new PriceFinder();

  priceFinder.findItemPrice(currURL, function(err, price) {
    console.log("updated every minute: " + price);
    myPrice = price;
  });
});


//Function that updates the server dictionary after certain requests are made
//user, url, price
function updateServe(swag){

  var currTitle = swag.title;
  var currPrice = swag.price;

  //if (!(serverDict.includes(currTitle) )){

    console.log("Does not exist in our dictionary yet");

    //build it
    var addObj = {
        title: swag.title,
        price: swag.price,
        users: swag.user,
        url: swag.url,
      };

      //add the title to the first layer
      serverDict.push( addObj );

      allURL.push(serverDict[0].url);

      currURL = serverDict[0].url;

      //start a new cronjob if url does not exist

      amazonJob.start();

//  }

//  else{
    //idk lmao
//  }
}

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
