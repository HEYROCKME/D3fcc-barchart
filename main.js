import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Chart Setup
const w = 900;
const h = 700;
const padding = 60

// Add title to the document body
d3.select("body")
    .append("h1")
    .attr("id", "title")
    .text("Title from D3")

// Tooltip init
const tooltip = d3.select('body')
    .append('div')
    .attr('id', 'tooltip')
    .text('tooltip')
    .style('visibility', 'hidden')
    .style('width', 'auto')
    .style('height', 'auto')
    .style('position', "absolute")
    .style('top', '300px')

// SVG chart    
const svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    
    
// Get data from server
fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    .then(res => res.json())
    .then(data => {
        const dataset = data.data
        // Extract max and min values from the data
        const maxX = d3.max(dataset, (d) => d[0])
        const minX = d3.min(dataset, (d) => d[0])
        const maxY = d3.max(dataset, (d) => d[1] )
        
        // Scale the height (on the y-axis) for the displayed data  
        const yScale = d3.scaleLinear()
            .domain([0, maxY]) // Sets the boundries of the data
            .range ([0, h - (padding *2)]) // Sets the range for the display
            
        // Scale the width of the displayed data
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