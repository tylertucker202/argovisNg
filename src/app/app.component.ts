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
    this.routeEvent(this.route);
  }
  
  routeEvent(router: Router){
    router.events.subscribe(e => {
      if(e instanceof NavigationStart){
        console.log('inside navigation start', e)
        this.jsonLDService.removeStructuredData()
      }
      if(e instanceof NavigationEnd){
        console.log('inside navigation end', e)
        this.jsonLDService.insertSchema(JsonLDService.websiteSchema())
      }


    });
  }
}