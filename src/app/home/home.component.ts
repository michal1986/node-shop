import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { AddedToCartDialogComponent } from '../added-to-cart-dialog/added-to-cart-dialog.component';
import {MatDialog, MatDialogConfig} from "@angular/material";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products:any;
  response:any;

  constructor(private http: HttpClient, private router: Router, public dialogRef: MatDialog) { 


  }

  ngOnInit() {
    
    this.http.get('/api/products').subscribe(data => {
      this.response = data;
      this.response.products.forEach(product => {
          product.fields.Price = product.fields.Price.toFixed(2);
      });
        
      this.products = this.response.products;
       
      //console.log(this.products);
  }, err => {
      if(err.status === 401) {
          //this.router.navigate(['login']);
      }
  });
}


addToCart(idProduct) {
   
    this.http.get('/api/add-to-cart/'+idProduct).subscribe(data => {
        this.response = data;
        console.log(this.response);
        this.dialogRef.open(AddedToCartDialogComponent, {
            height: '100px',
            width: '200px',
          });
    });
    
}

}
