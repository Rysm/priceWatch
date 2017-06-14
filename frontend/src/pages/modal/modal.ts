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
  // Flag to render search results if found and error message otherwise
  foundSearchResults: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public formBuilder: FormBuilder
  ) { }

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
      if(data.success) {
        this.foundSearchResults = true;
        this.searchResults = data.results;
      } else {
        this.foundSearchResults = false;
      }
    })
  }

  // On add item from search results
  addItem(item) {
    var user = firebase.auth().currentUser;
    var ref = firebase.database().ref('userProfile/'+user.uid+'/products');
    var itemUrl = item.DetailPageURL;
    var itemPrice = item.ItemAttributes[0].ListPrice[0].FormattedPrice;
    var itemTitle = item.ItemAttributes[0].Title;
    var itemImage = item.LargeImage[0].URL;

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    var reqBody = {
      user: user.uid,
      url: itemUrl,
      title: itemTitle,
      price: itemPrice,
      image: itemImage
    }

    this.http.post(this.localAPI+'addItem', reqBody, {headers: headers}).map(res => res.json()).subscribe(data => {
      if(data.success) {
        ref.push(JSON.stringify(reqBody));
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

  // Close modal
  close() {
    this.navCtrl.pop();
  }
}
