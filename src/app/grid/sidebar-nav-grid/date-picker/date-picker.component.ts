import { Component, OnInit, Injector } from '@angular/core';
import { MonthPickerComponent } from './../month-picker/month-picker.component'

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./../month-picker/month-picker.component.css']
})
export class DatePickerComponent extends MonthPickerComponent implements OnInit {

  constructor(injector: Injector ) { super(injector)}

  ngOnInit(): void {
    this.monthPicker = false
    this.inc = 3
  }

}
