export interface ProfilePoints {
    _id: string;
    platform_number: string;
    date: string;
    geoLocation: {type: string, coordinates: Array<Number> };
    cycle_number: Number;
    roundLat: string;
    roundLon: string;
    strLat: string;
    strLon: string;
}
