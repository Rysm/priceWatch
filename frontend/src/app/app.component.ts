import { Component } from '@angular/core';
import {
  Push,
  PushToken
} from '@ionic/cloud-angular';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { Login } from '../pages/login/login';
import { HomePage } from '../pages/home/home';

import firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public push: Push) {

    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyDVQgtdE8ArBCiB4kubfGZflY1kegpzZVY",
      authDomain: "pricewatch-36aeb.firebaseapp.com",
      databaseURL: "https://pricewatch-36aeb.firebaseio.com",
      projectId: "pricewatch-36aeb",
      storageBucket: "pricewatch-36aeb.appspot.com",
      messagingSenderId: "900764580669"
    };

    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        console.log("Not logged in!");
        this.rootPage = Login;
      } else {
        console.log("Logged in!");
        this.rootPage = HomePage;
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.push.register().then((t: PushToken) => {
      return this.push.saveToken(t);
    }).then((t: PushToken) => {
      console.log('Token saved:', t.token);
      console.log('User ID:', t.id);
      console.log('Saved to API:', t.saved); // This is true!
    });

    this.push.rx.notification().subscribe((msg) => {
      alert(msg.title + ': ' + msg.text); // Prints "priceWatch: This is my demo push!"
    });
  }
}
