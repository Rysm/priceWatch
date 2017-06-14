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
  wishList: any = [];
  arr: any = [];

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public authData: AuthData
  ) { }

  // Initialize wishlist by hardcoding it
  ionViewWillEnter() {
    var user = firebase.auth().currentUser;
    var ref = firebase.database().ref('userProfile/'+user.uid+'/products');
    ref.on('child_added', snapshot => {
      this.wishList.push(JSON.parse(snapshot.val()));
      this.arr.push(snapshot.key);
    });
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

  doRefresh(refresher) {
    setTimeout(() => {
      location.reload();
      refresher.complete();
    }, 2000);
  }

  addWatch() {
    let modal = this.modalCtrl.create(Modal);
    modal.present();
  }

  deleteItem(key) {
    var user = firebase.auth().currentUser;
    var ref = firebase.database().ref('userProfile/'+user.uid+'/products');
    ref.child(this.arr[key]).remove();
  }
}
