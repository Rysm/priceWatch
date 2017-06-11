import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
	
	priceThreshold: any = [1, 5, 10, 25, 50, 100];



  constructor(public alertCtrl: AlertController) {}
  
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
  
  
}

