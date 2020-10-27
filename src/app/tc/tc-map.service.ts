import { Injectable, Injector } from '@angular/core'
import { MapService } from './../home/services/map.service'
import { TcShapePopupComponent } from './tc-shape-popup/tc-shape-popup.component'
import 'leaflet'
import 'proj4leaflet'
import 'arc'
import 'leaflet-arc'
import 'leaflet-graticule'
import 'leaflet-draw'
import 'leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.min'
import 'leaflet-ajax'

import { Feature, Polygon } from 'geojson'
declare const L
@Injectable({
  providedIn: 'root'
})
export class TcMapService extends MapService {

  constructor(public injector: Injector) { super(injector) }

  public tcShapeItems = L.featureGroup() //non editable shapes which can be added to drawnItems.
  public tcShapeOptions = { 
                            color: '#FF8C00', //pink: #C71585 orange: #FF8C00
                            weight: 4,
                            opacity: .5
                          }

  public tc_popup_window_creation(layer: L.Polygon, featureGroup: L.FeatureGroup, shapeType='shape', shape_id=''): void {
    const feature = layer.toGeoJSON() as Feature<Polygon>
    const shape = this.get_lat_lng_from_feature(feature)
    const transformedShape = this.get_transformed_shape(shape);
    layer.bindPopup(null);
    layer.on('click', (event) => {
      const popupContent = this.compileService.compile(TcShapePopupComponent, (c) => { 
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
