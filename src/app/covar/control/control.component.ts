import { Component, OnInit, Input } from '@angular/core';
import { CovarService } from '../covar.service'

export interface Projections {
  value: string;
  viewValue: string;
}

export interface ForcastSelections {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit {

  constructor(private covarService: CovarService) { }
  private projections: Projections[] = [
    {value:"EPSG:3857", viewValue: "Spherical Mercator (EPSG:3857))"},
    {value:"EPSG:4326", viewValue: "Plate Carr\xE9e WGS 84 (EPSG:4326)"},
    {value:"ESRI:54009", viewValue: "Mollweide (ESRI:54009)"},
    {value:"EPSG:3413", viewValue: "NSIDC Polar Stereographic North (EPSG:3413)"},
    {value:"EPSG:3031", viewValue: "Southern Stereographic (EPSG:3031)"},
  ];

  @Input() proj: string;
  @Input() forcastDays: number;

  public forcasts: ForcastSelections[] = [
    {value: 60, viewValue: "60 days"},
    {value: 120, viewValue: "120 days"},
    {value: 140,  viewValue: "140 days"},
    {value: 240, viewValue: "240 days"},
    {value: 360, viewValue: "360 days"},
    {value: 480, viewValue: "480 days"},
    {value: 720, viewValue: "720 days"},
    {value: 840, viewValue: "840 days"},
    {value: 960, viewValue: "960 days"},
    {value: 1080, viewValue: "1080 days"},
    {value: 1200, viewValue: "1200 days"},
    {value: 1320, viewValue: "1320 days"},
    {value: 1440, viewValue: "1440 days"},
    {value: 1560, viewValue: "1560 days"},
    {value: 1680, viewValue: "1680 days"},
    {value: 1800, viewValue: "1800 days"},
  ]


  ngOnInit() {
    this.proj = this.covarService.getProj()
    this.forcastDays = this.covarService.getForcast()
  }

  private mapProjChange(proj: string): void {
    this.covarService.sendProj(proj)
  }

  private forcastChange(forcastDays: number): void {
    this.covarService.sendForcast(forcastDays)
  }

}
