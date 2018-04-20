import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute} from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { AddedToCartDialogComponent } from '../added-to-cart-dialog/added-to-cart-dialog.component';
import {MatDialog, MatDialogConfig} from "@angular/material";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  singleProduct:any;
  singleProductId:string;
  response:any;


  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, public dialogRef: MatDialog) {
  

  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.singleProductId = params.id;
          this.http.get('/api/blog-post-details/'+this.singleProductId).subscribe(data => {
              this.response = data;
              this.singleProduct = this.response;
              console.log(this.singleProduct );
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
