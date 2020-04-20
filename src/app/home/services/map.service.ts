import { Injectable, ApplicationRef, Injector } from "@angular/core"
import { ShapePopupComponent } from '../shape-popup/shape-popup.component'
import { PopupCompileService } from './popup-compile.service'
import { Feature, FeatureCollection, Polygon, Geometry } from 'geojson'

import 'leaflet'
import 'proj4leaflet'
import 'arc'
import 'leaflet-arc'
import 'leaflet-graticule'
import '../../../ext-js/leaflet.draw-arc-src.js'
import 'leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.min'
import 'leaflet-ajax'

declare const L;
import * as chroma from 'chroma'
import { ChromaStatic } from "chroma-js"
declare const chroma: ChromaStatic


@Injectable()
export class MapService {
  public baseMaps: any;
  public drawnItems = L.featureGroup();

  public platformProfileMarkersLayer = L.featureGroup();
  public markersLayer = L.featureGroup()

  private WMstartView = [20, -150]
  private WMstartZoom = 3
  private SSPstartView = [-89, .1]
  private SSPstartZoom = 4
  private NSPstartView =  [89, .1]
  private NSPstartZoom = 4

  public shapeOptions =   {color: '#983fb2', //purple: #983fb2
  weight: 4,
  opacity: .5}


  public sStereo = new L.Proj.CRS('EPSG:3411',
                                  '+proj=stere '+
                                  '+lat_0=-90 +lon_0=-45 +lat_ts=80'+
                                  '+k=1 +x_0=0 +y_0=0 +a=6378273 +b=6356889.449 +units=m +no_defs',
                                  {
                                      resolutions: [
                                      4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8
                                      ],
                                      origin: [.1,.1]
                                  });
  public nStereo = new L.Proj.CRS('EPSG:3411',
                                  '+proj=stere' +
                                  '+lat_0=90 +lon_0=-45 +lat_ts=-80' +
                                  ' +k=1 +x_0=0 +y_0=0 +a=6378273 +b=6356889.449 +units=m +no_defs',
                                  {
                                      resolutions: [
                                      4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8
                                      ],
                                      origin: [.1,.1]
                                  });
  private worldStyle = {
    "color": "#15b01a",
    "fill-rule": "evenodd",
    "weight": 1,
    "fillColor": "#033500",
    "opacity": 1,
    "fillOpacity": .9,
    };
  private satelliteMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  {attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  });
  private googleMap = L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}',
    {attribution: 'google'
  });
  private esri_OceanBasemap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}',
    {attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
  });

  private gebco = L.tileLayer.wms('https://www.gebco.net/data_and_products/gebco_web_services/2019/mapserv?', {
    layers: 'GEBCO_2019_GRID',
    attribution: 'WMS for the GEBCO_2019 global bathymetric grid'
    });

  private gebco_2 = L.tileLayer.wms('https://www.gebco.net/data_and_products/gebco_web_services/2019/mapserv?', {
    layers: 'GEBCO_2019_GRID_2',
    attribution: 'WMS for the GEBCO_2019 global bathymetric grid. This layers displays the GEBCO_2019 Grid as an image colour-shaded for elevation'
    });

    private Hydda_Base = L.tileLayer('https://{s}.tile.openstreetmap.se/hydda/base/{z}/{x}/{y}.png', {
      attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    private Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: 'abcd',
      minZoom: 0,
      maxZoom: 20,
      ext: 'png'
    });

    private Stamen_TonerBackground = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: 'abcd',
      minZoom: 0,
      maxZoom: 20,
      ext: 'png'
    });

    private Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
      maxZoom: 16
    });

    private CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    });

  public generateMap(this, proj: string, gridMap=false): L.Map {
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
    console.log('graticule', graticule)
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

  private graticuleDark = L.latlngGraticule({
  showLabel: true,
  color: '#000000',
  opacity: .5,
  zoomInterval: [
    {start: 0, end: 4, interval: 30},
    {start: 4, end: 5, interval: 10},
    {start: 5, end: 7.5, interval: 5},
    {start: 7.5, end: 12, interval: 1}
    ]
  });
  
  private graticuleLight = L.latlngGraticule({
    showLabel: true,
    color: '#aaa',
    opacity: 1,
    zoomInterval: [
      {start: 0, end: 4, interval: 30},
      {start: 4, end: 5, interval: 10},
      {start: 5, end: 7.5, interval: 5},
      {start: 7.5, end: 12, interval: 1}
      ]
  });

  private curvedGraticule = L.latlngGraticule({
    showLabel: true,
    latLineCurved: 1,
    weight: 3,
    lngLineCurved: 1,
    zoomInterval: [
      {start: 0, end: 4, interval: 30},
      {start: 4, end: 5, interval: 10},
      {start: 5, end: 7.5, interval: 5},
      {start: 7.5, end: 13, interval: 1}
      ]
    });

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

  public compileService: PopupCompileService

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

  public getTransformedShape(shape: number[][]): number[][][] {
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

  public popupWindowCreation = function(layer: L.Polygon, featureGroup: L.FeatureGroup, shapeType='shape', shape_id=''): void{
    const feature = layer.toGeoJSON();
    const shape = this.getLatLngFromFeature(feature)
    const transformedShape = this.getTransformedShape(shape);
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
    console.log('featureGroup: ', featureGroup)
    }

  public getLatLngFromFeature(feature: Feature<Polygon>): number[][] {
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
