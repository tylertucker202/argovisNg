import { Component, OnInit, OnDestroy, ApplicationRef } from '@angular/core';
import { MapState } from '../../../typeings/mapState';
import { MapService } from '../../home/services/map.service';
import * as L from "leaflet";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit, OnDestroy {
  public map: L.Map;
  public markersLayer = L.layerGroup();
  public startView: L.LatLng;
  public startZoom: number;
  public graticule: any;
  private wrapCoordinates: boolean;
  public proj: string;
  public mapState: MapState;
  public shapeOptions: any;
  
  constructor(private appRef: ApplicationRef,
              public mapService: MapService){ }

  ngOnInit() {
    this.shapeOptions =  {color: '#983fb2',
                    weight: 4,
                    opacity: .5}
    this.mapService.init(this.appRef);


    this.proj = 'WM'
    if ( this.proj === 'WM' ){
      this.wrapCoordinates = true
    }

    this.map = this.mapService.generateMap(this.proj);
    this.startView = this.map.getCenter()
    this.startZoom = this.map.getZoom()

    this.mapService.coordDisplay.addTo(this.map);
    this.mapService.drawnItems.addTo(this.map);
    this.mapService.scaleDisplay.addTo(this.map);
    this.mapService.drawControl.addTo(this.map);
    this.markersLayer.addTo(this.map);
    this.map.on('draw:created', (event: L.DrawEvents.Created) => { });
    this.map.on('draw:deleted', (event: L.DrawEvents.Deleted) => { });
    this.invalidateSize();

  }

  ngOnDestroy() {
    this.map.off();
    this.map.remove();
  }

  private invalidateSize(this): void {
    if (this.map) {
      setTimeout(() => {
        this.map.invalidateSize(true);
      },100);
    }
  }
}