import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

    signupData = { username:'', password:'' };
    message = '';
    response:any;

    constructor(private http: HttpClient, private router: Router) { 

    }

    signup() {
        this.http.post('/api/signup',this.signupData).subscribe(resp => {
            this.response = resp;
            if(this.response.success) {
                this.router.navigate(['login']);
            } else {
                this.message = this.response.msg;
            }
        }, err => {
            this.message = err.error.msg;
       });
    }

    ngOnInit() {
    
    }

}
