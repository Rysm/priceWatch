var http = require('http');

var crypto = require("crypto-js");

function getSignatureKey(Crypto, key, dateStamp, regionName, serviceName) {
    var kDate = Crypto.HmacSHA256(dateStamp, "AWS4" + key);
    var kRegion = Crypto.HmacSHA256(regionName, kDate);
    var kService = Crypto.HmacSHA256(serviceName, kRegion);
    var kSigning = Crypto.HmacSHA256("aws4_request", kService);
    return kSigning;
}

function getProduct(callback) {

    http.get({
      http://webservices.amazon.com/onca/xml?
      Service=AWSECommerceService
      &Operation=ItemSearch
      &ResponseGroup=Small
      &SearchIndex=All
      &Keywords=harry_potter
      &AWSAccessKeyId=AKIAJ7MDWZA3THQRR4CQ
      &AssociateTag=andyliwang-20
      &Timestamp=Date.now = function() { return new Date().getTime(); }
      &Signature=getSignatureKey(AKIAJ7MDWZA3THQRR4CQ,Date.now = function() { return new Date().getTime(); }, us-west-2, )
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {

            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);
            callback({
                console.log(parsed);
            });
        });
    });

},
