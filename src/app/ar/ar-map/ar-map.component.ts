import { Component, OnInit, Injector } from '@angular/core'
import { MapComponent } from './../../home/map/map.component'
import { ArQueryService } from './../ar-query.service'
import { ArMapService } from './../ar-map.service'

@Component({
  selector: 'app-ar-map',
  templateUrl: './ar-map.component.html',
  styleUrls: ['./ar-map.component.css']
})
export class ArMapComponent extends MapComponent implements OnInit {
  private arQueryService: ArQueryService
  private arMapService: ArMapService
  constructor(public injector: Injector) { super(injector)
                                           this.arQueryService = this.injector.get(ArQueryService)
                                           this.arMapService = this.injector.get(ArMapService)
                                         }

  ngOnInit(): void {
    super.ngOnInit()
    this.arQueryService.arEvent
      .subscribe(msg => {
        console.log('ar event emit ' + msg)
        this.arMapService.arShapeItems.clearLayers()
        this.addShapesFromQueryService()
      })
    this.arMapService.arShapeItems.addTo(this.map) //special shapes for ar objects
    }
}
