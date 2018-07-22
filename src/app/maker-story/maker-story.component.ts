import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute} from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { AddedToCartDialogComponent } from '../added-to-cart-dialog/added-to-cart-dialog.component';
import {MatDialog, MatDialogConfig} from "@angular/material";

@Component({
  selector: 'app-maker-story',
  templateUrl: './maker-story.component.html',
  styleUrls: ['./maker-story.component.css']
})
export class MakerStoryComponent implements OnInit {

  singleMaker:any;
  singleMakerId:string;
  response:any;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, public dialogRef: MatDialog) {

   }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.singleMakerId = params.id;
          this.http.get('/api/blog-post-details/'+this.singleMakerId).subscribe(data => {
              this.response = data;
              this.singleMaker = this.response;
              console.log(this.singleMaker );
          });
      });


  }

}
