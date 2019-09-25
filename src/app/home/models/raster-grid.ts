export interface RasterGrid {
    _id: string;
    pres: number;
    time: number;
    gridName?: string;
    cellXSize: number | null;
    cellYSize: number | null;
    noDataValue: number | null;
    zs: number[];
    nRows: number;
    nCols: number;
    xllCorner: number;
    yllCorner: number;
}