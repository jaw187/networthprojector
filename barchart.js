function barChart() {

  var barchart_width = 400;
  var barchart_height = 400;
  var barchart_margin = 20;
  var barchart_margin_right = 58;
  var barchart_margin_bottom = 28;
  var bar_margin = 3;

  var barchart_x;
  var barchart_y;

  var ts_stock, ts_re;

  function buildBarChart(NETWORTH) {
    bar_width = ((barchart_width-(barchart_margin + barchart_margin_right))/(inputs.years+1))-(2*bar_margin);
    barchart_x = d3.scale.linear()
        .domain([0, 1])
        .range([barchart_margin, barchart_margin+bar_width+(2*bar_margin)]);
      
    barchart_y = d3.scale.linear()
        .domain([0, NETWORTH])
      .rangeRound([0,barchart_height-(barchart_margin+barchart_margin_bottom)]);
      
    d3.select("#barchart").remove();
        
    var chart = d3.select("#barchart_container").append("svg")
          .attr("id", "barchart")
          .attr("width", barchart_width)
          .attr("height", barchart_height);    
          
    x = d3.scale.ordinal()
          .domain(d3.range(inputs.years+1))
          .rangeRoundBands([0, barchart_width-(barchart_margin+barchart_margin_right)],0);
          
      y = d3.scale.linear()
        .domain([NETWORTH,0])
        .rangeRound([0,barchart_height-(barchart_margin+barchart_margin_bottom)]);

      xAxis = d3.svg.axis()
          .scale(x)
          .tickSize(1)
          .tickPadding(2)
          .orient("bottom");

      yAxis = d3.svg.axis()
          .scale(y)
          .tickSize(0)
          .tickPadding(6)
          .orient("right");
          
      chart.append("g")
        .attr("class", "x axis")
        .attr("id", "barchartxaxis")
        .attr("transform", "translate("+barchart_margin+"," + (barchart_height-barchart_margin_bottom) + ")")
        .call(xAxis);
        
      chart.append("g")
        .attr("class", "y axis")
        .attr("id", "barchartyaxis")
        .attr("transform", "translate("+(barchart_width-barchart_margin_right)+","+barchart_margin+")")
        .call(yAxis);
        
      chart.select("#barchartyaxis")
        .append("text")
        .attr("class", "sbgyaxislabel")
        .text("Dollars")
        .attr("transform","rotate(270,0,0) translate("+(-barchart_width/2)+","+barchart_margin_right+")"); 
        
      chart.select("#barchartxaxis")
        .append("text")
        .attr("class", "sbgxaxislabel")
        .text("Years")
        .attr("x", (barchart_width-barchart_margin_right)/2)
        .attr("y", (barchart_margin_bottom*(3/4)));     

      chart.selectAll("stockColumn")
          .data(ts_stock)
          .enter()
          .append("rect")
          .attr("class", "stockColumn")
          .attr("x", function (d, i) {
              return barchart_x(i)+bar_margin;
          })
          .attr("width",  bar_width)
          
      chart.selectAll("realestateColumn")
          .data(ts_re)
          .enter()
          .append("rect")
          .attr("class", "realestateColumn")
          .attr("x", function (d, i) {
              return barchart_x(i)+bar_margin;
          })
          .attr("width", bar_width)
      updateBarChart();
  }
  function updateBarChart(results) {
      d3.select("#barchart")
          .selectAll(".stockColumn")
          .data(ts_stock)
          .attr("height", function (d) {
              return barchart_y(d);
          })
          .attr("y", function (d,i) {
              return barchart_height - barchart_margin_bottom - barchart_y(d+ts_re[i]);
          });
       d3.select("#barchart")
          .selectAll(".realestateColumn")
          .data(ts_re)
          .attr("height", function (d) {
              return barchart_y(d);
          })
          .attr("y", function (d,i) {
              return barchart_height - barchart_margin_bottom - barchart_y(d);
          });
  }

  function populateBarChartData(results) {
    ts_stock = [];
    ts_re = [];
    for (var i = 0; i < results.length; i++) {
      //ts_stock[i] = calculateStockEquity(i);
      ts_stock[i] = results[i].stockequity;
      //ts_re[i] = calculateRealEstateValue(i) - calculateRealEstateDebt(i)
      ts_re[i] = results[i].homevalue - results[i].realestatedebt
    } 
  }

  return {
      build: buildBarChart
    , update: updateBarChart
    , populate: populateBarChartData
  }
}

var barchart = barChart();
