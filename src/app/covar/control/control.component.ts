import { Component, OnInit, Input } from '@angular/core';
import { CovarService } from '../covar.service'

export interface Projections {
  value: string;
  viewValue: string;
}

export interface ForcastSelections {
  value: boolean;
  viewValue: string;
}

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class controlComponent implements OnInit {

  constructor(private covarService: CovarService) { }
  private projections: Projections[] = [
    {value:"EPSG:3857", viewValue: "Spherical Mercator (EPSG:3857))"},
    {value:"EPSG:4326", viewValue: "Plate Carr\xE9e WGS 84 (EPSG:4326)"},
    {value:"ESRI:54009", viewValue: "Mollweide (ESRI:54009)"},
    {value:"EPSG:3413", viewValue: "NSIDC Polar Stereographic North (EPSG:3413)"},
    {value:"EPSG:3031", viewValue: "Southern Stereographic (EPSG:3031)"},
  ];

  @Input() proj: string;
  @Input() longCovar: boolean;

  public forcastSelections: ForcastSelections[] = [
    {value: true,  viewValue: "140 days"},
    {value: false, viewValue: "60 days"}
  ]


  ngOnInit() {
    this.proj = this.covarService.getProj()
    //this.proj = "EPSG:3857" //todo: find out why map needs to be built with epsg:3857 before turning to others
    this.longCovar = this.covarService.getForcast()
  }

  private mapProjChange(proj: string): void {
    this.covarService.sendProj(proj)
  }

  private forcastChange(longCovar: boolean): void {
    this.covarService.sendForcast(longCovar)
  }

}
