declare var module: NodeModule;
interface NodeModule {
  id: string;
}

import 'leaflet';
import 'leaflet-canvaslayer-field'
import * as L from 'leaflet';

declare module 'leaflet' {

    export class ScalarField extends Field {
        static fromASCIIGrid(asc: any, scaleFactor: number);
        static fromGeoTIFF(data: any, bandIndex: number);
        static multipleFromGeoTIFF(data, bandIndexes);

        zs: number[];
        grid: number[][];

        //optional parameters for RasterGrid and RasterParam:
        gridName?: string;
        units?: string;
        measurement?: string;
        param?: string;
    }
  
    var canvasLayer: any;

    export default class Field extends L.Layer {
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
