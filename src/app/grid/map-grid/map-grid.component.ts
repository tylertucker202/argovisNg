import { Component, OnInit, OnDestroy, ApplicationRef } from '@angular/core';
import { MapState } from '../../../typeings/mapState';
import { MapService } from '../../home/services/map.service';
import * as L from "leaflet";

@Component({
  selector: 'app-map-grid',
  templateUrl: './map-grid.component.html',
  styleUrls: ['./map-grid.component.css']
})

export class MapGridComponent implements OnInit, OnDestroy {
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
    this.mapService.gridDrawControl.addTo(this.map);
    this.markersLayer.addTo(this.map);

    this.map.on('draw:created', (event: L.DrawEvents.Created) => {
      const layer = event.layer
      let layerCoords = layer.toGeoJSON();
      const shape = layerCoords.geometry.coordinates;
      console.log(shape)
      this.mapService.drawnItems.addLayer(layer);
      console.log(this.mapService.drawnItems.toGeoJSON())
     });

    this.map.on('draw:deleted', (event: L.DrawEvents.Deleted) => {
      const layers = event.layers;
      let myNewShape = this.mapService.drawnItems;
      layers.eachLayer(function(layer: any) {
        const layer_id = layer._leaflet_id
        myNewShape.removeLayer(layer)
      });
      this.mapService.drawnItems = myNewShape
      console.log(this.mapService.drawnItems.toGeoJSON())
     });
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