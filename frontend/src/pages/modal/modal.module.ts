import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { Modal } from './modal';

@NgModule({
  declarations: [
    Modal,
  ],
  
  exports: [
    Modal
  ]
})
export class ModalModule {}
