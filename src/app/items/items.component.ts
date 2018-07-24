import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { AddedToCartDialogComponent } from '../added-to-cart-dialog/added-to-cart-dialog.component';
import {MatDialog, MatDialogConfig} from "@angular/material";

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  products:any;
  featuredProducts:any;
  kits:any;
  response:any;
  categoryName:String;
  url:string;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, public dialogRef: MatDialog) { }

    ngOnInit() {

        this.products = [];
        var makersUrl = "/api/makers";
        var makersNameArr = {};
        this.route.queryParams.subscribe(params => {
            this.http.get(makersUrl).subscribe(data => {
                this.response = data;
                this.response.makers.forEach(maker => {
                    makersNameArr[maker.id] = maker.fields.Name;
                });
                this.categoryName = params.category;
                if (this.categoryName) {
                    this.url = "/api/items?category=" + this.categoryName;
                } else {
                    this.url = "/api/items";
                }
                
                var productsArr = [];
                this.http.get(this.url).subscribe(data => {
                    this.response = data;
                    this.response.products.forEach(product => {
                        product.fields.brandName = makersNameArr[product.fields.Maker];
                    });
                    this.response.products.forEach(product => {
                        product.fields.Price = product.fields.Price.toFixed(2);
                    });
                    this.response.products.forEach(product => {
                        if (typeof product.fields.Fotos[0] !== 'undefined') {
                            productsArr.push(product);
                        }
                    });
                    this.products = productsArr;
                }, err => {
                    if (err.status === 401) {
                        //this.router.navigate(['login']);
                    }
                });
                var kitsUrl = "/api/kits";
                var kitsArr = [];
                this.http.get(kitsUrl).subscribe(data => {
                    this.response = data;
                    this.response.kits.forEach(kit => {
                        kit.fields.brandName = makersNameArr[kit.fields.Maker];
                    });
                    this.response.kits.forEach(kit => {
                        kit.fields.Price = kit.fields.Price.toFixed(2);
                    });
                    this.response.kits.forEach(kit => {
                        if (typeof kit.fields.Fotos[0] !== 'undefined') {
                            kitsArr.push(kit);
                        }
                    });
                    this.kits = kitsArr;
                }, err => {
                    if (err.status === 401) {
                        //this.router.navigate(['login']);
                    }
                });
                var featuredProductsUrl = "/api/featured-items";
                var featuredProductsArr = [];
                this.http.get(featuredProductsUrl).subscribe(data => {
                    this.response = data;
                    this.response.featuredProducts.forEach(featuredProduct => {
                        featuredProduct.fields.brandName = makersNameArr[featuredProduct.fields.Maker];
                    });
                    this.response.featuredProducts.forEach(featuredProduct => {
                        featuredProduct.fields.Price = featuredProduct.fields.Price.toFixed(2);
                    });
                    this.response.featuredProducts.forEach(featuredProduct => {
                        if (typeof featuredProduct.fields.Fotos[0] !== 'undefined') {
                            featuredProductsArr.push(featuredProduct);
                        }
                    });
                    this.featuredProducts = featuredProductsArr;
                }, err => {
                    if (err.status === 401) {
                        //this.router.navigate(['login']);
                    }
                });
            });
        });

    }


    addToCart(idProduct) {
        this.http.get('/api/add-item-to-cart/' + idProduct).subscribe(data => {
            this.response = data;
            console.log(this.response);
            this.dialogRef.open(AddedToCartDialogComponent, {
                height: '146px',
                width: '400px',
            });
        });
    }


    addToWishlist(idProduct) {
        let httpOptions = {
            headers: new HttpHeaders({
                'Authorization': localStorage.getItem('jwtToken')
            })
        };
        this.http.get('/api/add-item-to-wishlist/' + idProduct, httpOptions).subscribe(data => {
            this.response = data;
            console.log(this.response);
        });
    }

}
