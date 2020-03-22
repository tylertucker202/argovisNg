import { Component, OnInit, ViewChild } from '@angular/core'
import { ProfileMeta } from '../profiles'
import { GetProfilesService } from '../get-profiles.service'
import { ProfviewService } from '../profview.service'
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
  private metaColumns: string[] = ["_id", "dac", 'float_measurements', "date",
                                   'cycle_number', "POSITIONING_SYSTEM", "lat_str", "lon_str",
                                    "DATA_MODE"]
  private dataSource: any
  private bgcTable: boolean = true

  ngOnInit(): void {
    let statKey = 'station_parameters'
    if(this.bgcTable) { statKey = 'bgcMeasKeys'}
    this.profviewService.getTestPlatformSelectionMetadata().subscribe( (profileMeta: ProfileMeta[]) => {

      profileMeta = this.profviewService.applyFormatting(profileMeta, statKey)

      this.dataSource = new MatTableDataSource()
      this.dataSource.data = profileMeta
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
    },  
    error => {  
      console.log('There was an error while retrieving Posts !!!' + error);  
    })
  }

  private applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
