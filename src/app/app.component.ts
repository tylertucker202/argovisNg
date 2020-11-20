import { JsonLDService } from './json-ld.service';
import { Component } from '@angular/core';
import { Router,NavigationEnd, NavigationStart  } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private route:Router, private jsonLDService: JsonLDService) {
    this.route_event(this.route);
  }
  
  route_event(router: Router){
    router.events.subscribe(e => {
      if(e instanceof NavigationStart){
        this.jsonLDService.remove_structured_data()
      }
      if(e instanceof NavigationEnd){
        this.jsonLDService.insert_schema(JsonLDService.websiteSchema())
      }


    });
  }
}