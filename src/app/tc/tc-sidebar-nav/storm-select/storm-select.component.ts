import { TcQueryService } from './../../tc-query.service';
import { Observable } from 'rxjs';
import { TcTrackService } from './../../tc-track.service';
import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-storm-select',
  templateUrl: './storm-select.component.html',
  styleUrls: ['./storm-select.component.css']
})
export class StormSelectComponent implements OnInit {
  
  // public stormNames: string[]
  public stormControl = new FormControl();
  public stormNames: string[]
  public stormYear: string
  public filteredStorms: Observable<string[]>

  constructor(private trackService: TcTrackService, private tcQueryService: TcQueryService) { }

  ngOnInit(): void {
    this.stormYear = this.tcQueryService.get_storm_year()
    this.trackService.get_storm_names().subscribe((stormNames: string[])=> {
      this.stormNames = stormNames
      this.filteredStorms = this.stormControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    const filteredList = this.stormNames.filter(storm => storm.toLowerCase().includes(filterValue));
    return filteredList
  }

  public stormChange(stormNameYear: string): void {
    this.tcQueryService.send_storm_year(stormNameYear)
  }

}
