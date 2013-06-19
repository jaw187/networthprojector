var inputsliders;
var ts_stock, ts_re;
var inputs, results;

var barchart_width = 600;
var barchart_height = 600;
var barchart_margin = 20;
var barchart_margin_right = 100;
var barchart_margin_bottom = 50;
var bar_margin = 3;

var barchart_x;
var barchart_y;

var pieChart;

$(function () {
  function updateVisualizations(results) {
    if (results.bankrupt) {
	    console.log("bankrupt")
	    $("#barchart_container").hide();
	    $("#piechart_container").hide();
	    $(".bankruptcy").show();
	    return;
    } else {
    	$("#barchart_container").show();
	    $("#piechart_container").show();
	    $(".bankruptcy").hide();
    }
    
    setRawDataFeedValues(results);
    /////////////////////
    // Add your function for updating visualizations
    /////////////////////
    buildBarChart();
    updatePieChart(results);
  }

  function slidecb(event,ui) {
    $($(this).next()).text($(this).slider('option','value'));
    updateVisualizations(calculateResults());
  }

  inputgroups = [
      { name: 'asdf', text: 'About You', toggle: false}
    , { name: 'qwer', text: 'APR', toggle: false}
    , { name: 'toggle', text: 'About Your Home', toggle: false}
    , { name: 'ghgh', text: 'About Your Mortgage', toggle: function () {
        //Set default values
      }}
  ];

   inputsliders = [
       { name: 'savings', text: 'Initial Savings', group: 0, notoggle: false, options: { step: 1000, range: 'min', min: 0, max:1000000, value: 50000, slide: slidecb }  }
    ,  { name: 'income', text: 'Takehome Income', group: 0, notoggle: false, options: { step: 500, range: 'min', min: 0, max:20000, value: 7000, slide: slidecb } }
    ,  { name: 'expenses', text: 'Expenses', group: 0, notoggle: false, options: { step: 500, range: 'min', min: 0, max:20000, value: 2000, slide: slidecb }  }
    ,  { name: 'years', text: 'Years To Project Out', group: 0, notoggle: false, options: { range: 'min', min: 0, max:60, value: 20, slide: slidecb }  }
    ,  { name: 'reapr', text: 'Real Estate APR', group: 1, notoggle: false, options: { step: .001, range: 'min', min: 0, max:.1, value: .05, slide: slidecb }  }
    ,  { name: 'investapr', text: 'Investments APR', group: 1, notoggle: false, options: { step: .001, range: 'min', min: 0, max:.15, value: .07, slide: slidecb }  }
    ,  { name: 'homeprice', text: 'Home Price', group: 2, notoggle: true, options: { range: 'min', min: 0, max:1000000, value: 100000, slide: slidecb }  }
    ,  { name: 'rentmaint', text: 'Rent or Maintenance', group: 2, notoggle: false, options: { range: 'min', min: 0, max:10000, value: 200, slide: slidecb }  }
    ,  { name: 'heatelec', text: 'Heat and Electric', group: 2, notoggle: false, options: { range: 'min', min: 0, max:1000, value: 200, slide: slidecb }  }
    ,  { name: 'mortapr', text: 'Mortgage APR', group: 3, notoggle: false, options: { step: .0001, range: 'min', min: 0, max:.1, value: .03875, slide: slidecb }  }
    ,  { name: 'downpayment', text: 'Mortgage Downpayment', group: 3, notoggle: false, options: { step: .001, range: 'min', min: 0, max:1, value: .12, slide: slidecb }  }
    ,  { name: 'term', text: 'Mortgage Term', group: 3, notoggle: false, options: { range: 'min', min: 0, max:50, value: 30, slide: slidecb }  }
    ,  { name: 'tax', text: 'Property Tax', group: 3, notoggle: false, options: { step: .001, range: 'min', min: 0, max:.1, value: .02, slide: slidecb }  }
  ]

   //Build Input Sliders and group them
  for (var i = 0; i < inputsliders.length; i++) {
    inputsliders[i].obj = buildInputSlider(inputsliders[i]);
  }
  buildGroupsObj();

  var r = calculateResults();

  /////////////////////
  // Initialize Visualizations
  /////////////////////
  buildRawDataFeed();
  buildBarChart();
  buildPieChart();
  updateVisualizations(r);
})

function buildInputSlider(i) {
  var obj = {
    i: i,
    label: $($(document.createElement('label')).attr('for',i.name)).text(i.text) ,
    slider:$($(document.createElement('div')).addClass('slider')).attr('id',i.name) ,
    valuedisplay: $($(document.createElement('div')).addClass('value')).text(i.options.value)
  }
  
  $(obj.slider).slider(i.options);
  
  return obj;
}

function buildGroupsObj() {

  for (var i = 0; i < inputgroups.length; i++) {
    var header = document.createElement('h5');
    $(header).addClass('inputheader')
    $(header).append(inputgroups[i].text)
    $('.sliders').append(header)

    if (inputgroups[i].toggle) {
      var toggleswitch = $(document.createElement('a')).text('Toggle Switch');
      $(toggleswitch).addClass('toggleswitch')
      $(toggleswitch).on('click', function() {
          $(this).parent().next().toggle()
          inputgroups[i].toggle();
        })

      var container = document.createElement('div')
      $(container).addClass('toggle');
      $(container).append(toggleswitch);

      $('.sliders').append(container);

    }

    //create input groups object and append it 
    inputgroups[i].obj = $(document.createElement('div')).addClass("inputgroup")

    var fieldset = document.createElement("fieldset");
    
    //loop through sliders to find members
    for (var j = 0; j < inputsliders.length; j++) {
      if (inputsliders[j].group === i) {
        $(fieldset).append(inputsliders[j].obj.label).append(inputsliders[j].obj.slider).append(inputsliders[j].obj.valuedisplay)
      }
    }

    $(inputgroups[i].obj).append(fieldset);
    
    $('.sliders').append(inputgroups[i].obj);
  }
}

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

function calculateResults() {
  inputs = {};

  for (var i = 0; i < inputsliders.length; i++) {
    inputs[inputsliders[i].name] = $(inputsliders[i].obj.slider).slider('option','value');
  }

   monthlymortapr = inputs.mortapr/12
    , numofmortpayments = inputs.term * 12
    , results = {};
  
  results.bankrupt = false;
  results.bankrupt = ((inputs.downpayment * inputs.homeprice) > inputs.savings);
  if(results.bankrupt){ return results; }
  
  results.propertytaxes = inputs.homeprice * inputs.tax;
  results.mortgagepayment =  inputs.homeprice * (1 - inputs.downpayment) * Math.pow((1 + monthlymortapr),numofmortpayments) * monthlymortapr / (Math.pow((1 + monthlymortapr), numofmortpayments) - 1);
  results.homeexpenses = (results.propertytaxes/12) + inputs.rentmaint + inputs.heatelec + results.mortgagepayment;
  results.monthlysavings =  inputs.income - inputs.expenses - results.homeexpenses;
  
  results.bankrupt = (results.monthlysavings < 0);
  if(results.bankrupt){ return results; }
  
  results.homevalue =  calculateRealEstateValue(inputs.years);
  results.realestatedebt = calculateRealEstateDebt(inputs.years);
  results.realestateequity = results.homevalue - results.realestatedebt;
  results.initstock = inputs.savings - inputs.downpayment * inputs.homeprice;
  results.stockequity = calculateStockEquity(inputs.years);
  results.totalnetworth = (results.realestateequity + results.stockequity);
  results.instock = 100 * results.stockequity / (results.totalnetworth);
  results.inrealestate = 100 * results.realestateequity / (results.totalnetworth);
  results.indebt = 100 * results.realestatedebt / (results.totalnetworth);
  
  populateBarChartData();
  
  return results;
}

function populateBarChartData() {
	ts_stock = [];
	ts_re = [];
	for (var i = 0; i <= inputs.years; i++) {
		ts_stock[i] = calculateStockEquity(i);
		ts_re[i] = calculateRealEstateValue(i) - calculateRealEstateDebt(i)
	}	
}
function calculateStockEquity(years) {
  return (results.initstock * Math.pow((1 + inputs.investapr), years) + Math.max(0,results.monthlysavings) * 12 * (Math.pow(1 + inputs.investapr,(years + 1)) - (1 + inputs.investapr)) / inputs.investapr);	
}
function calculateRealEstateValue(years) {
	return inputs.homeprice * (Math.pow((1 + inputs.reapr),years));
}
function calculateRealEstateDebt(years) {
  return ((inputs.homeprice * (1 - inputs.downpayment) * Math.pow(1 + inputs.mortapr, years)) - (results.mortgagepayment * 12 * (Math.pow((1 + inputs.mortapr),years) - 1) / inputs.mortapr));
}

// pie chart //
function buildPieChart(){

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