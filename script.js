// variables 
// const purple = [109,76,191,1];
// const orange = [109, 112, 1, 1];
// const grey = [186, 186, 186, 1];
const purple = 'rgba(109,76,191,1)';
const orange = 'rgba(209, 112, 1, 1)';
const grey = 'rgba(186, 186, 186, 1)';
const radius = 0.75;
const arrowPath = "M 0 0 9 6 0 12 0 6";

// margins. They'll control the SVG and Canvas
var margin = { l: 40, r: 15, t: 70, b: 30};
var marginLegend = {t0: 15, t2: 34, t3: 64, l: 12, r: 12};

const width = d3.select('#chart').node().clientWidth - margin.l - margin.r;
const height = d3.select('#chart').node().clientHeight - margin.t - margin.b;

const svg = d3.select("#chart")
    .append('svg')
    .attr('width', width + margin.l + margin.r)
    .attr("height", height + margin.t + margin.b);

const canvas = d3.select('#chart')
    .insert('canvas')
    // .attr('width',width)
    // .attr('height',height)
    .style("margin-top", `${margin.t + 1}px`)
    .style("margin-left", `${margin.l + 1}px`)
    .node();

// make it crisp
canvas.width = 2 * width;
canvas.height = 2 * height;

var contextCanvas = canvas.getContext("2d");

contextCanvas.globalCompositeOperation = 'normal';
contextCanvas.scale(2,2);
contextCanvas.fillStyle = "#F7F2F8";
contextCanvas.fillRect(0,0,width,height);

d3.select('#chart').select('canvas')
    .style('width', `${width}px`)
    .style('height', `${height}px`);

// random data
const companiesNumber = 10109;
const dummyData = [];

function randomIntFromInterval(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function randomDecimal (min,max) {
    return +(Math.random() * (max - min) + min).toFixed(2)
}

for (let i=0; i<companiesNumber; i++) {
    let posY = 1;
    let posX = 0;
    let color = purple;

    const companies0 = 856; 
    const companiesMoreMen = 7853; 
    const companiesMoreWomen = 1400;
    const step1 = companies0;
    const step2 = companies0 + companiesMoreMen;
    // const step3 = 


    if (i>= 0 && i < step1){
        posX = posX;
    } else if (i >= step1 && i < step2){
        posX = randomIntFromInterval(0.1, 50) ;
    } else if (i >= step2 && i < 10109) {
        posX = - (randomIntFromInterval(0.1, 50));
    }
    
    // calculate posY (sum)
    if (i > 0) {
      for (let r=0; r < dummyData.length; r++) {
        if (dummyData[r].x === posX) {
          posY = posY + 1;
        }
      }
    }
    
    // calculate color
    if (posX === 0) {
      color = grey;
    } else if (posX < 0) {
      color = orange;
    };
      
    dummyData.push({
      posX : posX + randomDecimal(0.1, 0.5), // move it a little bit
      posY: posY,
      color: color, 
      x : posX
  })
  }


// draw
const maxY = d3.max(dummyData, (d) => {
    return d.posY
});

const scaleX = d3.scaleLinear().range([0, width]).domain([-60, 60]);
const scaleY = d3.scaleLinear().range([height, 0]).domain([0, 230]).clamp(true);

// groups of SVG (axis, annotation and legend)
svg.append('g').attr('transform', `translate (${margin.l}, ${margin.t})`).attr('class','axis axis-y');
svg.append('g').attr('transform', `translate (${margin.l}, ${margin.t + height})`).attr('class','axis axis-x');
const annotation = svg.append('g').attr('transform', `translate (${margin.l}, ${margin.t})`).attr('class','annotation');
svg.append('g').attr('transform', `translate (${margin.l}, ${marginLegend.t0})`).attr('class','legend');


const svgLegend = svg.select('.legend');
const maxNoGap = d3.max(dummyData, (d) => {
    if (d.x === 0 ){
        return d.posY
    }
});

const maxWomenLess = d3.max(dummyData, (d) => {
    if (d.x > 0 ){
        return d.posY
    }
});

const maxMenLess = d3.max(dummyData, (d) => {
    if (d.x < 0 ){
        return d.posY
    }
})

const legendNoGap = svgLegend.append('g').attr('class', 'noGap');
const legendWomenLess = svgLegend.append('g').attr('class', 'womenLess');
const legendMenLess = svgLegend.append('g').attr('class', 'menLess');


var axisX = d3.axisBottom()
    .scale(scaleX)
    .tickSize([8])
    .tickPadding([8])
    .tickValues([-50, -25, 0, 25, 50]);

var axisY = d3.axisLeft()
    .scale(scaleY)
    .tickPadding([10])
    .tickValues([0, 50, 100, 150, 200])
    .tickSizeInner(-width);

svg
    .select('.axis-y')
    .call(axisY);

svg
    .select('.axis-x')
    .call(axisX);

// random annotation - only part that gets updated
const index = randomIntFromInterval(1, companiesNumber-1);

const highlightCompany = annotation.selectAll('annotatedCompany')
    .data([dummyData[index]]);

const enterCompany = highlightCompany
    .enter()
    .append('g')
    .attr('class', 'annotatedCompany');

// exit
highlightCompany.enter().exit();

// update (to check)
highlightCompany
    .attr('class', 'annotatedCompany');

// back circle
enterCompany
    .append('circle')
    .attr('class', 'annotatedCompany backCircleAnnotation')
    .attr('r', 7)
    .attr('cx', (d) => {
        return scaleX(d.posX)
    })
    .attr('cy', (d) => {
        return scaleY(d.posY)
    });

// highlight circle
enterCompany
    .append('circle')
    .attr('class', 'highlightCircle')
    .attr('r', 3)
    .style('fill', dummyData[index].color)
    .attr('cx', (d) => {
        return scaleX(d.posX)
    })
    .attr('cy', (d) => {
        return scaleY(d.posY)
    });

let breakPointX = 15;
let breakPointY = 180;

drawArrowAnnotation(dummyData[index].posX, dummyData[index].posY, breakPointX, breakPointY); // x pos dot, y pos dot, x pos annotation, y pos annotation

function drawArrowAnnotation (x, y, posX, posY) {

    enterCompany.append("svg:defs").append("svg:marker")
    .attr("id", "arrowAnnotation")
    .attr("refX", 6)
    .attr("refY", 6)
    .attr("markerWidth", 30)
    .attr("markerHeight", 30)
    .attr("orient", "auto")
    .append("path")
    .attr("d", arrowPath);

    // line 
    let sourceX = Math.floor(scaleX(posX)); 
    let targetX = Math.floor(scaleX(x));
    let sourceY = Math.floor(scaleY(posY));
    let targetY = Math.floor(scaleY(y));
    let posX1;
    let posY1;
    const margin = 8;

    if (x === posX && y < posY) {
        sourceY = sourceY - margin;
        targetY = targetY + margin;
    } else if (x === posX && y > posY) {
        sourceY = sourceY + margin;
        targetY = targetY - margin;
    } else if (x > posX && y === posY) {
        sourceX = sourceX + margin;
        targetX = targetX - margin;
    } else if (x < posX && y === posY) {
        sourceX = sourceX - margin;
        targetX = targetX + margin;
    } else if (x > posX && y > posY) {
        console.log('x > posX && y > posY')
        sourceX = sourceX + margin;
        sourceY = sourceY - margin;

        targetX = targetX;
        targetY = targetY - margin;
    } else if (x < posX && y < posY) {
        console.log('done, x < posX && y < posY')
        sourceX = sourceX;
        sourceY = sourceY + margin + 4;

        targetX = targetX + margin + 4;
        targetY = targetY - 4;
    } else if (x > posX && y < posY) {
        console.log('done, x > posX && y < posY')
        sourceX = sourceX + margin + 4;
        sourceY = sourceY;

        targetX = targetX;
        targetY = targetY - margin * 2 + 2;
    } else if (x < posX && y > posY) {
        console.log('x < posX && y > posY')
        sourceX = sourceX - margin - 4;
        sourceY = sourceY;

        targetX = targetX;
        targetY = targetY + margin * 2 - 2;
    }

    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const dr = Math.sqrt(dx * dx + dy * dy);

    const path = "M" + sourceX + "," + sourceY + "A" + dr + "," + dr +
    " 0 0,1 " + targetX + "," + targetY;

    enterCompany
        .append('path')
        .attr("d", path)
        .attr('class', 'annotatedLine')
        .attr("marker-end", "url(#arrowAnnotation)");

    // hide line in case of behind
    const rectWidth = 110;

    enterCompany
        .append('rect')
        .attr('x', (d) => {
            if (posX > 0) {
                return scaleX(posX) + margin
            }

            return scaleX(posX) - margin - rectWidth
        })
        .attr('y', scaleY(posY) - margin*2)
        .attr('width', rectWidth)
        .attr('height', 47)
        .attr('class', 'annotatedRect');

    // annotation dot
    enterCompany
        .append('circle')
        .attr('class', 'annotationCircle')
        .attr('r', 10)
        .attr('cx', scaleX(posX))
        .attr('cy', scaleY(posY))
        .style('fill', (d) => {return d.color});

    // annotation text
    enterCompany
        .append('text')
        .attr('class', 'annotationText')
        .text('This company')
        .attr('x', (d) => {
            if (posX > 0) {
                return scaleX(posX) + margin * 3
            }

            return scaleX(posX) - margin *3
        })
        .attr('y', scaleY(posY))
        .style('text-anchor', (d) => {
            if (posX > 0) {
                return 'start'
            }

            return 'end'
        });

        // annotation text
    enterCompany
        .append('text')
        .attr('class', 'annotationNumber')
        .text(`${x}%`)
        .attr('x', (d) => {
            if (posX > 0) {
                return scaleX(posX) + margin * 3
            }

            return scaleX(posX) - margin *3
        })
        .attr('y', scaleY(posY) + 25)
        .style('text-anchor', (d) => {
            if (posX > 0) {
                return 'start'
            } 

            return 'end'
        })
        
}



if (dummyData[index].posX < 0 ){
    
    breakPointX = -15;
    breakPointY = 180;

}



const breakAxis = svgLegend
    .append('g')
    .attr('class', 'breakAxis')
    .attr('transform', `translate(${width/2 - 5}, ${marginLegend.t3})`);

// break axis
for (let i =0; i<2; i++){
    breakAxis
        .append('line')
        .attr('x1', 0 + i * 8)
        .attr('x2', 8 + i * 8)
        .attr('y1', 0)
        .attr('y2', 14)
}


// arrow 1
legendNoGap.append("svg:defs").append("svg:marker")
    .attr("id", "arrowNoGap")
    .attr("refX", 6)
    .attr("refY", 6)
    .attr("markerWidth", 30)
    .attr("markerHeight", 30)
    .attr("orient", "auto")
    .append("path")
    .attr("d", arrowPath);

legendNoGap.append('line')
    .attr("x1", width/2)
    .attr("y1", 8 )
    .attr("x2", width/2)
    .attr("y2", 8 + 32)          
    .attr("marker-end", "url(#arrowNoGap)");

legendNoGap.append('text')
    .style('text-anchor', 'middle')
    .attr('x', width/2)
    .text('No pay gap: ')
    .append('tspan')
    .text(`${maxNoGap} firms`);

// arrow 2
legendWomenLess.append("svg:defs").append("svg:marker")
    .attr("id", "arrowWomenLess")
    .attr("refX", 6)
    .attr("refY", 6)
    .attr("markerWidth", 30)
    .attr("markerHeight", 30)
    .attr("orient", "auto")
    .append("path")
    .attr("d", arrowPath);

legendWomenLess.append('line')
    .attr("x1", width/2 + 4)
    .attr("y1", marginLegend.t2 + 10)
    .attr("x2", width - 4)
    .attr("y2", marginLegend.t2 + 10)     
    .attr("marker-end", "url(#arrowWomenLess)");

legendWomenLess.append('text')
    .style('text-anchor', 'start')
    .attr('x', width/2 + marginLegend.l)
    .attr('y', marginLegend.t2)
    .text('Women paid less: ')
    .append('tspan')
    .text(`${maxMenLess} firms`);


// arrow 3
legendMenLess.append("svg:defs").append("svg:marker")
    .attr("id", "arrowMenLess")
    .attr("refX", 6)
    .attr("refY", 6)
    .attr("markerWidth", 30)
    .attr("markerHeight", 30)
    .attr("orient", "auto")
    .append("path")
    .attr("d", arrowPath);

legendMenLess.append('line')
    .attr("x1", width/2 - 4)
    .attr("y1", marginLegend.t2 + 10)
    .attr("x2", 4)
    .attr("y2", marginLegend.t2 + 10)     
    .attr("marker-end", "url(#arrowMenLess)");

legendMenLess.append('text')
    .style('text-anchor', 'end')
    .attr('x', width/2 - marginLegend.l)
    .attr('y', marginLegend.t2)
    .text('Men paid less: ')
    .append('tspan')
    .text(`${maxWomenLess} firms`);

// dot histogram in canvas


drawDots ();


function drawDots () {
    contextCanvas.globalCompositeOperation = 'normal';
    contextCanvas.fillStyle = "#F7F2F8";
    contextCanvas.scale(1,1);
    contextCanvas.fillRect(0,0,width,height);

    for (let i=0; i < dummyData.length; i++) {

       //Draw each circle
       contextCanvas.beginPath();
       contextCanvas.fillStyle = dummyData[i].color;
       contextCanvas.arc(scaleX(dummyData[i].posX), scaleY(dummyData[i].posY), radius, 0,  2 * Math.PI);
       contextCanvas.fill();
       contextCanvas.closePath();
    }

  
    // hide dots behind break axis
    contextCanvas.fillStyle = "#F7F2F8";
    contextCanvas.fillRect((width/2 - 8), 8, 20, 15);
}
