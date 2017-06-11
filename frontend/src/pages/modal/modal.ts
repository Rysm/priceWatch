import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import firebase from 'firebase';

@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})

export class Modal {

  public urlForm;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
  ) {
    this.urlForm = formBuilder.group({
        firstURL: ['',],
        secondURL: ['',],
        thirdURL: ['',]
    })
  }

  //processes the dank urls and add them to the firedank
  manualAdd() {

      if (!this.urlForm.valid) {
          console.log(this.urlForm.value);
      }

      else{
          //gets the dank user id
          var user = firebase.auth().currentUser;
          var fireDB = firebase.database();
          var url = "userProfile/" + user.uid;
          //console.log("user id " + user.uid);

          //where to save shit
          var ref = fireDB.ref(url);

          //Attach the urls
          ref.update({
            "products": {
              1: this.urlForm.value.firstURL,
              2: this.urlForm.value.secondURL,
              3: this.urlForm.value.thirdURL,
            }
          });

          firebase.auth().currentUser.getToken(/* forceRefresh */ true).then(function(idToken) {
            // Send token to your backend via HTTPS
            // ...
          }).catch(function(error) {
            // Handle error
          });

      }

    }

  close() {
    this.navCtrl.pop();
  }
}
