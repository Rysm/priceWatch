angular.module('app.controllers', [])
  
.controller('welcomeCtrl', ['$scope', '$rootScope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $rootScope, $stateParams) {
    
    //Sign up
    $scope.signUp = function (email, password) {
        
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            
            //Handle the errors
            if (errorCode == 'auth/invalid-email'){
                alert("That's not a valid email. Ex: cupoftea@gmail.com");
            }
            else if (errorCode == 'auth/account-exists-with-different-credential'){
                alert("This email is already registered. Please sign in.");
            }
            else if(errorCode == 'auth/weak-password'){
                alert("Your password isn't strong enough.");
            }
        });
    };
    
    $scope.signIn = function (email, password) { 
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            
            // Handle Errors here.
            var errorCode = error.code;
            
            var errorMessage = error.message;
            // Handle the errors
            if (errorCode == 'auth/invalid-email'){
                alert("This email is either invalid or no account exists under the email.");
            }
            else if ( errorCode == 'auth/wrong-password'){
                alert('Your password is incorrect');
            }
            else{
                //if there successfully login
                //$state.go("SetupProfile");
            }
        });
        
        //Successfully logged in
    };
}])
   
.controller('setupProfileCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {
    
    // Get a reference to the storage service, which is used to create references in your storage bucket
    var storage = firebase.storage();
    
    // Create a storage reference from our storage service
    var storageRef = storage.ref();
    
    $scope.uploadPic = function(){
        var ref = firebase.storage().ref();
    };
    
    $scope.handleFileSelect = function(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      var file = evt.target.files[0];

      var metadata = {
        'contentType': file.type
      };

      // Push to child path.
      // [START oncomplete]
      storageRef.child('images/' + file.name).put(file, metadata).then(function(snapshot) {
        console.log('Uploaded', snapshot.totalBytes, 'bytes.');
        console.log(snapshot.metadata);
        var url = snapshot.downloadURL;
        console.log('File available at', url);
        // [START_EXCLUDE]
        document.getElementById('linkbox').innerHTML = '<a href="' +  url + '">Click For File</a>';
        // [END_EXCLUDE]
      }).catch(function(error) {
        // [START onfailure]
        console.error('Upload failed:', error);
        // [END onfailure]
      });
      // [END oncomplete]
    }

    /*
    //Get the signed in user
    firebase.auth().onAuthStateChanged(function(user) {
        
        if (user) {
            // User is signed in.
            var name, email, photoUrl, uid, emailVerified
            
            name = user.name;
            
            
        } else {
            // No user is signed in.
        }
    });
    */
    
    
}])
 