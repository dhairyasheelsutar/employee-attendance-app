import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EmployeePage } from '../employee/employee';
import { CodeInsertPage } from '../code-insert/code-insert';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  loadEmployees(){
    this.navCtrl.push(EmployeePage);
  }

  incomingAttendance(){
    this.navCtrl.push(CodeInsertPage, {type: 1});
  }

  outgoingAttendance(){
    this.navCtrl.push(CodeInsertPage, {type: 0});
  }

}
