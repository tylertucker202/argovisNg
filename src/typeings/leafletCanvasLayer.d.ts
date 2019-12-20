declare var module: NodeModule;
interface NodeModule {
  id: string;
}

import 'leaflet';
import * as L from 'leaflet';

declare module 'leaflet' {

  
    export class ScalarField extends Field {
        static fromASCIIGrid(asc: any, scaleFactor: number);
        static fromGeoTIFF(data: any, bandIndex: number);
        static multipleFromGeoTIFF(data, bandIndexes);

        zs: number[];
        grid: number[][];
    }
  
    //export class CanvasLayer extends L.Layer { }

    var CanvasLayer: any
    var canvasLayer: any

    //export class CanvasLayer.Field extends CanvasLayer { }

    //export class CanvasLayer.ScalarField extends CanvasLayer.Field { }



    namespace control {
        var colorBar: any
    }

    export interface ColorBarOptions {
        position: 'bottomleft' | 'topLeft' | 'bottomRight' | 'topRight',
        width: number,
        height: number,
        margin: number,
        background: string,
        textColor: string,
        steps: number,
        decimals: number,
        units: string,
        title: string,
        labels: number[], // empty for no labels
        textLabels: string[], // empty for default labels. Custom labels ej: ['low', 'mid','high'] 
        labelFontSize: number,
        labelTextPosition: 'middle' | 'start' | 'end' // start | middle | end
    }


    export default class Field {
        constructor(params: any);
        numCells(): number;
        getCells(stride: any);
        setFilter(f);
        setSpatialMask(m);
        extent()
        contains(lon, lat)
        notContains(lon, lat)
        interpolatedValueAt(lon, lat)
        interpolatedValueAtIndexes(i, j)
        valueAt(lon, lat)
        hasValueAt(lon, lat): boolean;
        notHasValueAt(lon, lat): boolean;
        randomPosition(o);

        nRows: number;
        nColumns: number;
        range: number[];

    }
}
