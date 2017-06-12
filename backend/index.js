//Explicitly bring in packages needed
const express = require('express');
const app = express();
const amazon = require('amazon-affiliate-api');

//Allows for timed jobs by schedule - even date/time
var CronJob = require('cron').CronJob;

var client = amazon.createClient({
  awsId: "AKIAIE5I25ZJQM2PTJHQ",
  awsSecret: "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",
  awsTag: "andyliwang-20"
});

//Initial expressJS page grab by client request
app.get('/', (req, res) => {

        const PriceFinder = require('price-finder');
        const priceFinder = new PriceFinder();
        const uri = 'http://www.amazon.com/Albanese-Candy-Sugar-Assorted-5-pound/dp/B00DE4GWWY?';

        priceFinder.findItemPrice(uri, function(err, price) {
            console.log("Current price " +   price);
            res.status(200).send("Price Of Gummies: " + price)//.end();
        });

        amazonJob.start();
});

//please
client.itemSearch({
  director: 'Quentin Tarantino',
  actor: 'Samuel L. Jackson',
  searchIndex: 'DVD',
  audienceRating: 'R',
  responseGroup: 'ItemAttributes,Offers,Images'
}).then(function(results){
  console.log(results);
}).catch(function(err){
  console.log(err);
});

//ok
const uri = 'http://www.amazon.com/Albanese-Candy-Sugar-Assorted-5-pound/dp/B00DE4GWWY?';
const PriceFinder = require('price-finder');
const priceFinder = new PriceFinder();

//Schedule an amazon job.
var amazonJob = new CronJob('* * 1 * * * *', function(req, res, uri){
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
