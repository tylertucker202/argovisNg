export interface GridGroup {
  disabled?: boolean;
  grid: string;
  viewValue: string;
  }

export interface ProducerGroup {
  producer: string;
  grids: GridGroup[]
  }
  
export interface MeasGroup {
  param: string;
  producers: ProducerGroup[] | GridParamGroup[];
}

export interface GridParamGroup {
  grid: string;
  viewValue: string;
  params: string[];
}

export interface GridRange {
  latMin: number,
  latMax: number,
  lonMin: number,
  lonMax: number,
  }