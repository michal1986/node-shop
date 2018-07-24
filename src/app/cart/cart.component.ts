import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {


  userLogged:boolean;
  loggedUser:any;
  response:any;
  cart:any;


  constructor(private http: HttpClient, private router: Router) { 
   
  }

  ngOnInit() {

      this.http.get('/api/cart').subscribe(data => {
          this.cart = data;
      }, err => {
          if (err.status === 401) {}
      });

  }


  removeItemFromCart(itemId) {
      this.http.get('/api/remove-item-from-cart/'+itemId).subscribe(data => {
          this.http.get('/api/cart').subscribe(data => {
              this.cart = data;
          }, err => {
              if (err.status === 401) {}
          });
      });
  }

}
