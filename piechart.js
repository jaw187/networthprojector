////////////////////
// OPTIONS
////////////////////

var pieChart;

// pie chart //
function buildPieChart(results){

  // create pichart object.. easily adjust configuration here
  pieChart = {

    "properties" : { 
      "indebt":{"label":"Debt"},
      "instock":{"label":"In Stock"},
      "inrealestate":{"label":"In Real Estate"}
    },
    
    "layout": {
      "container":"piechart_container",
      "width": 700,
      "height": 450,
      "radius" : 0,
      "color" : d3.scale.category20()
    },

    "math":{
      "pie" : null,
      "arc" : null
    },

    "dom":{},
    "chart":{},
    "data":{}
  },
  
  pcLayout = pieChart.layout,
  pcMath = pieChart.math,
  pcDom = pieChart.dom,
  pcChart = pieChart.chart;

  pcLayout.radius = Math.min(pcLayout.width,pcLayout.height/2);
  
  pcMath.arc = d3.svg.arc()
                .innerRadius(pcLayout.radius - 100)
                .outerRadius(pcLayout.radius - 20);

  pcMath.pie = d3.layout.pie()
                .value(function(d) { return d["value"]; })
                .sort(null);

  pcDom.container = d3.select("#" + pcLayout.container);

  var data = parsePieData(results);

  pcDom.d_svg = pcDom.container.append("svg")
    .attr("width", pcLayout.width)
    .attr("height", pcLayout.height)
  .append("g")
    .attr("transform", "translate(" + pcLayout.width / 2 + "," + pcLayout.height / 2 + ")");

  pcChart.path = pcDom.d_svg.datum(data).selectAll("path")
      .data(pcMath.pie)
    .enter().append("path")
      .attr("fill", function(d, i) { return pcLayout.color(i); })
      .attr("d", pcMath.arc)
      .on("mouseover",function(d,i){

        // here is a simple transition
        d3.select(this)
          .transition().attr({
            "stroke-width": 8,
            "stroke":"red"
          })
          //promote svg
          
      })
      .on("mouseout",function(d,i){

        d3.select(this)
          .transition().attr({
            "stroke-width": 0,
            "stroke":"#ffffff"
          })
      })

      .each(function(d) {this._current = d; });

  pcChart.legend = pcDom.d_svg.datum([1,2,3]).selectAll("text")
    .data(data)
      .enter()
      .append("text")
    //.attr("transform", function(d) { return "translate(" + pieChart.math.arc.centroid(d) + ")"; })
      .attr("dx", -(pcLayout.width/2))
      .attr("dy", function(d,i){return ""+((160)+(+i * 30) )+""} )
      .attr("font-size","28")
      .text(function(d) { return d.label + " : " + d3.round(+d.value,2) + "%"; })
      .attr("fill",function(d, i) { return pcLayout.color(i); })
      .on("mouseover",function(a,b){

      })
      .on("click", function (d) {
          alert(d.value);
      })
}

function updatePieChart(results){

    console.log('...update chart...');
    
    var pcChart = pieChart.chart,
        pcMath = pieChart.math,
        pcDom = pieChart.dom,

        data = parsePieData(results);

    pcMath.pie.value(function(d) { return d["value"]; }); // change the value function
    
    pcDom.d_svg
      .datum(data)
      .selectAll("path")
        .data(pcMath.pie)
        .transition().duration(750).attrTween("d", arcTween); // redraw the arcs

    pcChart.legend.data(data)
      .transition()
      .text(function(d) { return pieChart.properties[d.label].label + " : " + d3.round(+d.value,2) + "%" })
}

function parsePieData(results){

  // this can be refractored with 
  var pieData = [];
  
    $.each(pieChart.properties,function(i,prop){
      
      var property = {};
      property.value = +results[i];
      property.label = i;

      pieData.push(property);
      
    });

  pieChart.data = pieData;
  return pieData;

}

// Store the displayed angles in _current.
// Then, interpolate from _current to the new angles.
// During the transition, _current is updated in-place by d3.interpolate.
function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return pieChart.math.arc(i(t));
  };
}