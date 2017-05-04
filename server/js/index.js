//Import the Amazon API
var amazon = require('amazon-product-api');

var client = amazon.createClient({
  awsId: "573161980609",
  awsSecret: "Ro9qRkFpWm7bCb2WPHj8uyW9mwruQsJUXsmo8E8h",
  awsTag: "aws Tag"
});

// content of index.js
const http = require('http')
const port = 3000

const requestHandler = (request, response) => {
  console.log(request.url)
  response.end('Hello Node.js Server!')
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

//Client callback test
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
