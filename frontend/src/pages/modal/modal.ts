import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';

declare var Firebase: any;

@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class Modal {

  serverAPI: any = 'http://lithe-climber-167308.appspot.com/';
  gummyURL: any = 'https://www.amazon.com/Albanese-Candy-Sugar-Assorted-5-pound/dp/B00DE4GWWY';
  searchUrl: any = '';
  searchKey: any = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private alertCtrl: AlertController
  ) {  }

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

    this.http.post('http://localhost:8080/itemSearch', reqBody, {headers: headers}).map(res => res.json()).subscribe(data => {
      console.log(data);
    })
    // this.http.post('http://localhost:8080/', reqBody, {headers: headers}).map(res => res.json()).subscribe(data => {
    //   let alert = this.alertCtrl.create({
    //     title: 'Price',
    //     subTitle: 'The current price for the item is $'+data.price,
    //     buttons: ['OK']
    //   });
    //   alert.present();
    // }, err => {
    //   console.log(err);
    // });
  }
}
