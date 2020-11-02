import { Injectable, ApplicationRef, Injector } from "@angular/core"
import { ShapePopupComponent } from '../shape-popup/shape-popup.component'
import { PopupCompileService } from './popup-compile.service'

import 'leaflet'
import 'proj4leaflet'
import 'arc'
import 'leaflet-arc'
import 'leaflet-draw'
import 'leaflet-buffer'
import * as msp from './map.service.parameters'
declare const L;

@Injectable()
export class MapService {
  public baseMaps: any;
  public drawnItems = L.featureGroup();
  public platformProfileMarkersLayer = L.featureGroup();
  public markersLayer = L.featureGroup()
  public WMstartView = [20, -150]
  public WMstartZoom = 3
  private SSPstartView = [-89, .1]
  private SSPstartZoom = 4
  private NSPstartView =  [89, .1]
  private NSPstartZoom = 4
  public shapeOptions =   {color: '#983fb2', weight: 4, opacity: .5}
  private worldStyle = msp.worldStyle
  public sStereo = msp.sStereo 
  public nStereo = msp.nStereo
  private satelliteMap = msp.satelliteMap
  private googleMap = msp.googleMap
  private esri_OceanBasemap = msp.esri_OceanBasemap
  private gebco = msp.gebco
  private gebco_2 = msp.gebco_2 
  private Hydda_Base = msp.Hydda_Base
  private Stamen_TonerLite = msp.Stamen_TonerLite
  private Stamen_TonerBackground = msp.Stamen_TonerBackground
  private Esri_WorldGrayCanvas = msp.Esri_WorldGrayCanvas
  private CartoDB_Positron = msp.CartoDB_Positron
  private graticuleDark = msp.graticuleDark
  private graticuleLight = msp.graticuleLight
  private curvedGraticule = msp.curvedGraticule
  public compileService: PopupCompileService

  public gridDrawOptions = {
    position: 'topright',
    draw: {
      polygon: <false> false,
      rectangle: { shapeOptions: {
                    color: '#983fb2',
                    weight: 4, 
                    fill: false,
                    opacity: .5,
                    }
                  },
      polyline: <false> false,
      lineString: <false> false,
      marker: <false> false,
      circlemarker: <false> false, 
      circle: <false> false
    },
    edit: {
      featureGroup: this.drawnItems,
      polygon: {
        allowIntersection: <false> false
      }
    },
  }

  public drawOptions = {
    position: 'topleft',
    draw: {
      polygon: {
          allowIntersection: <false> false,
          shapeOptions: {
            color: '#983fb2',
            weight: 4
          },
      },
      rectangle: <false> false,
      polyline: <false> false,
      lineString: <false> false,
      marker: <false> false,
      circlemarker: <false> false, 
      circle: <false> false
    },
    edit: {
      featureGroup: this.drawnItems,
      polygon: {
        allowIntersection: <false> false
      }
    },
  }
  
  public drawControl = new L.Control.Draw(this.drawOptions);
  public gridDrawControl = new L.Control.Draw(this.gridDrawOptions);

  public coordDisplay = L.control.coordinates({ position:"topright",
                                                useDMS:true,
                                                labelTemplateLat:"N {y}",
                                                labelTemplateLng:"E {x}",
                                                decimals:2,
                                              });
  
  public scaleDisplay = L.control.scale();
  constructor(public injector: Injector) { 
    this.baseMaps = {
      esri: this.satelliteMap,
      ocean: this.esri_OceanBasemap,
      google: this.googleMap,
      gebco: this.gebco,
      gebco2: this.gebco_2,
      esriGrey: this.Esri_WorldGrayCanvas,
      hydda: this.Hydda_Base,
      StamenLite: this.Stamen_TonerLite,
      StamenBlack: this.Stamen_TonerBackground,
      cartoDB: this.CartoDB_Positron
    };
    this.compileService = this.injector.get(PopupCompileService)
  }

  public appRef: ApplicationRef;

  public init(appRef: ApplicationRef): void {
    this.appRef = appRef;
    this.compileService.configure(this.appRef);
  }

  public generate_map(this, proj: string, gridMap=false): L.Map {
    switch(proj) {
      case 'WM': {
        console.log('generating web mercator');
        return  this.createWebMercator(gridMap);
      }
      case 'SSP': {
        console.log('generating south stereo');
        return this.createSouthernStereographic();
      }
      case 'NSP': {
        console.log('generating north stereo');
        return this.createNorthernStereographic();
      }
      default: {
        console.log('proj not found, using web mercator')
        return  this.createWebMercator(gridMap);
      }
    }
  }

  public createWebMercator(this, gridMap: false): L.Map {
    let baseLayer: L.TileLayer
    gridMap? baseLayer = this.baseMaps.esriGrey: baseLayer = this.baseMaps.ocean
    let map = L.map('map',
                      {maxZoom: 13,
                      minZoom: 1,
                      zoomDelta: 0.25,
                      zoomSnap: 0,
                      zoomControl: false,
                      maxBounds: [[-180, -270], [180,180]],
                      layers: [baseLayer]})
                      .setView(this.WMstartView, this.WMstartZoom );
    L.control.layers(this.baseMaps).addTo(map);
    map.on('baselayerchange', (e: any) => {
      const graticule = this.getGraticule(e.name)
      map.removeLayer(graticule)
      graticule.addTo(map);
      });
    L.control.zoom({position:'topleft'}).addTo(map);
    const graticule = this.getGraticule('ocean')
    graticule.addTo(map);
    return map
  };
  
  public createSouthernStereographic(this): L.Map {
    let map = L.map('map',
                    {maxZoom: 13,
                      minZoom: 3,
                      zoomDelta: 0.25,
                      zoomSnap: 0,
                      zoomControl: false,
                      crs: this.sStereo})
                      .setView(this.SSPstartView, this.SSPstartZoom);
    const geojsonLayer = new L.GeoJSON.AJAX("../../assets/world-countries.json", {style: this.worldStyle});
    geojsonLayer.addTo(map);
    L.control.zoom({position:'topleft'}).addTo(map);
    return map
  };
  
  public createNorthernStereographic(this): L.Map {
    let map = L.map('map',
                    {maxZoom: 13,
                      minZoom: 3,
                      zoomDelta: 0.25,
                      zoomSnap: 0,
                      zoomControl: false,
                      crs: this.nStereo})
                      .setView(this.NSPstartView, this.NSPstartZoom);
    const geojsonLayerNoAntartica = new L.GeoJSON.AJAX("../../assets/world-contries-except-ant.json", {style: this.worldStyle}); 
    geojsonLayerNoAntartica.addTo(map);
    L.control.zoom({position:'topleft'}).addTo(map);
    return map
  };

  public getGraticule(basemapName: string) {
    switch(basemapName) {
      case 'esri': {
      return (this.graticuleLight)
      break;
      }
      case 'ocean': {
      return (this.graticuleDark)
      break;
      }
      case 'google': {
      return (this.graticuleLight)
      break;
      }
      default: {
      return (this.graticuleLight)
      break;
      }
    }
  }

  public get_transformed_shape(shape: number[][]): number[][][] {
    //takes [lat long] array and transforms it into a [lng lat] nested array 
    let transformedShape = [];
    for (let j = 0; j < shape.length; j++) {
        //transformation if shape is outside longitude.
        let lng = shape[j][1] % 360;
        //crossing antimeridian transformation
        if (lng < -180) {
          lng = 180 + lng % 180;
        }
        else if (lng > 180) {
          lng = -180 + lng % 180;
        }
        let point = [lng, shape[j][0]];
        transformedShape.push(point);
    }
    return([transformedShape])
  };

  public popupWindowCreation(layer: L.Polygon, featureGroup: L.FeatureGroup, shapeType='shape', shape_id=''): void{
    const feature = layer.toGeoJSON()
    const shape = this.get_lat_lng_from_feature(feature)
    const transformedShape = this.get_transformed_shape(shape);
    layer.bindPopup(null);
    layer.on('click', (event) => {
      const popupContent = this.compileService.compile(ShapePopupComponent, (c) => { 
        c.instance.shape = [shape];
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

  public get_lat_lng_from_feature(feature): number[][] {
    let shape = []
    feature.geometry.coordinates[0].forEach( (coord) => {
      const reverseCoord = [coord[1], coord[0]] // don't use reverse(), as it changes value in place
      shape.push(reverseCoord)
    })
    return shape
  }

  public convertArrayToFeatureGroup(shapeArrays: number[][][], shapeOptions: any): L.FeatureGroup {
    let shapes = L.featureGroup()
    shapeArrays.forEach( (array) => {
      let coords = []
      array.forEach(coord => {
        coords.push(L.latLng(coord[0], coord[1]))
      })
      const polygon = L.polygon(coords, shapeOptions)
      shapes.addLayer(polygon)
    })
    return(shapes)
    }
}
