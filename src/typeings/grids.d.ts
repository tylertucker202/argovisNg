export interface GridGroup {
  disabled?: boolean;
  value: string;
  viewValue: string;
  }

export interface ProducerGroup {
  producer: string;
  grids: GridGroup[]
  }
  
export interface ParamGroup {
  param: string;
  producers: ProducerGroup[]
}

export interface GridRange {
  latMin: number,
  latMax: number,
  lonMin: number,
  lonMax: number,
  }