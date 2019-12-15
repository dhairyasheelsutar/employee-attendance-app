import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {ApiService} from "../../services/api.service";
import {StorageService} from "../../services/storage.service";
import {AlertService} from "../../services/alert.service";
import {LoginPage} from "../login/login";
import {LocationService} from "../../services/location.service";
import {HomePage} from "../home/home";

@IonicPage()
@Component({
    selector: 'page-camera-check-out',
    templateUrl: 'camera-check-out.html',
    providers: [Camera, ApiService, StorageService, AlertService, LocationService]
})
export class CameraCheckOutPage implements OnInit {

    public type = "";
    public code = "";
    public position = {
        latitude: 0,
        longitude: 0
    };

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public camera: Camera,
                public load: LoadingController,
                public alert: AlertController,
                public toast: ToastController,
                public api: ApiService,
                public store: StorageService,
                public alertService: AlertService,
                public location: LocationService) {
    }

    ionViewWillLoad() {
        this.type = this.navParams.get("type");
        this.code = this.navParams.get("code");
        this.location.getLocation().then(pos => this.position = pos);
        
    }

    checkForRequestErrors(error, subTitle, title) {

        if (error.status === 401) {
            this.navCtrl.setRoot(LoginPage);
        } else {

            this.alertService.show(subTitle, () => {
                this.navCtrl.setRoot(HomePage);
            }, title);

        }

    }

    ngOnInit() {
        const options: CameraOptions = {
            quality: 50,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            cameraDirection: 0,
            targetWidth: 400,
            targetHeight: 400
        };

        this.camera.getPicture(options).then((imageData) => {

            const loader = this.load.create({content: "Please wait"});
                loader.present();
                
                let formData = new FormData();
                formData.append('file', imageData);
                
                this.api.postFlask("?id=" + this.code + "&type=" + this.type, formData).subscribe(data => {

                    const obj = data;

                    if (obj["auth"] === "true") {
                        loader.dismiss();

                        this.store.get("token").then(data => {
                            if (this.type == "0") {

                                let obj = {
                                    token: data,
                                    profileId: this.code,
                                    type: "out",
                                    ...this.position
                                };
                                    
                                this.api.post("customer/supervisor/markPresent", obj).subscribe(data => {

                                    let toast = this.toast.create({
                                        message: "Outgoing attendance recorded",
                                        duration: 2000
                                    });
                                    toast.present();

                                    toast.onDidDismiss(() => {
                                        this.navCtrl.popToRoot();
                                    });

                                }, error => {

                                    loader.dismiss();
                                    this.checkForRequestErrors(error, "Error in marking attendance", "Alert");
                                });


                            } else if(this.type == "1") {

                                let obj = {
                                    token: data,
                                    profileId: this.code,
                                    type: "in",
                                    ...this.position
                                };

                                this.api.post("customer/supervisor/markPresent", obj).subscribe(data => {

                                    let toast = this.toast.create({
                                        message: "Incoming attendance recorded",
                                        duration: 2000
                                    });
                                    toast.present();

                                    toast.onDidDismiss(() => {
                                        this.navCtrl.popToRoot();
                                    });

                                }, error => {

                                    loader.dismiss();
                                    this.checkForRequestErrors(error, "Error in marking attendance", "Alert");

                                });

                            }


                        }).catch(error => {
                            console.log(error);
                        });


                    } else {
                        loader.dismiss();
                        this.checkForRequestErrors({status: 404}, "Face not matched. Try again!", "Alert");

                    }

                }, error => {
                    console.log(error);
                    loader.dismiss();
                    this.checkForRequestErrors(error, "Error in file uploading", "Alert");

                });

            

        }, (error) => {
            this.checkForRequestErrors(error, "Camera not supported", "Alert");
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CameraCheckOutPage');
    }

}
