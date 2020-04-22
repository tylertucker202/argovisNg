import { Injectable, Injector } from '@angular/core'
import { MapService } from './../home/services/map.service'
import { ArShapePopupComponent } from './ar-shape-popup/ar-shape-popup.component'
import 'leaflet'
import 'proj4leaflet'
import 'arc'
import 'leaflet-arc'
import 'leaflet-graticule'
import './../../ext-js/leaflet.draw-arc-src.js'
import 'leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.min'
import 'leaflet-ajax'

declare const L
@Injectable({
  providedIn: 'root'
})
export class ArMapService extends MapService {

  constructor(public injector: Injector) { super(injector) }

  public arShapeItems = L.featureGroup() //non editable shapes which can be added to drawnItems.
  public arShapeOptions = { 
                            color: '#FF8C00', //pink: #C71585 orange: #FF8C00
                            weight: 4,
                            opacity: .5
                          }

  public arPopupWindowCreation = function(layer: L.Polygon, featureGroup: L.FeatureGroup, shapeType='shape', shape_id=''): void{
    const feature = layer.toGeoJSON()
    const shape = this.getLatLngFromFeature(feature)
    const transformedShape = this.getTransformedShape(shape);
    layer.bindPopup(null);
    layer.on('click', (event) => {
      const popupContent = this.compileService.compile(ArShapePopupComponent, (c) => { 
        c.instance.shape = [shape];
        c.instance.transformedShape = transformedShape;
        c.instance.message = shapeType 
        c.instance.shape_id = shape_id
      })
      layer.setPopupContent(popupContent)
    });
    featureGroup.addLayer(layer)
  }
}
