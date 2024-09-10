import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
/* console.log('Hello world')
let title = document.getElementById("title")
console.log(title) */
console.log(d3)

d3.select("body")
.append("h1")
.attr("id", "title")
.text("Title from D3")

const w = 900;
const h = 700;
const padding = 60

const tooltip = d3.select('body')
.append('div')
.attr('id', 'tooltip')
.text('tooltip')
.style('visibility', 'hidden')
.style('width', 'auto')
.style('height', 'auto')
.style('position', "absolute")
.style('top', '300px')
//.style('left', "350px")


const svg = d3.select("body").append("svg")

svg
    .attr("width", w)
    .attr("height", h)
    
    

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    .then(res => res.json())
    .then(data => {
        const dataset = data.data

        const maxX = d3.max(dataset, (d) => d[0])
        const minX = d3.min(dataset, (d) => d[0])

        const maxY = d3.max(dataset, (d) => d[1] )
        
        const yScale = d3.scaleLinear()
            .domain([0, maxY])
            .range ([0, h - (padding *2)])
            
        console.log(dataset.length-1)
        const xScale = d3.scaleLinear()
            .domain([0, dataset.length -1])
            .range([padding, w - padding])
            

        const xAxisScale = d3.scaleTime()
            .domain([new Date(minX), new Date(maxX)])
            .range([padding, w - padding])
            
      
            
        const yAxisScale = d3.scaleLinear()
            .domain([0, maxY])
            .range ([ h - padding, padding])
            
            
        const yAxis = d3.axisLeft(yAxisScale)
        const xAxis = d3.axisBottom(xAxisScale)    
            
        
            
            svg.append("g")
            .attr("transform", `translate(${padding} , ${0} )`) 
            .attr("id", "y-axis")
            .call(yAxis)
            
            svg.append("g")
            .call(xAxis)  
            .attr("id", "x-axis")
            .attr("transform", `translate(${0} , ${h-padding} )`) 
            
            
            
            svg.selectAll("rect")
            .data(dataset)
            .join("rect")
            .attr("class", "bar")
            .attr("width", (w - (2*padding)) / dataset.length)
            .attr("data-date", (d) => d[0])
            .attr("data-gdp", (d) => d[1])
            .attr("x", (d, i) => xScale(i))
            .attr("y", (d) => (h - padding) - yScale(d[1]) ) 
            .attr("height", (d) => yScale(d[1]))
            .on('mouseover', (bar) => {
                console.log(bar)
                bar.target.style.fill = "blue"
                
                tooltip.transition()
                .style('visibility', 'visible')
                tooltip
                .style('left', `${bar.clientX}px`)
                .style('top', `${bar.clientY - 50}px`)
                .text(`Date: ${bar.target.dataset.date} \n GDP: ${bar.target.dataset.gdp}`)
                .attr("data-date", bar.target.dataset.date )
            })
            .on('mouseout', (bar)=> {
               bar.target.style.fill = "black"
              console.log("out")
              tooltip.transition()
              .style('visibility', 'hidden')
            })
 

    })