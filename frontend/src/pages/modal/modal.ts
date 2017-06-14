import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
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
    private toastCtrl: ToastController,
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


    //price threshold stuff
  	priceThreshold: any = [1, 5, 10, 25, 50, 100];

     showPrompt() {
      let prompt = this.alertCtrl.create({
        title: 'Custom Price',
        message: "Enter a Threshold for your price:",
        inputs: [
          {
            name: 'customPrice',
            placeholder: 'e.g. 9.37',
  		  type: 'number'
          },
        ],
        buttons: [
          {
            text: 'Confirm',
            handler: data => {
              console.log('Confirm clicked');
  			this.priceThreshold.push(data.customPrice);
  			console.log(data.customPrice);

  		  }
          }
        ]
      });
      prompt.present();
    }

  // On keyword search
  onSearch() {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    var reqBody = {
      url: this.searchUrl,
      key: this.searchKey
    }

    this.http.post(this.localAPI+'itemSearch', reqBody, {headers: headers}).map(res => res.json()).subscribe(data => {
      console.log(data);
      this.searchResults = data.results;
    })
  }

  // On add item from search results
  addItem(item) {
    console.log(item);
    var user = firebase.auth().currentUser;
    var itemUrl = item.DetailPageURL;
    var itemPrice = item.ItemAttributes[0].ListPrice[0].FormattedPrice;
    var itemTitle = item.ItemAttributes[0].Title;

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    var reqBody = {
      user: user,
      url: itemUrl,
      title: itemTitle,
      price: itemPrice
    }

    this.http.post(this.localAPI+'addItem', reqBody, {headers: headers}).map(res => res.json()).subscribe(data => {
      if(data.success) {
        let toast = this.toastCtrl.create({
          message: 'Item added successfully',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.close();
      } else {
        let toast = this.toastCtrl.create({
          message: 'Failed to add item',
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    })
  }
}
