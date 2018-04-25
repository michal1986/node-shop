import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { AddedToCartDialogComponent } from '../added-to-cart-dialog/added-to-cart-dialog.component';
import {MatDialog, MatDialogConfig} from "@angular/material";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products:any;
  response:any;
  categoryName:String;
  url:string;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, public dialogRef: MatDialog) { 

    //const id: string = route.snapshot.toString();
    console.log(route.snapshot.toString());
  }

  ngOnInit() {

    this.products = [];
    this.route.queryParams.subscribe(params => {
        this.categoryName = params.category;
        if(this.categoryName) {
            this.url = "/api/products?category="+this.categoryName;
        } else {
            this.url = "/api/products";
        }
        console.log("using url "+this.url);
        this.http.get(this.url).subscribe(data => {
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
});
}


addToCart(idProduct) {
   
    this.http.get('/api/add-to-cart/'+idProduct).subscribe(data => {
        this.response = data;
        console.log(this.response);
        this.dialogRef.open(AddedToCartDialogComponent, {
            height: '146px',
            width: '400px',
          });
    });
    
}

}