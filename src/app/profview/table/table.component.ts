import { Component, OnInit, ViewChild } from '@angular/core'
import { ProfileMeta } from '../profiles'
import { GetProfilesService } from '../get-profiles.service'
import { ProfviewService } from '../profview.service'
import { Observable } from 'rxjs'
import {MatPaginator} from '@angular/material/paginator'
import {MatTableDataSource} from '@angular/material/table'
import {MatSort} from '@angular/material/sort'


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator
  @ViewChild(MatSort, {static: false}) sort: MatSort

  constructor(private getProfileService: GetProfilesService, 
              private profviewService: ProfviewService ) { }
  //private profileMeta: Observable<ProfileMeta[]>
  //private metaColumns: string[] = ["Link to GDAC data", "dac", 'formatted_station_parameters', "date", 'Cycle number', "Positioning system", "Lat", "Lon", "Core Data Mode", "Num. of meas"]

  private metaColumns: string[] = ["_id", "dac", 'formatted_station_parameters', "date",
                                   'cycle_number', "POSITIONING_SYSTEM", "lat", "lon",
                                    "DATA_MODE", "count"]
  private dataSource: any

  ngOnInit(): void {
    this.profviewService.getTestProfileMetadata().subscribe( (profileMeta: ProfileMeta[]) => {
      this.dataSource = new MatTableDataSource()
      this.dataSource.data = profileMeta
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
    },  
    error => {  
      console.log('There was an error while retrieving Posts !!!' + error);  
    })
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


}
