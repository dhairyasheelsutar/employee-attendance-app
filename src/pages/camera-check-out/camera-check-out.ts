import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
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
              public alert: AlertController) {
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
    }
    
    this.camera.getPicture(options).then((imageData) => {
      
      this.path.resolveNativePath(imageData).then((relativePath) => {

        const loader = this.load.create({content: "Please wait"})
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

        let base64Image = 'data:image/jpeg;base64,' + imageData;

        fileTransfer.upload(imageData, "http://34.93.113.71:5000?id=1234", options1).then(data => {
        
          const obj = JSON.parse(data.response);
      
          if(obj["auth"] === "true"){
            loader.dismiss();
            
            if(this.type === "0"){
              alert("Outgoing attendance");
            }else{
              alert("Incoming attendance");
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
          alert("Error " + JSON.stringify(error));
          loader.dismiss();
        });

      }).catch(error => {
        alert(JSON.stringify(error));
      });

    }, (err) => {
     // Handle error
      alert("error");
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraCheckOutPage');
  }

}
