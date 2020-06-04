import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ARShape } from '../home/models/ar-shape'
import * as moment from 'moment';
import { mockShapeComplex } from './ar-shape.parameters'
@Injectable({
  providedIn: 'root'
})

export class ArShapeService {

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

}
