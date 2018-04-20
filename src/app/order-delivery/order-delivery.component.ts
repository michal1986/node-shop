import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { OrderConfirmedDialogComponent } from '../order-confirmed-dialog/order-confirmed-dialog.component';
import {MatDialog, MatDialogConfig} from "@angular/material";

@Component({
  selector: 'app-order-delivery',
  templateUrl: './order-delivery.component.html',
  styleUrls: ['./order-delivery.component.css']
})
export class OrderDeliveryComponent implements OnInit {
  
  confirmDeliveryForm :any;
  confirmDelivery = {
    firstName: '',
    lastName: '',
    telephone: '',
    address : '',
    zip: '',
    city: '',
    country: ''
  };
  userLogged:boolean;
  loggedUser:any;
  response:any;
  message:any;

  constructor(private http: HttpClient, private router: Router, public dialogRef: MatDialog) {



   }

  ngOnInit() {
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };
    this.message = "";
    this.http.get('/api/user', httpOptions).subscribe(data => {
      this.response = data;
      this.userLogged = true;
      this.confirmDelivery.firstName = this.response.firstName;
      this.confirmDelivery.lastName = this.response.lastName;
      this.confirmDelivery.telephone = this.response.telephone;
      this.confirmDelivery.address = this.response.address;
      this.confirmDelivery.zip = this.response.zip;
      this.confirmDelivery.city = this.response.city;
      this.confirmDelivery.country = this.response.country;

      this.loggedUser = {
          logged:true,
          user: {
              username:this.response.username
          }
      }
  }, err => {
      if(err.status === 401) {
        this.userLogged = false;
        this.loggedUser = {
          logged:false,
          user: {}
      }
      }
  });
  }

    confirm() {

        
        this.http.post('/api/confirm-order',this.confirmDelivery).subscribe(resp => {
            this.response = resp;
            this.dialogRef.open(OrderConfirmedDialogComponent, {
                height: '146px',
                width: '400px',
              });
        }, err => {
            this.message = err.error.msg;
       });
    }

}
