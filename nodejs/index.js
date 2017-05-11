const PriceFinder = require('price-finder');
const priceFinder = new PriceFinder();

// Atoms for Peace : Amok  (from Amazon)
const uri = 'http://www.amazon.com/Albanese-Candy-Sugar-Assorted-5-pound/dp/B00DE4GWWY?';
priceFinder.findItemPrice(uri, function(err, price) {
    console.log(price); // 8.91
});
