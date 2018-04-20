import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MatDialogContent, MatFormField} from '@angular/material';

@Component({
  selector: 'app-added-to-cart-dialog',
  templateUrl: './added-to-cart-dialog.component.html',
  styleUrls: ['./added-to-cart-dialog.component.css']
})
export class AddedToCartDialogComponent {

  constructor(public dialogRef: MatDialogRef<AddedToCartDialogComponent>) {

  }


  onNoClick(): void {
    this.dialogRef.close();
  }

}
