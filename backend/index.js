//Explicitly bring in packages needed
const express = require('express');
const app = express();

//Allows for timed jobs by schedule - even date/time
var CronJob = require('cron').CronJob;

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
