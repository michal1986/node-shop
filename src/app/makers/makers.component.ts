import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'app-makers',
  templateUrl: './makers.component.html',
  styleUrls: ['./makers.component.css']
})
export class MakersComponent implements OnInit {

  makers:any;
  response:any;
   
  constructor(private http: HttpClient, private router: Router) {
  
   }

  ngOnInit() {
    this.http.get('/api/makers').subscribe(data => {
        this.response = data;
        var makersArr = [];
        this.response.makers.forEach(maker => {
            if(typeof maker.fields.Picture !== 'undefined') {
                 makersArr.push(maker);
            }
        });
        this.makers = makersArr;

       
      console.log(this.makers);
  }, err => {
      if(err.status === 401) {
          //this.router.navigate(['login']);
      }
  });
  }

}
