import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { AddedToCartDialogComponent } from '../added-to-cart-dialog/added-to-cart-dialog.component';
import {MatDialog, MatDialogConfig} from "@angular/material";
@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {


  userLogged:boolean;
  loggedUser:any;
  response:any;
  orders:any;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, public dialogRef: MatDialog) { 


  }

  ngOnInit() {

   
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };

    this.http.get('/api/user', httpOptions).subscribe(data => {
      this.response = data;
      this.loggedUser = this.response;
          this.http.get('/api/my-orders', httpOptions).subscribe(data => {
          this.response = data;
          this.response.orders.forEach(order => {
              order.fields.parsedItems = order.fields["Items"].replace(/\n/g, "<br />")
          });
          this.orders = this.response.orders;
          // this.loggedUser = this.response;
          

          }, err => {
       
           this.router.navigate(['login']);

          if(err.status === 401) {
            this.userLogged = false;
            this.loggedUser = {
              logged:false,
              user: {}
          }
         }
      });
   } , err => {
       
       this.router.navigate(['login']);

      if(err.status === 401) {
        this.userLogged = false;
        this.loggedUser = {
          logged:false,
          user: {}
      }
      }
  });


  }

}
