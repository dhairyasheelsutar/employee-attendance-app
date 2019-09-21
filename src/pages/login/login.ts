import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ApiService } from '../../services/api.service';
import { NgForm } from '@angular/forms';
import { StorageService } from '../../services/storage.service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [ApiService, StorageService]
})
export class LoginPage {


  public username: string = "";
  public password: string = "";

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public api: ApiService,
              public alert: AlertController,
              public loading: LoadingController,
              public store: StorageService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }



  onSubmit(form: NgForm){


    this.navCtrl.push(HomePage);
    /*
    if(this.username !== undefined && this.password !== undefined && this.username !==  "" && this.password !== ""){

      let obj = {
        username: this.username,
        password: this.password
      };

      console.log(obj);

      let loader = this.loading.create({content: "Logging in..."});
      loader.present();

      this.api.post("login.php", obj).subscribe((data) => {
        if(data.status === 400){
          loader.dismiss();
          this.alert.create({
            subTitle: "Invalid login credentials",
            buttons: [
              {
                text: "Ok",
                role: "cancel",
                handler: value => {
                  this.username = this.password = "";
                }
              }
            ]
          }).present();
        }else{

          this.store.set("data", data).then((success) => {
            this.navCtrl.push(HomePage);
          }, (error) => {
            console.log(error);
          });
        }
      }, (error) => {
        console.log(error);
        this.alert.create({
          subTitle: "Invalid login credentials",
          buttons: [
            {
              text: "Ok",
              role: "cancel"
            }
          ]
        }).present();
      });

    }else{

      this.alert.create({
        subTitle: "Please fill all fields",
        buttons: [
          {
            text: "Ok",
            role: "cancel"
          }
        ]
      }).present();

    }*/
  }

}
