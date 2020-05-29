
import { Component, OnInit, Input, AfterViewInit, OnChanges, EventEmitter, Output  } from '@angular/core'
import { ChartService } from '../chart.service'
import 'd3'
import 'd3-scale'

declare let chroma: any
declare let d3: any

@Component({
  selector: 'app-colorbar',
  templateUrl: './colorbar.component.html',
  styleUrls: ['./colorbar.component.css']
})
export class ColorbarComponent implements OnInit, AfterViewInit, OnChanges {
  private cbrange: number[]
  private cbarShift: string
  private ticks: number
  private rectHeight: number
  private svgHeight: number
  private svgWidth: string
  private svg: any
  @Input() axis: string;
  @Input() domain: [number, number]
  @Input() colorscale: [number, string][]
  private colorbarId: string
  private inverseColorScale: boolean = false
  @Output() domainChange = new EventEmitter<[number, number]>()
  constructor( private chartService: ChartService ) { }

  ngOnInit() {
    this.colorbarId = this.axis + "Colorbar"
    this.cbrange = [0, 80] //pxls for colorbar
    this.ticks = 3;
    this.rectHeight = 20
    this.svgHeight = 50
    this.svgWidth = '100%'
    this.cbarShift = "10"
    // console.log('axis: ', this.axis)
    // console.log('colorscale:', this.colorscale)
  }

  ngAfterViewInit() {
    if ( this.inverseColorScale ) { this.createColorbar(this.colorscale.slice().reverse(),this.domain.slice().reverse()) }
    else { this.createColorbar(this.colorscale.slice(), this.domain.slice()) }
  }

  ngOnChanges() {
    this.updateColorbar()
  }

  private updateColorbar() {
    if (this.svg) {
      this.svg.remove();
      if ( this.inverseColorScale ) { this.createColorbar(this.colorscale.slice().reverse(),this.domain.slice().reverse()) }
      else { this.createColorbar(this.colorscale.slice(), this.domain.slice()) }
    }
  }

  private createColorbar(colorscale: string[] | [number, string][], domain: number[]) {
    this.svg = d3.select("#" + this.colorbarId).append("svg")
    .attr("width", this.svgWidth)
    .attr("height", this.svgHeight)
    .style("position", "inherit")

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
    let cvalues = []
    colorscale.forEach( value => {
      cvalues.push(value[1])
    })
    const c = d3.scaleLinear().range( cvalues ).domain(domain.sort()).nice();
    
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
    const uRange = this.domain.sort()[1]
    this.domain = [lRange, uRange]
    this.updateColorbar()
    this.domainChange.emit(this.domain)
  }

  public maxChange(val: number ): void {
    const uRange = Number(val).valueOf(); //newUpPres is somehow cast as a string. this converts it to a number.
    const lRange = this.domain.sort()[0]
    this.domain = [lRange, uRange];
    console.log('max change:', this.domain)
    this.updateColorbar()
    this.domainChange.emit(this.domain)
  }
  

}
