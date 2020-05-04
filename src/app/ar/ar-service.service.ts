import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ARShape } from '../home/models/ar-shape'
import * as moment from 'moment';
import { mockShapeComplex } from './ar-service.parameters'
@Injectable({
  providedIn: 'root'
})
export class ArServiceService {
  private mockShapeSimple: ARShape = {
    _id: "1_262992.0",
    shapeId: 1,
    geoLocation: {
      "type" : "Polygon",
      "coordinates" : [[-5, -5],[-5, 5],[5, 5],[5, -5],[-5,-5]]
    },
    date: new Date("2010-01-01T00:00:00Z")
  }

  private mockShapeComplex: ARShape = mockShapeComplex

  constructor(private http: HttpClient) { }

  public getMockShape(date: moment.Moment): Observable<ARShape[]> {
    return of([this.mockShapeComplex])
  }

  public getArShapes(dateString: string): Observable<ARShape[]> {
    let url = ''
    url += '/arShapes/findByDate?date='+dateString;
    return this.http.get<ARShape[]>(url)
  }

  public swapCoords(shape: number[][]): number[][] {
    //takes [lng lat] array and transforms it into a [lat lng] nested array 
    const ts = shape.map(coord => ([coord[1], coord[0]]))
    return(ts)
  }
}
