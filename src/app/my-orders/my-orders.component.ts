import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {


  userLogged:boolean;
  loggedUser:any;
  response:any;
  message:any;

  constructor(private http: HttpClient, private router: Router) { 


  }

  ngOnInit() {

   
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };

    this.http.get('/api/my-orders', httpOptions).subscribe(data => {
      this.response = data;
      this.loggedUser = this.response;

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

  }

}
