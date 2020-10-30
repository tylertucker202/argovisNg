import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-storm-popup',
  templateUrl: './storm-popup.component.html',
  styleUrls: ['./storm-popup.component.css']
})
export class StormPopupComponent implements OnInit {

  constructor() { }
  @Input() name: string
  @Input() source: string
  @Input() catagory: string
  @Input() lat: string
  @Input() lon: string
  @Input() date: string

  public greeting: string =  'Hello there! I am an unnamed storm'

  ngOnInit(): void {
    if (this.name){
      this.greeting = `Hello there! I\'m ${this.name} from the ${this.source} data set.`
    }
  }

}
