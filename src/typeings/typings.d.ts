/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

import 'leaflet';
import 'leaflet-draw';
import * as geojson from 'geojson';
import * as L from 'leaflet';
import * as proj4 from 'proj4';

declare module 'leaflet' {
  namespace control {
    function coordinates(v: any);
  }

  export interface MapOptions {
    drawControl?: boolean;
  }

  export interface ControlStatic {
    Draw: Control.DrawStatic;
  }

  var ScalarField: any

  var canvasLayer: any

  namespace GeoJSON {
     function AJAX(path: string,parameters?: any): void;
   }

  module Control {

    export interface DrawStatic {
      new(options?: DrawConstructorOptions): Draw;
    }

    export interface DrawConstructorOptions {
      position?: string;
      draw?: DrawOptions;
      edit?: EditOptions;
    }

    export interface DrawOptions {
      polygon?: false | DrawOptions.PolygonOptions,
      rectangle?: false | DrawOptions.RectangleOptions,
      polyline?: false | DrawOptions.PolylineOptions;
      marker?: false | DrawOptions.MarkerOptions;
      circlemarker?: false | DrawOptions.CircleMarkerOptions;
      circle?: false | DrawOptions.CircleOptions;
      linestring?: false | LineStringOptions;
  }

    export interface EditOptions {
        featureGroup: FeatureGroup<any>;
        edit?: false | EditHandlerOptions;
        remove?: false | DeleteHandlerOptions;
        polygon?: boolean | DrawOptions.PolygonOptions;
        polyline?: boolean | PolylineOptions;
        marker?: boolean | MarkerOptions;
        circlemarker?:boolean | CircleMarkerOptions;
        circle?: boolean | CircleOptions;
        lineString?: boolean | LineStringOptions;
    }
    export interface Draw extends Control {  
    }
  }

  export interface PolylineOptions {
    allowIntersection?: boolean;
    shapeOptions?: PolylineOptions;
    repeatMode?: boolean;
  }

  export interface CircleOptions {
  }

  export interface LineStringOptions {
  }

  export interface RectangleOptions {
    allowIntersection?: boolean;
    shapeOptions?: PolylineOptions;
    repeatMode?: boolean;
  }

  export interface PolygonOptions extends PolylineOptions {
    showArea?: boolean;
  }

  export interface EditHandlerOptions {
    selectedPathOptions?: L.PathOptions;
  }

  export interface DeleteHandlerOptions {

  }
}

export type Proj4GeoJSONFeature = geojson.Feature<geojson.GeometryObject> & {
  crs?: { type: string; properties: { name: string } }
};