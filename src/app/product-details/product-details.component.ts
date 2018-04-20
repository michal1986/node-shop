import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute} from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  singleProduct:any;
  singleProductId:string;
  response:any;


  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
  

  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.singleProductId = params.id;
          this.http.get('/api/blog-post-details/'+this.singleProductId).subscribe(data => {
              this.response = data;
              this.singleProduct = this.response;
          });
      });

  }

}
