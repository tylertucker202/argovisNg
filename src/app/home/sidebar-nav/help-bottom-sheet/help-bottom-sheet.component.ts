import { Component, Inject, OnInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material';


@Component({
  selector: 'app-help-bottom-sheet',
  templateUrl: './help-bottom-sheet.component.html',
  styleUrls: ['./help-bottom-sheet.component.css']
})
export class HelpBottomSheetComponent implements OnInit {

  constructor(private bottomSheet: MatBottomSheet) { }

  ngOnInit() {
  }

  public openHelpBottomSheet(): void{



    this.bottomSheet.open(HelpBottomSheet)
  }
}

@Component({
  selector: 'help-bottom-sheet',
  templateUrl: 'help-bottom-sheet.html',
})
export class HelpBottomSheet {
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA)private bottomSheetRef: MatBottomSheetRef<HelpBottomSheet>) {}
}
