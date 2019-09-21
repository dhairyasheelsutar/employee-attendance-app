import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { EmployeePage } from '../pages/employee/employee';
import { CodeInsertPage } from '../pages/code-insert/code-insert';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@Component({
  templateUrl: 'app.html',
  providers: [AndroidPermissions]
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen,
              permissions: AndroidPermissions) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

      permissions.requestPermissions([
        permissions.PERMISSION.READ_EXTERNAL_STORAGE,
        permissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
        permissions.PERMISSION.INTERNET,
        permissions.PERMISSION.CAMERA
      ]);

    });
  }
}

