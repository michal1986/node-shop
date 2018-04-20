import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MatDialogContent, MatFormField} from '@angular/material';
import { Router } from "@angular/router";

@Component({
  selector: 'app-order-confirmed-dialog',
  templateUrl: './order-confirmed-dialog.component.html',
  styleUrls: ['./order-confirmed-dialog.component.css']
})
export class OrderConfirmedDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<OrderConfirmedDialogComponent>, private router: Router) { }

  ngOnInit() {
  }


 closeDialog() {
    this.dialogRef.close();
  }

}
