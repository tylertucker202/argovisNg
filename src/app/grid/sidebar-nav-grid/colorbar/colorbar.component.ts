import { HEX_COLOR_MAPS } from './../../../profview/colormap.parameters';
import { Component, OnInit } from '@angular/core'
import { QueryGridService } from '../../query-grid.service';
import * as chroma from 'chroma'
import 'd3'
import 'd3-scale'
declare let d3: any
import { ChromaStatic } from 'chroma-js';
declare const chroma: ChromaStatic
@Component({
  selector: 'app-colorbar',
  templateUrl: './colorbar.component.html',
  styleUrls: ['./colorbar.component.css']
})
export class ColorbarComponent implements OnInit {
  public colorScale: string
  public colorArr: string[]
  public inverseColorScale: boolean
  public domain: number[]
  public cbrange: number[]
  public cbarShift: string
  public ticks: number
  public rectHeight: number
  public svgHeight: number
  public svgWidth: string
  public svg: any

  constructor( private queryGridService: QueryGridService ) { }

  ngOnInit() {
    this.domain = this.queryGridService.getGridDomain()
    this.cbrange = [0, 200] //pxls for colorbar
    this.ticks = 5;
    this.rectHeight = 20
    this.svgHeight = 50
    this.svgWidth = '95%'
    this.cbarShift = "10"
    this.colorScale = this.queryGridService.getColorScale()
    this.inverseColorScale = this.queryGridService.getInverseColorScale()
    this.colorArr = HEX_COLOR_MAPS[this.colorScale.toLowerCase()]
    if ( this.inverseColorScale ) { this.create_colorbar(this.colorArr.slice().reverse(),this.domain.slice().reverse()) }
    else { this.create_colorbar(this.colorArr.slice(), this.domain.slice()) }

    this.queryGridService.change
      .subscribe(msg => {
        this.update_colorbar()
        })
    
    this.queryGridService.update_colorbarEvent
      .subscribe(msg => {
        this.update_colorbar()
      })

    this.queryGridService.resetToStart
      .subscribe(msg => {
        this.update_colorbar()
      })
  }

  public update_colorbar() {
    this.colorScale = this.queryGridService.getColorScale()
    this.domain = this.queryGridService.getGridDomain()
    this.inverseColorScale = this.queryGridService.getInverseColorScale()
    this.colorArr = HEX_COLOR_MAPS[this.colorScale.toLowerCase()]
    this.svg.remove();
    if ( this.inverseColorScale ) { this.create_colorbar(this.colorArr.slice().reverse(),this.domain.slice().reverse()) }
    else { this.create_colorbar(this.colorArr.slice(), this.domain.slice()) }
  }

  public create_colorbar(colorArr: string[], domain: number[]) {

    this.svg = d3.select("app-colorbar").append("svg")
    .attr("width", this.svgWidth)
    .attr("height", this.svgHeight)

    let defs = this.svg.append("defs");

    //Append a linearGradient element to the defs and give it a unique id
    let linearGradient = defs.append("linearGradient")
      .attr("id", "linear-gradient");
    linearGradient
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    //A color scale
    const c = d3.scaleLinear().range(colorArr).domain(domain.sort()).nice();
    
    //Append multiple color stops by using D3's data/enter step
    linearGradient.selectAll("stop")
      .data( c.range() )
      .enter().append("stop")
      .attr("offset", function(d,i) { return i/(c.range().length-1); })
      .attr("stop-color", function(d) { return d; });

    //Draw the rectangle and fill with gradient
    this.svg.append("rect")
      .attr("width", this.cbrange[1])
      .attr("height", this.rectHeight)
      .attr("x", this.cbarShift)
      .style("fill", "url(#linear-gradient)");
    // //create tick marks
    const scale = d3.scaleLinear()
    .domain(c.domain()).range(this.cbrange).nice()

    const axis = d3.axisBottom().scale(scale).ticks(this.ticks);

    this.svg.append("g")
        .attr("id", "g-runoff")
        .attr("transform", "translate("+this.cbarShift+",20)")
        .call(axis);
    }

  public min_change(val: number ): void {
    const lRange = Number(val).valueOf() //newLowPres is somehow cast as a string. this converts it to a number.
    const uRange = this.domain.sort()[1]
    this.domain = [lRange, uRange]
    const broadcastChange = true
    this.queryGridService.sendGridDomain(lRange, uRange, broadcastChange)
  }

  public max_change(val: number ): void {
    const uRange = Number(val).valueOf(); //newUpPres is somehow cast as a string. this converts it to a number.
    const lRange = this.domain.sort()[0]
    this.domain = [lRange, uRange];
    const broadcastChange = true
    this.queryGridService.sendGridDomain(lRange, uRange, broadcastChange)
  }
  

}
