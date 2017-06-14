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
  // Initial price threshold
  priceThreshold: any = [1, 5, 10, 25, 50, 100];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public formBuilder: FormBuilder
  ) { }

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

    let alert = this.alertCtrl.create();
    alert.setTitle('Lightsaber color');

    alert.addInput({
      type: 'radio',
      label: '> $1',
      value: '1',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: '> $5',
      value: '5',
    });
    alert.addInput({
      type: 'radio',
      label: '> $10',
      value: '10',
    });
    alert.addInput({
      type: 'radio',
      label: '> $25',
      value: '25',
    });
    alert.addInput({
      type: 'radio',
      label: '> $50',
      value: '50',
    });


    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log(data);
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
    });
    alert.present();
  }

  // Close modal
  close() {
    this.navCtrl.pop();
  }
}
