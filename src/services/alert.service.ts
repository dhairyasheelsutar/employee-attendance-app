import { Injectable } from "@angular/core";
import 'rxjs/Rx';
import { AlertController } from "ionic-angular";

@Injectable()
export class AlertService{

    constructor(private alert: AlertController){

    }

    show (subTitle = "", callback?, title?){
        this.alert.create({
           title: title || "Alert",
           subTitle: subTitle,
           buttons: [
               {
                   text: "Ok",
                   role: "cancel",
                   handler: () => {
                       if(callback) callback();
                   }
               }
           ]
        }).present();
    }

}