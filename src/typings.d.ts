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

  //export interface GeoJSON{
    //AJAX: any;
  //}

  //const AJAX: (geojson?: Proj4GeoJSONFeature, options?: GeoJSONOptions) => GeoJSON;

  //export interface AJAX{}

  namespace GeoJSON {
     function AJAX(path: string,parameters?: any): void;
     //export interface AJAX {}
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

  namespace Proj {
    class CRS implements CRS {
      projection: Projection;
      transformation: Transformation;
      code?: string;
      wrapLng?: [number, number];
      wrapLat?: [number, number];
      infinite: boolean;

      constructor(projection: proj4.InterfaceProjection, options?: ProjCRSOptions);
      constructor(code: string, proj4def: string, options?: ProjCRSOptions);

      latLngToPoint(latlng: LatLngExpression, zoom: number): Point;

      pointToLatLng(point: PointExpression, zoom: number): LatLng;

      project(latlng: LatLng | LatLngLiteral): Point;

      unproject(point: PointExpression): LatLng;

      scale(zoom: number): number;

      zoom(scale: number): number;

      getProjectedBounds(zoom: number): Bounds;

      distance(latlng1: LatLngExpression, latlng2: LatLngExpression): number;

      wrapLatLng(latlng: LatLng | LatLngLiteral): LatLng;
    }

    const geoJson: (geojson?: Proj4GeoJSONFeature, options?: GeoJSONOptions) => GeoJSON;

    class ImageOverlay extends L.ImageOverlay {}

    const imageOverlay: (imageUrl: string, bounds: LatLngBoundsExpression, options?: ImageOverlayOptions) => ImageOverlay;

    interface ProjCRSOptions {
      bounds?: Bounds;
      origin?: [number, number];
      scales?: number[];
      resolutions?: number[];
      transformation?: Transformation;
    }
  }



  // module DrawEvents {
  //   export interface Created {
  //     /**
  //      * Layer that was just created.
  //      */
  //     layer: Polygon<any> | Rectangle<any>
  //     /**
  //      * The type of layer this is. One of: polyline, polygon, rectangle, circle, marker
  //      */
  //     layerType: string;
  //   }
    
  //   export interface Edited {
  //     /**
  //      * List of all layers just edited on the map.
  //      */
  //     layers: LayerGroup<any>;
  //   }
    
  //   export interface Deleted {
  //     /**
  //      * List of all layers just removed from the map.
  //      */
  //     layers:  L.LayerGroup<L.Layer>;
  //   }
    
  //   export interface DrawStart {
  //     /**
  //      * The type of layer this is. One of: polyline, polygon, rectangle, circle, marker
  //      */
  //     layerType: string;
  //   }
    
  //   export interface DrawStop {
  //     /**
  //      * The type of layer this is. One of: polyline, polygon, rectangle, circle, marker
  //      */
  //     layerType: string;
  //   }
  // }
}

export type Proj4GeoJSONFeature = geojson.Feature<geojson.GeometryObject> & {
  crs?: { type: string; properties: { name: string } }
};