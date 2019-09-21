import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { CameraCheckOutPage } from '../camera-check-out/camera-check-out';

@IonicPage()
@Component({
  selector: 'page-code-insert',
  templateUrl: 'code-insert.html',
})
export class CodeInsertPage {

  public code: string = "";
  public type = "";
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public toast: ToastController) {
  }

  ionViewWillLoad(){
    this.type = this.navParams.get("type");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CodeInsertPage');
  }

  onSubmit(form: NgForm){
    console.log(this.code);
    this.navCtrl.push(CameraCheckOutPage, {type: this.type, code: this.code});
  }

}
