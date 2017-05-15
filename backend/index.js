const express = require('express');

const app = express();

app.get('/', (req, res) => {


  const PriceFinder = require('price-finder');
  const priceFinder = new PriceFinder();

  // Atoms for Peace : Amok  (from Amazon)
  const uri = 'http://www.amazon.com/Albanese-Candy-Sugar-Assorted-5-pound/dp/B00DE4GWWY?';
  priceFinder.findItemPrice(uri, function(err, price) {
      console.log(price);
      res.status(200).send("Price Of Gummies: " + price).end();
  });

});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
