import { Component, OnInit } from '@angular/core'
import { QueryGridService } from '../../query-grid.service';
import * as chroma from 'chroma'
import 'd3'
import 'd3-scale'

declare let chroma: any
declare let d3: any

@Component({
  selector: 'app-colorbar',
  templateUrl: './colorbar.component.html',
  styleUrls: ['./colorbar.component.css']
})
export class ColorbarComponent implements OnInit {
  private colorScale: string
  private colorArr: string[]
  private domain: number[]
  private cbrange: number[]
  private cbarShift: string
  private ticks: number
  private rectHeight: number
  private svgHeight: number
  private svgWidth: string
  private svg: any

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
    this.colorArr = chroma.brewer[this.colorScale]
    this.createColorbar(this.colorArr, this.domain)

    this.queryGridService.change
      .subscribe(msg => {
        this.updateColorbar()
        })
    
    this.queryGridService.updateColorbar
      .subscribe(msg => {
        this.updateColorbar()
      })

    this.queryGridService.resetToStart
      .subscribe(msg => {
        this.updateColorbar()
      })
  }

  private updateColorbar() {
    this.colorScale = this.queryGridService.getColorScale()
    this.domain = this.queryGridService.getGridDomain()
    //todo: update domain here
    this.colorArr = chroma.brewer[this.colorScale]
    this.svg.remove();
    this.createColorbar(this.colorArr, this.domain)
  }

  private createColorbar(colorArr: string[], domain: number[]) {
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
    const c = d3.scaleLinear().range(colorArr).domain(domain).nice();
    
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

  public minChange(val: number ): void {
    const lRange = Number(val).valueOf() //newLowPres is somehow cast as a string. this converts it to a number.
    this.domain = [lRange, this.domain[1]]
    const broadcastChange = true
    const updateColorbar = false
    this.queryGridService.sendGridDomain(this.domain, broadcastChange, updateColorbar)
  }

  public maxChange(val: number ): void {
    const uRange = Number(val).valueOf(); //newUpPres is somehow cast as a string. this converts it to a number.
    this.domain = [this.domain[0], uRange];
    const broadcastChange = true
    const updateColorbar = false
    this.queryGridService.sendGridDomain(this.domain, broadcastChange, updateColorbar)
  }
  

}
