import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPageModule } from '../pages/login/login.module';
import { EmployeePageModule } from '../pages/employee/employee.module';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { CodeInsertPageModule } from '../pages/code-insert/code-insert.module';
import { CameraCheckOutPageModule } from '../pages/camera-check-out/camera-check-out.module';
import { ErrorPageModule } from "../pages/error/error.module";

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    EmployeePageModule,
    IonicStorageModule.forRoot(),
    HttpModule,
    FormsModule,
    CodeInsertPageModule,
    CameraCheckOutPageModule,
      ErrorPageModule,
      LoginPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
