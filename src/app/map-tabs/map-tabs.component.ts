import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-tabs',
  templateUrl: './map-tabs.component.html',
  styleUrls: ['./map-tabs.component.css']
})
export class MapTabsComponent implements OnInit {

  changeProj(evt: any) {
    console.log("tab change");
    console.log(evt.nextId);
  }
  constructor() { }

  ngOnInit() {
  }

}
