angular.module('firebaseConfig', ['firebase'])

.run(function(){

  // Initialize Firebase
  var config = {
      apiKey: "AIzaSyDVQgtdE8ArBCiB4kubfGZflY1kegpzZVY",
      authDomain: "pricewatch-36aeb.firebaseapp.com",
      databaseURL: "https://pricewatch-36aeb.firebaseio.com",
      projectId: "pricewatch-36aeb",
      storageBucket: "pricewatch-36aeb.appspot.com",
      messagingSenderId: "900764580669"
  };
  firebase.initializeApp(config);

})
