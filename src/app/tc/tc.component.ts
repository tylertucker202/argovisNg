import { Component, OnInit } from '@angular/core';
import { HomeComponent } from './../home/home.component'
import { TopToolbarService } from '../top-toolbar.service'
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-tc',
  templateUrl: './tc.component.html',
  styleUrls: ['./../home/home.component.css']
})
export class TcComponent extends HomeComponent implements OnInit {

  constructor(public toolbarService: TopToolbarService,
    public route: ActivatedRoute) { super(toolbarService, route) }
    
    ngOnInit() {
      super.ngOnInit()
    }

}
