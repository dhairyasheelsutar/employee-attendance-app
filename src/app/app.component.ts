import {Component} from '@angular/core';
import {Platform, App} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {LoginPage} from '../pages/login/login';
import {AndroidPermissions} from '@ionic-native/android-permissions';
import {StorageService} from "../services/storage.service";
import {HomePage} from '../pages/home/home';

@Component({
    templateUrl: 'app.html',
    providers: [AndroidPermissions, StorageService]
})
export class MyApp {

    constructor(platform: Platform,
                statusBar: StatusBar,
                splashScreen: SplashScreen,
                permissions: AndroidPermissions,
                public store: StorageService,
                public app: App) {
        platform.ready().then(() => {
            statusBar.styleDefault();
            splashScreen.hide();

            permissions.requestPermissions([
                permissions.PERMISSION.READ_EXTERNAL_STORAGE,
                permissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
                permissions.PERMISSION.INTERNET,
                permissions.PERMISSION.CAMERA,
                permissions.PERMISSION.ACCESS_COARSE_LOCATION,
                permissions.PERMISSION.ACCESS_FINE_LOCATION
            ]);

            platform.registerBackButtonAction(() => {
                if (this.app.getActiveNav().getActive().component.name !== "HomePage") {
                    this.app.getActiveNav().pop();
                }
            });

            this.store.get("token").then((data) => {
                if (data !== null) {
                    this.app.getActiveNav().setRoot(HomePage);
                } else {
                    this.app.getActiveNav().setRoot(LoginPage);
                }
            }).catch(() => {
                this.app.getActiveNav().setRoot(LoginPage);
            });

        });
    }
}

