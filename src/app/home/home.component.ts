import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products:any;

  constructor(private http: HttpClient, private router: Router) { 


  }

  ngOnInit() {
    this.http.get('/api/products').subscribe(data => {
      this.products = [
        {
          name:'12223'
        },
        {
          name:'12224'
        }
      ];
      console.log(this.products);
  }, err => {
      if(err.status === 401) {
          //this.router.navigate(['login']);
      }
  });
}

}
