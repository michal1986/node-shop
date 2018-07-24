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
  makerItems:any;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, public dialogRef: MatDialog) {

   }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.singleMakerId = params.id;
          this.http.get('/api/blog-post-details/'+this.singleMakerId).subscribe(data => {
              this.response = data;
              this.singleMaker = this.response;
              var commaSeperatedIds = "";
              var iterator = 0;
              this.singleMaker.fields.Items.forEach(item => {
                  if(iterator == 0) {
                       commaSeperatedIds = commaSeperatedIds + item;
                  } else {
                       commaSeperatedIds = commaSeperatedIds+","+item;
                  }
                  iterator++;
                  
              });
              this.http.get('/api/records-by-id/?table=Items&recordsIds='+commaSeperatedIds+'').subscribe(data => {
                  this.response = data;
                  var filteredItems = [];
                  this.response.objects.forEach(item => {
                      if(typeof item.fields["Fotos"][0] !== 'undefined') {
                          filteredItems.push(item);
                      }
                  });
                  this.makerItems = filteredItems;
              });
          });
      });


  }

}
