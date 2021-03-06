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
    date?: string;
}

export interface RasterParam extends BaseRaster {

}

export interface GridCell {
    lat: number, 
    lon: number, 
    value: number
  }  

export interface GridCoords {
  _id?: null, 
  lats: number[],
  lons: number[],
  gridName: string
}

export interface Grid {
    _id: string, 
    pres: number, 
    chunks: number[], 
    measurement: string,
    param: string,
    date: string, 
    units: string, 
    NODATA_value: number | null, 
    variable: string, 
    gridName: string, 
    data: GridCell[] | any
  }