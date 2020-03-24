import { Point } from 'geojson'

export interface ProfileMeta {
      _id: string;
      nc_url: string,
      position_qc: number,
      cycle_number: number,
      dac: string,
      date: Date,
      date_added?: Date,
      date_qc?: number,
      max_pres?: number,
      bgcMeasKeys?: string[],
      lat: number,
      lon: number,
      platform_number: number,
      geoLocation?: Point,
      station_parameters: string[],
      station_parameters_in_nc?: string[],
      VERTICAL_SAMPLING_SCHEME?: string,
      PI_NAME?: string,
      WMO_INST_TYPE?: string,
      POSITIONING_SYSTEM?: string,
      DATA_MODE?: string,
      PARAMETER_DATA_MODE?: string[],
      DATA_CENTRE?: string,
      DIRECTION?: string,
      PLATFORM_TYPE?: string,
      pres_max_for_TEMP?: number,
      pres_max_for_PSAL?: number,
      pres_min_for_TEMP?: number,
      pres_min_for_PSAL?: number,
      containsBGC?: boolean,
      isDeep?: boolean,
      BASIN?: number, 
      count?: number,
      core_data_mode?: string,
      roundLat?:string,
      roundLon?:string,
      strLat?:string,
      strLon?:string,
      formatted_station_parameters?: string[]
    }

export interface Profile extends ProfileMeta {
    measurements: CoreMeasurements[]
    bgcMeas?: bgcMeasurements[]
}

export interface PlatformMeta {
    _id: number,
    platform_number: number,
    most_recent_date: Date,
    most_recent_date_added: Date,
    number_of_profiles: number,
    POSITIONING_SYSTEM: string,
    PI_NAME: string,
    dac: string
}

export interface BgcProfileData {
    _id: string;
    cycle_number: number;
    date: Date;
    POSITIONING_SYSTEM;
    bgcMeas: bgcMeasurements[]
}

export interface CoreProfileData {
    _id: string;
    cycle_number: number;
    date: Date;
    POSITIONING_SYSTEM;
    measurements: CoreMeasurements[]
}

export interface CoreMeasurements {
    pres: number
    temp?: number | null, 
    psal?: number | null,
}

export interface StationParameters {
    value: string,
    viewValue: string
  }

export interface ColorScaleSelection {
    value: string
    viewValue: string
  }

export interface bgcMeasurements {
    pres?: number | null,
    pres_qc?: number | null,
    temp?: number | null,
    temp_qc?: number | null,
    psal?: number | null,
    psal_qc?: number | null,
    cndc?: number | null,
    cndc_qc?: number | null,
    doxy?: number | null,
    doxy_qc?: number | null,
    chla?: number | null,
    chla_qc?: number | null,
    cdom?: number | null,
    cdom_qc?: number | null,
    nitrate?: number | null,
    nitrate_qc?: number | null,
    bbp700?: number | null,
    bbp700_qc?: number | null,
    down_irradiance412?: number | null,
    down_irradiance412_qc?: number | null,
    down_irradiance443?: number | null,
    down_irradiance443_qc?: number | null,
    down_irradiance490?: number | null,
    down_irradiance490_qc?: number | null,
    downwelling_par?: number | null,
    downwelling_par_qc?: number | null,
}