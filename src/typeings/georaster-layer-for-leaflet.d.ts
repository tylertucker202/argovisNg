import {GridLayer, GridLayerOptions} from 'leaflet';


export class GeoRasterLayer extends GridLayer {
    constructor(options?: GeoRasterLayerOptions)
    projection: number;
    rasters: any;
    scale: any;
    georaster: any;
    pixelValuesToColorFn?: any;
    resolution?: number;

}

export interface GeoRasterLayerOptions extends GridLayerOptions {

}