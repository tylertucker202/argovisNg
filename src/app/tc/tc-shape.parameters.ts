import { TcShape } from '../models/tc-shape'

export const mockTcShape: TcShape = {
    _id: "1_262992.0",
    shapeId: 1,
    geoLocation: {
      "type" : "Polygon",
      "coordinates" : [[-5, -5],[-5, 5],[5, 5],[5, -5],[-5,-5]]
    },
    date: new Date("2010-01-01T00:00:00Z")
  }