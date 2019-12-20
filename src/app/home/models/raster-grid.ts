export interface BaseRaster {
    _id: string;
    pres: number;
    cellXSize: number | null;
    cellYSize: number | null;
    noDataValue: number | null;
    zs: number[];
    nRows: number;
    nCols: number;
    xllCorner: number;
    yllCorner: number;
    gridName?: string;
    units?: string;
    measurement?: string;
    param?: string;
}

export interface RasterGrid extends BaseRaster {
    time: number;
}

export interface RasterParam extends BaseRaster {

}