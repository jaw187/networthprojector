var barchart_width = 600;
var barchart_height = 600;
var barchart_margin = 20;
var barchart_margin_right = 100;
var barchart_margin_bottom = 50;
var bar_margin = 3;

var barchart_x;
var barchart_y;


function buildBarChart() {
  bar_width = ((barchart_width-(barchart_margin + barchart_margin_right))/(inputs.years+1))-(2*bar_margin);
  barchart_x = d3.scale.linear()
      .domain([0, 1])
      .range([barchart_margin, barchart_margin+bar_width+(2*bar_margin)]);
    
  barchart_y = d3.scale.linear()
      .domain([0, results.totalnetworth])
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
      .domain([results.totalnetworth,0])
      .rangeRound([0,barchart_height-(barchart_margin+barchart_margin_bottom)]);

    xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(1)
        .tickPadding(0)
        .orient("bottom");

    yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(0)
        .tickPadding(6)
        .orient("right");
        
    chart.append("g")
      .attr("class", "x axis")
      .attr("id", "sbgxaxis")
      .attr("transform", "translate("+barchart_margin+"," + (barchart_height-barchart_margin_bottom) + ")")
      .call(xAxis);
      
    chart.append("g")
      .attr("class", "y axis")
      .attr("id", "sbgyaxis")
      .attr("transform", "translate("+(barchart_width-barchart_margin_right)+","+barchart_margin+")")
      .call(yAxis);
      
    chart.select("#sbgyaxis")
      .append("text")
      .attr("class", "sbgyaxislabel")
      .text("Dollars")
      .attr("transform","rotate(270,0,0) translate("+(-barchart_width/2)+","+barchart_margin_right+")"); 
      
    chart.select("#sbgxaxis")
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
function updateBarChart() {
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

function populateBarChartData() {
  ts_stock = [];
  ts_re = [];
  for (var i = 0; i <= inputs.years; i++) {
    ts_stock[i] = calculateStockEquity(i);
    ts_re[i] = calculateRealEstateValue(i) - calculateRealEstateDebt(i)
  } 
}