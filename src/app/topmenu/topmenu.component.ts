import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';


@Component({
  selector: 'app-topmenu',
  templateUrl: './topmenu.component.html',
  styleUrls: ['./topmenu.component.css']
})
export class TopmenuComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { 

  }
  userLogged:boolean;
  loggedUser:any;
  response:any;
  cart:any;

  ngOnInit() {
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') })
    };
  this.http.get('/api/user', httpOptions).subscribe(data => {
      this.response = data;
      this.userLogged = true;
      this.loggedUser = {
          logged:true,
          user: {
              username:this.response.username
          }
      }
      console.log(data);
  }, err => {
      if(err.status === 401) {
        this.userLogged = false;
        this.loggedUser = {
          logged:false,
          user: {}
      }
      }
  });

  this.http.get('/api/cart').subscribe(data => {
    this.cart = data;
    console.log(this.cart);
}, err => {
    if(err.status === 401) {
    }
});

  }


  logout() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['home']);
  }

}
