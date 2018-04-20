import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MatDialogContent, MatFormField} from '@angular/material';
import { Router } from "@angular/router";

@Component({
  selector: 'app-added-to-cart-dialog',
  templateUrl: './added-to-cart-dialog.component.html',
  styleUrls: ['./added-to-cart-dialog.component.css']
})
export class AddedToCartDialogComponent {

  constructor(public dialogRef: MatDialogRef<AddedToCartDialogComponent>, private router: Router) {

  }


  onNoClick(): void {
    this.dialogRef.close();
  }

 closeDialog() {
    this.dialogRef.close();
  }

 viewCart() {
     this.dialogRef.close();
     this.router.navigate(['cart']);;
  }
}
