  ////////////////////
  // OPTIONS
  ////////////////////

function pieChart() {
  // pie chart //
  function buildPieChart(results) {

    // create pichart object.. easily adjust configuration here
    pc = {

      "properties" : { 
        "indebt":{"label":"Debt"},
        "instock":{"label":"In Stock"},
        "inrealestate":{"label":"In Real Estate"}
      },
      
      "layout": {
        "container":"piechart_container",
        "radius" : 200,
        "color" : function (i) {
          var colors = ["#D6C64B", "#02A1D1", "#CC0202"];
          if (i > -1 && i < colors.length) {
            return colors[i];
          }

          return "#000";
        }
      },

      "math":{
        "pie" : null,
        "arc" : null
      },

      "dom":{},
      "chart":{},
      "data":{}
    }

    pc.layout.width = pc.layout.radius * 2;
    pc.layout.height = pc.layout.radius * 2;
    
    pcLayout = pc.layout,
    pcMath = pc.math,
    pcDom = pc.dom,
    pcChart = pc.chart;
    
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
        .attr("fill", function(d, i) { console.log("fill function",i); return pcLayout.color(i); })
        .attr("d", pcMath.arc)
        .on("mouseover",function(d,i){

          // here is a simple transition
          d3.select(this)
            .transition().attr({
              "stroke-width": 8,
              "stroke":"#999"
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
      //.attr("transform", function(d) { return "translate(" + pc.math.arc.centroid(d) + ")"; })
<<<<<<< HEAD
        .attr("dx", -(pcLayout.width/2))
        .attr("dy", function(d,i){return ""+((160)+(+i * 15) )+""} )
        .attr("id","piechartlegened")
=======
        .attr("dx", -24)
        .attr("dy", function(d,i){return ""+((-16)+(+i * 12) )+""} )
        .attr("id","piechartlegend")
>>>>>>> jaw1874
        .text(function(d) { return d.label + " : " + d3.round(+d.value,2) + "%"; })
        .attr("fill",function(d, i) { return pcLayout.color(i); })
        .on("mouseover",function(a,b){

        })
        .on("click", function (d) {
            alert(d.value);
        })
  }

  function updatePieChart(results) {

      console.log('...update chart...');
      
      var pcChart = pc.chart,
          pcMath = pc.math,
          pcDom = pc.dom,

          data = parsePieData(results);

      pcMath.pie.value(function(d) { return d["value"]; }); // change the value function
      
      pcDom.d_svg
        .datum(data)
        .selectAll("path")
          .data(pcMath.pie)
          .transition().duration(750).attrTween("d", arcTween); // redraw the arcs

      pcChart.legend.data(data)
        .transition()
        .text(function(d) { return pc.properties[d.label].label + " : " + d3.round(+d.value,2) + "%" })
  }

  function parsePieData(results) {

    // this can be refractored with 
    var pieData = [];
    
      $.each(pc.properties,function(i,prop){
        
        var property = {};
        property.value = +results[i];
        property.label = i;

        pieData.push(property);
        
      });

    pc.data = pieData;
    return pieData;

  }

  // Store the displayed angles in _current.
  // Then, interpolate from _current to the new angles.
  // During the transition, _current is updated in-place by d3.interpolate.
  function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
      return pc.math.arc(i(t));
    };
  }

  return {
      build: buildPieChart
    , update: updatePieChart
  }
}

var piechart = pieChart();