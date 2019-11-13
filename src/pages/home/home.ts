import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {EmployeePage} from '../employee/employee';
import {CodeInsertPage} from '../code-insert/code-insert';
import {forkJoin} from "rxjs/observable/forkJoin";
import {ApiService} from "../../services/api.service";
import {LoginPage} from "../login/login";
import {StorageService} from "../../services/storage.service";
import {AlertController} from "ionic-angular";
import {ErrorPage} from "../error/error";
import {AlertService} from "../../services/alert.service";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
    providers: [ApiService, StorageService, AlertService]
})
export class HomePage {

    monthList = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    day: number;
    year: number;
    month: string;
    totalEmployeesCount = 0;
    presentEmployeesCount = 0;
    totalEmployees = [];
    presentEmployees = [];


    constructor(public navCtrl: NavController,
                public api: ApiService,
                public store: StorageService,
                public alert: AlertController,
                public alertService: AlertService) {
        let date = new Date();
        this.day = date.getDate();
        this.year = date.getFullYear();
        this.month = this.monthList[date.getMonth()];
    }

    loadEmployees(choice: number) {
        let obj = {};
        if (choice === 1) {
            obj = {
                employees: this.totalEmployees,
                title: "Total"
            };

            this.navCtrl.push(EmployeePage, obj);
        } else {
            obj = {
                employees: this.presentEmployees,
                title: "Present"
            };
            this.navCtrl.push(EmployeePage, obj);
        }
    }

    incomingAttendance() {
        this.navCtrl.push(CodeInsertPage, {type: 1});
    }

    outgoingAttendance() {
        this.navCtrl.push(CodeInsertPage, {type: 0});
    }

    ionViewCanEnter() {

        return new Promise((resolve, reject) => {

            this.store.get("token").then((data) => {

                let obj = {
                    token: data
                };

                forkJoin([
                    this.api.post("customer/supervisor/index", obj),
                    this.api.post("customer/supervisor/allWorkers", obj),
                    this.api.post("customer/supervisor/allPresentWorkers", obj)
                ]).subscribe(([data1, data2, data3]) => {
                    resolve(true);
                    this.totalEmployeesCount = data1["totalworkers"];
                    this.presentEmployeesCount = data1["allPresentworkers"];
                    this.totalEmployees = data2;
                    this.presentEmployees = data3;
                }, (error) => {

                    if (error.status === 401) {
                        this.store.clear().then(() => {
                            this.navCtrl.setRoot(LoginPage);
                            resolve(true);
                        });
                    } else {
                        this.alertService.show("Page not found", () => {
                            console.log("ok");
                            resolve(true);
                            this.navCtrl.setRoot(ErrorPage);
                        });

                    }
                });


            });

        });

    }

}
