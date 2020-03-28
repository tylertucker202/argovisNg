import { Component, OnInit, ViewChild } from '@angular/core'
import { ProfileMeta } from '../profiles'
import { GetProfilesService } from '../get-profiles.service'
import { QueryProfviewService } from '../query-profview.service'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { MatSort } from '@angular/material/sort'

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator
  @ViewChild(MatSort, {static: false}) sort: MatSort

  constructor(private getProfileService: GetProfilesService, 
              private queryProfviewService: QueryProfviewService ) { }
  private metaColumns: string[] = ["_id", "dac", "date",
                                   'cycle_number', "lat_str", "lon_str",
                                    "DATA_MODE"]
  private dataSource: any
  private platform_number: string
  private statParamKey: string

  ngOnInit(): void {

    this.queryProfviewService.setParamsFromURL()
    this.queryProfviewService.setURL()

    this.platform_number = this.queryProfviewService.platform_number
    this.statParamKey = this.queryProfviewService.statParamKey
    
    this.getProfileService.getPlaformProfileMetaData(this.platform_number).subscribe( (profileMeta: ProfileMeta[]) => {
      profileMeta = this.queryProfviewService.applyFormatting(profileMeta, this.statParamKey)
      const statParams = this.queryProfviewService.makeUniqueStationParameters(profileMeta, this.statParamKey)
      this.dataSource = new MatTableDataSource()
      this.dataSource.data = profileMeta
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
    },  
    error => {  
      console.log('There was an error while retrieving profiles metadata.' + error);  
    })
  }

  private applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
