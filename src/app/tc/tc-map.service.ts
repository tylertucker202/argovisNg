import { TcQueryService } from './tc-query.service';
import { BufferPopupComponentComponent } from './buffer-popup-component/buffer-popup-component.component';
import { Injectable, Injector } from '@angular/core'
import { MapService } from './../home/services/map.service'
import { tcTrackPopupComponent } from './tc-shape-popup/tc-shape-popup.component'
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

  constructor(public injector: Injector, public tcQueryService: TcQueryService) { super(injector) }

  public globalTcTracks: L.FeatureGroup = L.featureGroup() //non editable shapes which can be added to drawnItems.
  public selectedStorm: L.FeatureGroup  = L.featureGroup()
  
  public tcDrawOptions = {
    position: 'topleft',
    // draw: {
    //   polygon: <false> false,
    //   rectangle: <false> false,
    //   polyline: <false> false,
    //   lineString: <false> false,
    //   marker: <false> false,
    //   circlemarker: <false> false, 
    //   circle: <false> false
    // },
    draw: false,
    edit: {
      featureGroup: this.globalTcTracks,
      polygon: {
        allowIntersection: <false> false
      },
      remove: true,
      buffer: {
        replacePolylines: false,
        separateBuffer: true,
        bufferStyle: {
          color: '#983fb2',
          weight: 4,
          opacity: .5
        },
      },
    },
  }
  public tcTrackOptions = { 
                            color: '#FF8C00', //pink: #C71585 orange: #FF8C00 purple: #983fb2
                            weight: 4,
                            opacity: .5
                          }


  public tcDrawControl = new L.Control.Draw(this.tcDrawOptions);

  public tc_popup_window_creation(layer: L.Polygon, featureGroup: L.FeatureGroup, shapeType='shape', shape_id=''): void {
    const feature = layer.toGeoJSON() as Feature<Polygon>
    const shape = this.get_lat_lng_from_feature(feature)
    const transformedShape = this.get_transformed_shape(shape);
    layer.bindPopup(null);
    layer.on('click', (event) => {
      const popupContent = this.compileService.compile(tcTrackPopupComponent, (c) => { 
        c.instance.shape = [shape];
        c.instance.transformedShape = transformedShape;
        c.instance.message = shapeType 
        c.instance.shape_id = shape_id
      })
      layer.setPopupContent(popupContent)
    });
    featureGroup.addLayer(layer)
  }
  public buffer_popup_window_creation(layer: L.Polygon, featureGroup: L.FeatureGroup, shapeType='shape', shape_id=''): void{
    const feature = layer.toGeoJSON()
    const shape = this.tcQueryService.round_shapes([this.get_lat_lng_from_feature(feature)])
    const transformedShape = this.get_transformed_shape(shape[0]);
    layer.bindPopup(null);
    layer.on('click', (event) => {
      const popupContent = this.compileService.compile(BufferPopupComponentComponent, (c) => { 
        c.instance.shape = shape;
        c.instance.transformedShape = transformedShape;
        c.instance.message = shapeType 
        c.instance.shape_id = shape_id
      })
      layer.setPopupContent(popupContent);
    });
    layer.on('add', (event) => { 
      layer.fire('click') // click generates popup object
    });
    featureGroup.addLayer(layer);
    }
  
}
