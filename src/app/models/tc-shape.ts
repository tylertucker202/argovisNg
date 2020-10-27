export interface TcShape {
    _id: string
    shapeId: number
    geoLocation: {type: string, coordinates: Array<Array<number>> };
    date: Date
}