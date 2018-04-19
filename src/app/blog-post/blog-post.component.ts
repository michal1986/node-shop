import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute} from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';


@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.css']
})
export class BlogPostComponent implements OnInit {

  singleBlogPost:any;
  singleBlogPostId:number;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) { 

  }
  //this.route.params.subscribe(params => { this.user = params['user']; });
  //this.router.navigate(['./yourlocation', { user: this.user }]);
  ngOnInit() {

  	this.route.params.subscribe(params => {
  		console.log('PARAMS');
  		console.log(params);
        this.singleBlogPostId = params['id'];
    });


  }

}
