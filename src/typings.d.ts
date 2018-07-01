/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

import 'leaflet';
import 'leaflet-draw';
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

  module DrawEvents {
    export interface Created {
      /**
       * Layer that was just created.
       */
      layer: L.Layer;
      /**
       * The type of layer this is. One of: polyline, polygon, rectangle, circle, marker
       */
      layerType: string;
    }
    
    export interface Edited {
      /**
       * List of all layers just edited on the map.
       */
      layers: L.LayerGroup<L.Layer>;
    }
    
    export interface Deleted {
      /**
       * List of all layers just removed from the map.
       */
      layers:  L.LayerGroup<L.Layer>;
    }
    
    export interface DrawStart {
      /**
       * The type of layer this is. One of: polyline, polygon, rectangle, circle, marker
       */
      layerType: string;
    }
    
    export interface DrawStop {
      /**
       * The type of layer this is. One of: polyline, polygon, rectangle, circle, marker
       */
      layerType: string;
    }
  }
}