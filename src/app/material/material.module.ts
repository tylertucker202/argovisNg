import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// material.module.ts
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
//import { MatNativeDateModule } from '@angular/material/';

// import {
//   MatButtonModule,
//   MatSlideToggleModule,
//   MatDividerModule,
//   MatIconModule,
//   MatInputModule,
//   MatMenuModule,
//   MatSidenavModule,
//   MatToolbarModule,
//   MatTooltipModule,
//   MatSelectModule,
//   MatDatepickerModule,
//   MatNativeDateModule,
//   MatBottomSheetModule,
//   MatRadioModule,
//   MatDialogModule, 
// } from '@angular/material';


@NgModule({
  declarations: [],
  exports: [
    MatButtonModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSelectModule,
    MatDatepickerModule,
    //MatNativeDateModule,
    MatBottomSheetModule,
    MatRadioModule,
    MatDialogModule,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSelectModule,
    MatDatepickerModule,
    //MatNativeDateModule,
    MatBottomSheetModule,
    MatRadioModule,
    MatDialogModule,
  ]
})
export class MaterialModule { }
