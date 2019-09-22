import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EmployeePage } from '../employee/employee';
import { CodeInsertPage } from '../code-insert/code-insert';
import { forkJoin } from "rxjs/observable/forkJoin";
import { ApiService } from "../../services/api.service";
import { LoginPage } from "../login/login";
import { StorageService } from "../../services/storage.service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
    providers: [ApiService, StorageService]
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


  constructor(public navCtrl: NavController, public api: ApiService, public store: StorageService) {
    let date = new Date();
    this.day = date.getDate();
    this.year = date.getFullYear();
    this.month = this.monthList[date.getMonth()];
  }

  loadEmployees(choice: number){
      let obj = {};
      if(choice === 1){
          obj = {
              employees: this.totalEmployees,
              title: "Total"
          };

          this.navCtrl.push(EmployeePage, obj);
      }else{
          obj = {
              employees: this.presentEmployees,
              title: "Present"
          };
          this.navCtrl.push(EmployeePage, obj);
      }
  }

  incomingAttendance(){
    this.navCtrl.push(CodeInsertPage, {type: 1});
  }

  outgoingAttendance(){
    this.navCtrl.push(CodeInsertPage, {type: 0});
  }

  ionViewCanEnter(){

      return new Promise((resolve) => {

          this.store.get("token").then((data) => {

              let obj = {
                  token: data
              };

              forkJoin([
                  this.api.post("ionic/totalEmployees", obj),
                  this.api.post("ionic/allemployees", obj)
              ]).subscribe(([data1, data2]) => {
                  resolve(true);
                  this.totalEmployeesCount = data1;
                  this.totalEmployees = data2;
                  console.log(this.totalEmployees);
                  console.log(data1);
              }, () => {
                  this.store.clear().then(() => {
                      this.navCtrl.setRoot(LoginPage);
                      resolve(true);
                  });
              });


          });

      });

  }

}
