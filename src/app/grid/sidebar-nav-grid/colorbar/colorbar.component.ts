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
  private range: number[]
  private ticks: number
  private rectHeight: number
  private svgHeight: number
  private svgWidth: string
  private svg: any

  constructor( private queryGridService: QueryGridService ) { }

  ngOnInit() {
    this.domain = this.queryGridService.getGridRange()
    this.range = [0, 200] //pxls for colorbar
    this.ticks = 5;
    this.rectHeight = 20
    this.svgHeight = 100
    this.svgWidth = '95%'
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
    this.domain = this.queryGridService.getGridRange()
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
    let c = d3.scaleLinear().range(colorArr).domain(domain).nice();
    
    //Append multiple color stops by using D3's data/enter step
    linearGradient.selectAll("stop")
      .data( c.range() )
      .enter().append("stop")
      .attr("offset", function(d,i) { return i/(c.range().length-1); })
      .attr("stop-color", function(d) { return d; });

    //Draw the rectangle and fill with gradient
    this.svg.append("rect")
      .attr("width", this.range[1])
      .attr("height", this.rectHeight)
      .style("fill", "url(#linear-gradient)");
    // //create tick marks
    let scale = d3.scaleLinear()
    .domain(c.domain()).range(this.range).nice()

    let axis = d3.axisBottom().scale(scale).ticks(this.ticks);

    this.svg.append("g")
        .attr("id", "g-runoff")
        .attr("transform", "translate(0,20)")
        .call(axis);
    }

  private clicked(event: any): void {
    console.log('that tickles', event.target, event.x, event.y)
  }
  

}
