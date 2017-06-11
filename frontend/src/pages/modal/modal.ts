import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';

@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})

export class Modal {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }

  close() {
    this.navCtrl.pop();
  }
}
