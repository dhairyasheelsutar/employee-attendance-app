import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { ApiService } from "../../services/api.service";
import { StorageService } from "../../services/storage.service";
import { AlertService} from "../../services/alert.service";
import { LoginPage } from "../login/login";

@IonicPage()
@Component({
  selector: 'page-camera-check-out',
  templateUrl: 'camera-check-out.html',
  providers: [Camera, FilePath, FileTransfer, ApiService, StorageService, AlertService]
})
export class CameraCheckOutPage implements OnInit {

  public type = "";
  public code = "";
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public camera: Camera,
              public path: FilePath,
              public transfer: FileTransfer,
              public load: LoadingController,
              public alert: AlertController,
              public toast: ToastController,
              public api: ApiService,
              public store: StorageService,
              public alertService: AlertService) {
  }

  ionViewWillLoad(){
    this.type = this.navParams.get("type");
    this.code = this.navParams.get("code");
  }

  checkForRequestErrors( error, subTitle, title ){

      if(error.status === 401){
          this.navCtrl.setRoot(LoginPage);
      }else{

          this.alertService.show(subTitle, () => {
              this.navCtrl.pop();
          }, title);

      }

  }

  ngOnInit(){
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      cameraDirection: 0
    };
    
    this.camera.getPicture(options).then((imageData) => {
      
      this.path.resolveNativePath(imageData).then((relativePath) => {

        const loader = this.load.create({content: "Please wait"});
        loader.present();
        let array = relativePath.split("/");
        const filename = array[array.length-1];
        const fileTransfer: FileTransferObject = this.transfer.create();
        let options1: FileUploadOptions = {
          fileKey: 'file',
          fileName: filename,
          headers: {},
          httpMethod: "POST"
        };

        fileTransfer.upload(imageData, "http://192.168.43.248:5000?id="+ this.code +"&type=" + this.type, options1).then(data => {
        
          const obj = JSON.parse(data.response);
      
          if(obj["auth"] === "true"){
            loader.dismiss();

            this.store.get("token").then(data => {
                if(this.type === "0"){

                    let obj = {
                        token: data,
                        profileId: this.code,
                        type: "out"
                    };

                    this.api.post("ionic/markPresent", obj).subscribe(data => {

                        let toast = this.toast.create({
                            message: "Outgoing attendance recorded",
                            duration: 2000
                        });
                        toast.present();

                        toast.onDidDismiss(() => {
                            this.navCtrl.popToRoot();
                        });

                    }, error =>{

                        loader.dismiss();
                        this.checkForRequestErrors(error, "Error in marking attendance", "Alert");
                    });



                }else{

                    let obj = {
                        token: data,
                        profileId: this.code,
                        type: "in"
                    };

                    this.api.post("ionic/markPresent", obj).subscribe(data => {

                        let toast = this.toast.create({
                            message: "Incoming attendance recorded",
                            duration: 2000
                        });
                        toast.present();

                        toast.onDidDismiss(() => {
                            this.navCtrl.popToRoot();
                        });

                    }, error =>{

                        loader.dismiss();
                        this.checkForRequestErrors(error, "Error in marking attendance", "Alert");

                    });

                }


            }).catch(error => {
                console.log(error);
            });
            


          }else{
            loader.dismiss();
              this.checkForRequestErrors({status: 404}, "Face not matched. Try again!", "Alert");
            
          }
        }).catch(error => {
          loader.dismiss();

            this.checkForRequestErrors(error, "Error in file uploading", "Alert");
        });

      }).catch(error => {
          this.checkForRequestErrors(error, "Error in resolving file path", "Alert");
      });

    }, (error) => {
        this.checkForRequestErrors(error, "Camera not supported", "Alert");
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraCheckOutPage');
  }

}
