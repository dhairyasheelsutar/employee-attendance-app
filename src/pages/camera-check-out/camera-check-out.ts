import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';

@IonicPage()
@Component({
  selector: 'page-camera-check-out',
  templateUrl: 'camera-check-out.html',
  providers: [Camera, FilePath, FileTransfer]
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
              public toast: ToastController) {
  }

  ionViewWillLoad(){
    this.type = this.navParams.get("type");
    this.code = this.navParams.get("code");
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

            /*
            in: true
            out: false
            let obj = {
                token: "json_web_token",
                code: 1234,
                type: true
            };*/
            
            if(this.type === "0"){

              this.toast.create({
                  message: "Outgoing attendance recorded",
                  duration: 2000
              }).present();

            }else{

                this.toast.create({
                    message: "Incoming attendance recorded",
                    duration: 2000
                }).present();

            }

          }else{
            loader.dismiss();
            this.alert.create({
              title: "Face not matched",
              message: "Try again to verify",
              buttons: [
                {
                  text: "Ok",
                  role: "cancel",
                  handler: value => {
                    this.navCtrl.pop();
                  }
                }
              ]
            }).present();
            
          }
        }).catch(error => {
          loader.dismiss();
            this.alert.create({
                title: "Error in file uploading",
                message: "Try again to verify",
                buttons: [
                    {
                        text: "Ok",
                        role: "cancel",
                        handler: value => {
                            this.navCtrl.pop();
                        }
                    }
                ]
            }).present();
        });

      }).catch(error => {
          this.alert.create({
              title: "Error in resolving android path",
              message: "Try again to verify",
              buttons: [
                  {
                      text: "Ok",
                      role: "cancel",
                      handler: value => {
                          this.navCtrl.pop();
                      }
                  }
              ]
          }).present();
      });

    }, (err) => {
        this.alert.create({
            title: "Camera not supported",
            message: "Try again to verify",
            buttons: [
                {
                    text: "Ok",
                    role: "cancel",
                    handler: value => {
                        this.navCtrl.pop();
                    }
                }
            ]
        }).present();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraCheckOutPage');
  }

}
