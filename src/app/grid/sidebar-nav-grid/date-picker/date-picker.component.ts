import { Component, OnInit, Injector } from '@angular/core';
import { MonthPickerComponent } from './../month-picker/month-picker.component'

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./../month-picker/month-picker.component.css']
})
export class DatePickerComponent extends MonthPickerComponent implements OnInit {

  constructor(injector: Injector ) { super(injector)}
  public incrementMessage: string
  public decrementMessage: string

  ngOnInit(): void {
    super.ngOnInit()
    this.monthPicker = false
    this.inc = 1
    this.incrementMessage = '+' + JSON.stringify(this.inc) + ' days'
    this.decrementMessage = '-' + JSON.stringify(this.inc) + ' days'
    if (this.inc === 1) { //grammer change
      this.incrementMessage = this.incrementMessage.substring(0, this.incrementMessage.length - 1)
      this.decrementMessage = this.decrementMessage.substring(0, this.decrementMessage.length - 1)
    }
  }

}
