import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MatDialogContent, MatFormField} from '@angular/material';
import { Router } from "@angular/router";

@Component({
  selector: 'app-message-sent-dialog',
  templateUrl: './message-sent-dialog.component.html',
  styleUrls: ['./message-sent-dialog.component.css']
})
export class MessageSentDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MessageSentDialogComponent>, private router: Router) {

  }

  ngOnInit() {
  }

 closeDialog() {
    this.dialogRef.close();
  }

}
