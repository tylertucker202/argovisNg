export interface TcTrack {
	_id : string,
	name : string,
	num : number,
	source : string,
    traj_data : TrajData[]
    startDate?: Date,
    endDate?: Date,
}

export interface TrajData {
    time: number
    date: string
    l?: string
    class?: string
    lat: number
    lon: number
    wind?: number
    pres?: number
    year?: number
    timestamp: Date
    geoLocation: {type: string, coordinates: Array<number> };
}

export interface TcTrajTrack {
    _id: string
    time: number
    name: string
    num: number
    date: string
    l?: string
    class?: string
    lat: number
    lon: number
    wind?: number
    pres?: number
    year?: number
    timestamp: Date
    source: string
    geoLocation: {type: string, coordinates: Array<number> };
}