import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CameraCheckOutPage} from './camera-check-out';

@NgModule({
    declarations: [
        CameraCheckOutPage,
    ],
    imports: [
        IonicPageModule.forChild(CameraCheckOutPage),
    ],
})
export class CameraCheckOutPageModule {
}
