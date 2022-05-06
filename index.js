let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
let req = new XMLHttpRequest()

let values = []
let baseTemp

let xScale
let yScale
let xAxisScale
let yAxisScale
let minYear
let maxYear

let width = 1200
let height = 500
let padding = 80

var redToBlue = ['#d73027','#f46d43','#fdae61','#fee090','#ffffbf','#e0f3f8','#abd9e9','#74add1','#4575b4'];

let svg = d3.select("svg")
let body = d3.select('body')

let drawCanvas = () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

let generateScales = () => {

    minYear = d3.min(values, (item)=>{
        return item['year']
    })
    maxYear = d3.max(values, (item)=> {
        return item['year']
    })

    xScale = d3
    .scaleLinear()
    .domain([minYear,maxYear+1])
    .range([padding, width-padding])

    yScale = d3
    .scaleTime()
    .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
    .range([padding, height-padding])
    
}

let generateAxes = () => {
    let xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d')).tickSize(4)
    let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%B')).tickSize(0)

    svg.append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform','translate(0, '+ (height-padding) +')')

    svg.append('g')
    .call(yAxis)
    .attr('id','y-axis')
    .attr('transform', 'translate (' + padding + ', +13)')
    
}

let drawCells = () => {
    let tooltip = body.append('div')
    .attr('id','tooltip')
    

    svg.selectAll('rect')
    .data(values)
    .enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('id', 'cell')
    .attr('fill', (item) => {
        if(item['variance'] <= -6){
            return redToBlue[8];
        } else if (item['variance'] <= -4){
            return redToBlue[7];
        } else if (item['variance'] <= -3){
            return redToBlue[6];
        } else if (item['variance'] <= -2){
            return redToBlue[5];
        }else if (item['variance'] <= -1){
            return redToBlue[4];
        }else if (item['variance'] <= 0){
            return redToBlue[3];
        }else if (item['variance'] <= 1){
            return redToBlue[2];
        }else if (item['variance'] <= 3){
            return redToBlue[1];
        } else {
            return redToBlue[0];
            }
        })
    .attr('data-year', (item)=> {
        return item['year']
    })
    .attr('data-month', (item)=> {
        return item['month'] -1
    })
    .attr('data-temp', (item)=> {
        return (baseTemp + item['variance']);
    })
    .attr('height', (height - (2*padding)) /12 +0.5)
    
    .attr('y', (item)=> {
        return yScale(new Date(0, item['month']-1, 0,0,0,0,0))
    })
    .attr('width', (item)=>{
        let numOfYears = maxYear-minYear
        return (width - 2*padding)/numOfYears
    })
    .attr('x', (item) => {
        return xScale(item['year'])
    })
    .on('mouseover', (item)=> {
        let calculatedTemp = baseTemp + item['variance'];
        let temperature = Math.round(calculatedTemp*100)/100;
        tooltip.attr("data-year", item["year"])
        tooltip.transition()
        .style('visibility', 'visible')
        if(item['month'] == '1'){tooltip.html("January " + item['year'] + "&#10;Variance " + Math.round(item['variance']*100)/100 + "&#10;Temperature " + temperature)}
        if(item['month'] == '2'){tooltip.html("February " + item['year'] + "&#10;Variance " + Math.round(item['variance']*100)/100 + "&#10;Temperature " + temperature)}
        if(item['month'] == '3'){tooltip.html("March " + item['year'] + "&#10;Variance " + Math.round(item['variance']*100)/100 + "&#10;Temperature " + temperature)}
        if(item['month'] == '4'){tooltip.html("April " + item['year'] + "&#10;Variance " + Math.round(item['variance']*100)/100 + "&#10;Temperature " + temperature)}
        if(item['month'] == '5'){tooltip.html("May " + item['year'] + "&#10;Variance " + Math.round(item['variance']*100)/100 + "&#10;Temperature " + temperature)}
        if(item['month'] == '6'){tooltip.html("June " + item['year'] + "&#10;Variance " + Math.round(item['variance']*100)/100 + "&#10;Temperature " + temperature)}
        if(item['month'] == '7'){tooltip.html("July " + item['year'] + "&#10;Variance " + Math.round(item['variance']*100)/100 + "&#10;Temperature " + temperature)}
        if(item['month'] == '8'){tooltip.html("August " + item['year'] + "&#10;Variance " + Math.round(item['variance']*100)/100 + "&#10;Temperature " + temperature)}
        if(item['month'] == '9'){tooltip.html("September " + item['year'] + "&#10;Variance " + Math.round(item['variance']*100)/100 + "&#10;Temperature " + temperature)}
        if(item['month'] == '10'){tooltip.html("October " + item['year'] + "&#10;Variance " + Math.round(item['variance']*100)/100 + "&#10;Temperature " + temperature)}
        if(item['month'] == '11'){tooltip.html("November " + item['year'] + "&#10;Variance " + Math.round(item['variance']*100)/100 + "&#10;Temperature " + temperature)}
        if(item['month'] == '12'){tooltip.html("December " + item['year'] + "&#10;Variance " + Math.round(item['variance']*100)/100 + "&#10;Temperature " + temperature)}
     })

     .on('mouseout', (item) => {
         tooltip.transition()
         .style("visibility", "hidden")
     })
}


let legend =
    svg.append('svg')
    .attr('id', 'legend')
    .attr('width', '450')
    .attr('height', '100')
    .attr('y', '445')
    .attr('x', 750/2)
    
let gradient = svg.append("defs").append("linearGradient")
    .attr("id", "myGrad")
    .attr("x1", "0%")
    .attr("x2", "100%")
    ;
    gradient.append('stop').attr("offset", "0%").style("stop-color", "#4575b4").style("stop-opacity", 1)    
    gradient.append('stop').attr("offset", "12.5%").style("stop-color", "#74add1").style("stop-opacity", 1)    
    gradient.append('stop').attr("offset", "25%").style("stop-color", "#abd9e9").style("stop-opacity", 1)    
    gradient.append('stop').attr("offset", "37.5%").style("stop-color", "#e0f3f8").style("stop-opacity", 1)    
    gradient.append('stop').attr("offset", "50%").style("stop-color", "#ffffbf").style("stop-opacity", 1)    
    gradient.append('stop').attr("offset", "62.5%").style("stop-color", "#fee090").style("stop-opacity", 1)    
    gradient.append('stop').attr("offset", "75%").style("stop-color", "#fdae61").style("stop-opacity", 1)    
    gradient.append('stop').attr("offset", "87.5%").style("stop-color", "#f46d43").style("stop-opacity", 1)    
    gradient.append('stop').attr("offset", "100%").style("stop-color", "#d73027").style("stop-opacity", 1)    


let generateLegend = () => {
    legend.append('rect').attr('height', '30').attr('width', '450').attr('x', '0').attr('id', 'legend-bar').style('fill', 'yellow');
    legend.append('rect').attr('height', '30').attr('width', '450').attr('x', '0').attr('id', 'legend-bar').style('fill', 'green');
    legend.append('rect').attr('height', '30').attr('width', '450').attr('x', '0').attr('id', 'legend-bar').style('fill', 'blue)');
    legend.append('rect').attr('height', '30').attr('width', '450').attr('x', '0').attr('id', 'legend-bar').style('fill', 'red');
    legend.append('rect').attr('height', '30').attr('width', '450').attr('x', '0').attr('id', 'legend-bar').style('fill', 'url(#myGrad)');
    legend.append('text').text('2°C').attr('y', '45').attr('x', '0')
    legend.append('text').text('14°C').attr('y', '45').attr('x', '415')
    legend.append('text').text('Average Land-Surface Temperature').attr("y", "48").attr("x", "95")
}



req.open("GET", url, true)
req.onload = () => {
    let object = JSON.parse(req.responseText)
    values = object['monthlyVariance']
    baseTemp = object['baseTemperature']
    console.log(values)
    console.log(baseTemp)
    drawCanvas()
    generateScales()
    generateAxes()
    drawCells()
    generateLegend()
}
req.send()