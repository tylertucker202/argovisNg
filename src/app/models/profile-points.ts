export interface ProfilePoints {
    _id: string;
    platform_number: string;
    date: string;
    geoLocation: {type: string, coordinates: Array<Number> };
    cycle_number: Number;
    roundLat?: any;
    roundLon?: any;
    strLat?: any;
    strLon?: any;
}
