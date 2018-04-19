import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  blogPosts:any;
  response:any;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    
    this.http.get('/api/blog-posts').subscribe(data => {
      this.response = data;
      this.blogPosts = this.response.blogPosts;
      
       
      //console.log(this.products);
  }, err => {
      if(err.status === 401) {
          //this.router.navigate(['login']);
      }
  });
}

}
