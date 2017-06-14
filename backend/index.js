//Explicitly bring in packages needed
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const amazon = require('amazon-product-api');
const CronJobManager = require('cron-job-manager');
const PriceFinder = require('price-finder');
const app = express();
const time = require('time');

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



//CRON JOB MANAGER
var jobManager = new CronJobManager( // this creates a new manager and adds the arguments as a new job.
  'a_key_string_to_call_this_job',
  '0 30 * * * *', // the crontab schedule
  function() { console.log("tick - what should be executed?") },
{
// extra options..
// see https://github.com/ncb000gt/node-cron/blob/master/README.md for all available
  start:true,
  timeZone:"America/Los_Angeles",
  completion: function() {console.log("a_key_string_to_call_this_job has stopped....")}
}
);

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

//Function that updates the server dictionary after certain requests are made
//user, url, price
function updateServe(swag){

  var currTitle = swag.title;
  var currPrice = swag.price;
  var amazonJob

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

      currURL = serverDict[serverDict.length-1].url;

      var okay = "okay" + (allURL-1);

      //start a new cronjob if url does not exist
      jobManager.add(currURL, '0 40 * * * *', function() { console.log('tick...')

                console.log("started a new cronjob at" + currURL);

                const priceFinder = new PriceFinder();

                priceFinder.findItemPrice(currURL, function(err, price) {
                  console.log("updated every minute: " + price);
                  myPrice = price;
                });

      });

      jobManager.start(currURL);


}

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
