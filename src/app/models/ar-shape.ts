export interface ARShape {
    _id: string
    shapeId: number
    geoLocation: {type: string, coordinates: Array<Array<number>> };
    date: Date
}