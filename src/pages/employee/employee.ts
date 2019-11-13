import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-employee',
    templateUrl: 'employee.html',
})
export class EmployeePage {

    employees = [];
    title = "";

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad EmployeePage');
    }

    ionViewWillEnter() {

        this.title = this.navParams.get("title");
        this.employees = this.navParams.get("employees");

    }

    goBack() {
        this.navCtrl.pop();
    }


}
