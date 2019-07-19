import { Injectable, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'


@Injectable({
  providedIn: 'root'
})
export class CovarService {

  constructor(private route: ActivatedRoute,
              private router: Router) {
                this.router.urlUpdateStrategy = 'eager'
              }

  @Output() change: EventEmitter<string> = new EventEmitter
  private proj = 'EPSG:3857';
  private longCovar = false;
  private lngLat: number[];

  public readURLParams(): void {
      this.route.queryParams.subscribe(params => {
        Object.keys(params).forEach(key => {
          this.setMapState(key, params[key])
        });
      });
  }

  public setURL(): void {

    let lngLatString = null
    if (this.lngLat) {
      lngLatString = JSON.stringify(this.lngLat)
    }
    const longCovarString=JSON.stringify(this.longCovar)
    let queryParams = {
                         'longCovar': longCovarString, 
                         'proj': this.proj,
                         'lngLat': lngLatString,
                        }


    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: queryParams,
      });
  }

  public setMapState(this, key: string, value: string): void {
    const notifyChange = false
    switch(key) {
      case 'longCovar': {
        const longCovar = JSON.parse(value)
        this.sendForcast(longCovar, notifyChange)
        break;
      }
      case 'proj': {
        this.sendProj(value, notifyChange)
        break;
      }
      case 'lngLat': {
        const lngLat = JSON.parse(value)
        this.sendLngLat(lngLat, notifyChange)
        break;
      }
      default: {
        console.log('key not found. not doing anything')
        break;
    }
  }
}


  public getProj(): string {
    return this.proj
  }

  public sendProj(proj: string, notifyChange=true): void {
    if (proj !== this.proj) {
      this.proj = proj;
    }
    if (notifyChange) {
      this.change.emit('proj changed');
    }
  }

  public getForcast(): boolean {
    return this.longCovar;
  }

  public sendForcast(longCovar: boolean, notifyChange=true): void {
    if (longCovar !== this.longCovar) {
      this.longCovar = longCovar;
    }
    if (notifyChange) {
      this.change.emit('long Covar Changed');
    }
  }

  public getLngLat(): number[] {
    return this.lngLat
  }

  public sendLngLat(lngLat: number[], notifyChange=true): void {
    if (lngLat !== this.lngLat) {
      this.lngLat = lngLat;
    }
    if (notifyChange) {
      this.change.emit('lngLat changed');
    }
  }

}
