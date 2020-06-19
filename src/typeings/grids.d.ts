export interface GridGroup {
  disabled?: boolean;
  param: string;
  grid: string;
  viewValue: string;
  }

export interface ProducerGroup {
  producer: string;
  grids: GridGroup[]
  }
export interface GridParamGroup {
  grid: string;
  param: string;
  viewValue: string;
  params: ModelParam[];
}
export interface MeasGroup {
  meas: string;
  producers: ProducerGroup[] | GridParamGroup[];
}

export interface ModelParam {
  modelParamName: string;
  viewValue: string;
}

export interface AvailableParams {
  param: string;
  viewValue: string;
}

export interface GridRange {
  latMin: number,
  latMax: number,
  lonMin: number,
  lonMax: number,
  }

export interface ColorScaleGroup {
  colorScale: string,
  viewValue: string
}

export interface GridMeta {
  _id: string,
  presLevels: number[]
}


