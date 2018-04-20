import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'app-order-delivery',
  templateUrl: './order-delivery.component.html',
  styleUrls: ['./order-delivery.component.css']
})
export class OrderDeliveryComponent implements OnInit {
  
  signupData = { username:'', password:'' };
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
    this.message = "";
  this.http.get('/api/user', httpOptions).subscribe(data => {
      this.response = data;
      this.userLogged = true;
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

}
