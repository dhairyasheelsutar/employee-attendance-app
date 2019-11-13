import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';

@Injectable()
export class StorageService {

    constructor(private storage: Storage) {

    }

    set(key: string, value: any) {
        return new Promise<any>((resolve, reject) => {
            this.storage.set(key, value).then(() => {
                resolve(true);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    get(key: string) {
        return new Promise<any>((resolve, reject) => {
            this.storage.get(key).then(data => {
                resolve(data);
            }).catch(error => {
                reject(error);
            });
        });
    }

    clear() {
        return new Promise<any>((resolve, reject) => {
            this.storage.clear().then(data => {
                resolve(data);
            }).catch(error => {
                reject(error);
            });
        });
    }

}