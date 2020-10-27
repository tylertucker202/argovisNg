import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ARShape } from '../models/ar-shape'
import * as moment from 'moment';
import { mockTcShape } from './tc-shape.parameters'
@Injectable({
  providedIn: 'root'
})
export class TcShapeService {

  private mockTcShape: ARShape = mockTcShape
  constructor(private http: HttpClient) { }

  public get_mock_shape(date: moment.Moment): Observable<ARShape[]> {
    return of([this.mockTcShape])
  }

  public get_tc_shapes(dateString: string): Observable<ARShape[]> {
    let url = ''
    url += '/arShapes/findByDate?date='+dateString;
    return this.http.get<ARShape[]>(url)
  }
}