//Explicitly bring in packages needed
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const amazon = require('amazon-product-api');
const CronJob = require('cron').CronJob;
const PriceFinder = require('price-finder');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
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

//Function that updates the server dictionary after certain requests are made
//user, url, price
function updateServe(swag){

  var currTitle = swag.title;
  var currPrice = swag.price;
  var currName;

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

      allURL.push(serverDict[swag.url]);

      currURL = serverDict[serverDict.length-1].url;

      currName = currURL.toString();

      //start a new cronjob if url does not exi
      currName = new CronJob('0 1 * * * * *', function() {

        console.log('You will see this message every second');
        const priceFinder = new PriceFinder();

        priceFinder.findItemPrice(currURL, function(err, price) {

          console.log("Current price " +   currPrice);

          var message = "The current price: " + currPrice;

          var json = JSON.stringify({
            "send_to_all": true,
            "profile": "pricewatchshit",
            "notification": {
                "message": message,
            }
          });

          sendPush(json);

        });

      }, null, true, 'America/Los_Angeles');
}
// Code for testing push via a POST request

var sendPush = function(json) {
  // Make POST request to all users
  console.log("Processing the push...");

  var http = new XMLHttpRequest();
  var url = "https://api.ionic.io/push/notifications";

  console.log(json);

  http.open("POST", url, true);
  //Send the proper header information along with the request
  http.setRequestHeader("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMGM4OWJjYS0wZDk0LTRkM2EtYjlhNC0yM2Y0MzdhMDYxYzYifQ.n5rvKyQF2r-TchepavQ4togu31DMoDTxciKOrHm7W-M");
  http.setRequestHeader("Content-Type", "application/json");

  http.onreadystatechange = function() { //Call a function when the state changes.
      if(http.readyState == 4 && http.status == 201) {
          console.log(http.responseText);
      }
  };
  http.send(json);
};

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
