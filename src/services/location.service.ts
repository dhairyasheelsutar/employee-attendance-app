import {Injectable} from "@angular/core";
import 'rxjs/Rx';
import {Geolocation} from "@ionic-native/geolocation";

@Injectable()
export class LocationService {

    position = {};

    constructor(private location: Geolocation) {

    }

    getLocation() {
        return new Promise<any>((resolve, reject) => {
            this.location.getCurrentPosition().then(pos => {
                this.position["latitude"] = pos.coords.latitude;
                this.position["longitude"] = pos.coords.longitude;
                resolve(this.position);
            }, err => {
                reject(err);
            });
        });
    }

}