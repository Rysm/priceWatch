import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import firebase from 'firebase';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})

export class Modal {

  // Our server hosted on Google
  serverAPI: any = 'http://lithe-climber-167308.appspot.com/';
  // Local server for development
  localAPI: any = 'http://localhost:8080/';
  // Url to be searched
  searchUrl: any = '';
  // Keyword to be searched
  searchKey: any = '';
  // List returned in response of item search
  searchResults: any;

  public urlForm;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private alertCtrl: AlertController,
    public formBuilder: FormBuilder
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

  onSearch() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let reqBody = {
      url: this.searchUrl,
      key: this.searchKey
    }

    this.http.post(this.localAPI+'itemSearch', reqBody, {headers: headers}).map(res => res.json()).subscribe(data => {
      console.log(data);
      this.searchResults = data.results;
    })
  }
}
