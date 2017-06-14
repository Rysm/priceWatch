import { Component } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';
import { AuthData } from '../../providers/auth-data';
import { Login } from '../login/login';
import { Modal } from '../modal/modal';
import firebase from 'firebase';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // List of items user is watching
  wishList: any;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public authData: AuthData,
  ) { }

  // Initialize wishlist by hardcoding it
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
  }
}
