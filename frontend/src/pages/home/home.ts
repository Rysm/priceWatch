import { Component } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';

import { AuthData } from '../../providers/auth-data';
import { Login } from '../login/login';
import { Modal } from '../modal/modal';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  wishList: any;
  posts: any;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public authData: AuthData,
    private  http: Http
  ) {
    this.http = http;
    this.navCtrl = navCtrl;
    //nice


    this.http.get('https://www.reddit.com/r/gifs/new/.json?limit=1').map(res => res.json()).subscribe(data => {
      //  this.posts = data.data.children;
      },
      err => {
      console.log("Oops!");
      });
    };


  ionViewWillEnter() {
    this.wishList = [
      {
        'name': 'Gummy',
        'price': 19.99,
        'img': '../../assets/gummy.png'
      },
      {
        'name': 'Yerba Mate',
        'price': 4.00,
        'img': '../../assets/yerba.png'
      },
      {
        'name': 'Mac',
        'price': 200,
        'img': '../../assets/mac.png'
      },
    ]
  }

  logOut() {
    let alert = this.alertCtrl.create({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.authData.logoutUser().then(() => {
              this.navCtrl.setRoot(Login);
            });
          }
        }
      ]
    });
    alert.present();
  }

  addWatch() {
    let modal = this.modalCtrl.create(Modal);
    modal.present();
    
    //gets the dank user id
    var user = firebase.auth().currentUser;
    console.log("user id " + user.uid);
  }
}
