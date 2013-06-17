function stackedBarGraph() {
  var numOfLayers, numOfSamples, stack, layers, yGroupMax, yStackMax, margin, width, height, x, y, color, xAxis,
      svg, layer, rect,
      transition;

  //Hack to toggle through groups
  // investments, realestateequity, realestatedebt
  var which = 'investments';

  //build/reset object to hold all of our data
  //add data to object
  var data;
  function setData (results) {
    numOfSamples = results.length;

    data = {
      investments: [],
      realestateequity: [],
      realestatedebt: []
    }
    
    for (var i = 0; i < results.length; i++) {
      data.investments.push(results[i].stockequity)
      data.realestateequity.push(results[i].realestateequity)
      data.realestatedebt.push(results[i].realestatedebt)
    }
  }

  //Update graph with current data
  function updateGraph() {
    //Hack to toggle through different groups
    which = 'investments'

    //Recreate layers with current data
    layers = stack(d3.range(numOfLayers).map(function() { return bumpLayer(); }))

    //Add layers data to each layer
    layer.data(layers);
    
    //Reset the max values used to scale later  
    yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); }),
    yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

    x.domain(d3.range(numOfSamples))

    xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(0)
        .tickPadding(6)
        .orient("bottom");

    d3.select("#sbgxaxis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

    /* rect = layer.selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", height)
      .attr("width", x.rangeBand())
      .attr("height", 0); */

    //transition the new graph
    transition();
  }

  /////////////////////////////
  // Build graph
  ////////////////////////////

  function buildGraph() {
    //Is data set?
    if (!(data && data.investments && data.investments.length > 0))
      return;

    numOfLayers = 3, // number of layers - Investments, Real Estate Equity, Real Estate Debt
    //numOfSamples = n, // number of samples per layer
    stack = d3.layout.stack(),
    layers = stack(d3.range(numOfLayers).map(function() { return bumpLayer(); })),
    yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); }),
    yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

    // Establish 
    margin = {top: 40, right: 10, bottom: 20, left: 10},
    width = 760 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    x = d3.scale.ordinal()
        .domain(d3.range(numOfSamples))
        .rangeRoundBands([0, width], .08);

    y = d3.scale.linear()
        .domain([0, yStackMax])
        .range([height, 0]);

    color = d3.scale.linear()
        .domain([0, numOfLayers - 1])
        .range(["#4B7553", "#AE4E43"]);

    xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(0)
        .tickPadding(6)
        .orient("bottom");

    yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(0)
        .tickPadding(6)
        .orient("right");

    //where to append visualization to
    //change to div
    svg = d3.select("#stackedbargraph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    layer = svg.selectAll(".layer")
      .data(layers)
      .enter().append("g")
      .attr("class", "layer")
      .style("fill", function(d, i) { return color(i); });

    rect = layer.selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", height)
      .attr("width", x.rangeBand())
      .attr("height", 0);

  rect.transition()
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d.y0 + d.y); })
      .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

  svg.append("g")
      .attr("class", "x axis")
      .attr("id", "sbgxaxis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .attr("id", "sbgyaxis")
      .attr("transform", "translate(0,0)")
      .call(yAxis);

    //updated this to be more specific
    d3.selectAll("form#stackedtoggle input").on("change", change);

    function change() {
      if (this.value === "grouped") transitionGrouped();
      else transitionStacked();
    }

    function transitionGrouped() {
      y.domain([0, yGroupMax]);

      yAxis = d3.svg.axis()
          .scale(y)
          .tickSize(0)
          .tickPadding(6)
          .orient("right");

      rect.transition()
          //.duration(30)
          .delay(function(d, i) { return i * 10; })
          .attr("x", function(d, i, j) { return x(d.x) + x.rangeBand() / n * j; })
          .attr("width", x.rangeBand() / n)
        .transition()
          .attr("y", function(d) { return y(d.y); })
          .attr("height", function(d) { return height - y(d.y); });
    }

    function transitionStacked() {
      y.domain([0, yStackMax]);

      yAxis = d3.svg.axis()
          .scale(y)
          .tickSize(0)
          .tickPadding(6)
          .orient("right");

      d3.select("#sbgyaxis")
          .attr("transform", "translate(0,0)")
          .call(yAxis);

      rect.transition()
          //.duration(30)
          .delay(function(d, i) { return i * 10; })
          .attr("y", function(d) { return y(d.y0 + d.y); })
          .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
        .transition()
          .attr("x", function(d) { return x(d.x); })
          .attr("width", x.rangeBand());
    }

    transition = function () {
      /*
      if (stacked) transitionStacked();
      else transitionGrouped();
      */

      transitionStacked();
    }
  }

  // Inspired by Lee Byron's test data generator.

  function bumpLayer() {
    var a = [];
    for (var i = 0; i < numOfSamples; ++i) a[i] = data[which][i];

    //Hack to toggle through groups
    if (which === 'investments') which = 'realestateequity';
    else which = 'realestatedebt'

    return a.map(function(d, i) { return {x: i, y: Math.max(0, d)}; });
  }

  //For access from other places
  var sbg = {
    set: setData,
    build: buildGraph,
    update: updateGraph
  }

  return sbg;
}
