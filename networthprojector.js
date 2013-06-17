var inputsliders;
var ts_stock, ts_re;
var inputs, results;

var barchart_width = 500;
var barchart_height = 500;
var barchart_margin = 25;
var bar_margin = 3;

var barchart_x;
var barchart_y;


$(function () {
  function updateVisualizations(results) {
    setRawDataFeedValues(results);
    /////////////////////
    // Add your function for updating visualizations
    /////////////////////
    buildBarChart();
  }

  function slidecb(event,ui) {
    $($(this).next()).text($(this).slider('option','value'));
    updateVisualizations(calculateResults());
  }

   inputsliders = [
      { name: 'income', text: 'Takehome Income', options: { range: 'min', min: 0, max:20000, value: 7000, slide: slidecb } }
    ,  { name: 'expenses', text: 'Expenses', options: { range: 'min', min: 0, max:20000, value: 2000, slide: slidecb }  }
    ,  { name: 'reapr', text: 'Real Estate APR', options: { step: .001, range: 'min', min: 0, max:.1, value: .05, slide: slidecb }  }
    ,  { name: 'investapr', text: 'Investments APR', options: { step: .001, range: 'min', min: 0, max:.15, value: .07, slide: slidecb }  }
    ,  { name: 'savings', text: 'Initial Savings', options: { range: 'min', min: 0, max:1000000, value: 50000, slide: slidecb }  }
    ,  { name: 'years', text: 'Years To Project Out', options: { range: 'min', min: 0, max:60, value: 20, slide: slidecb }  }
    ,  { name: 'mortapr', text: 'Mortgage APR', options: { step: .0001, range: 'min', min: 0, max:.1, value: .03875, slide: slidecb }  }
    ,  { name: 'term', text: 'Mortgage Term', options: { range: 'min', min: 0, max:50, value: 30, slide: slidecb }  }
    ,  { name: 'downpayment', text: 'Mortgage Downpayment', options: { step: .001, range: 'min', min: 0, max:1, value: .12, slide: slidecb }  }
    ,  { name: 'tax', text: 'Property Tax', options: { step: .001, range: 'min', min: 0, max:.1, value: .02, slide: slidecb }  }
    ,  { name: 'homeprice', text: 'Home Price', options: { range: 'min', min: 0, max:1000000, value: 100000, slide: slidecb }  }
    ,  { name: 'rentmaint', text: 'Rent or Maintenance', options: { range: 'min', min: 0, max:10000, value: 200, slide: slidecb }  }
    ,  { name: 'heatelec', text: 'Heat and Electric', options: { range: 'min', min: 0, max:1000, value: 200, slide: slidecb }  }
  ]

  var sliders = $('.sliders');
  for (var i = 0; i < inputsliders.length; i++) {
    inputsliders[i].obj = buildInputSlider(inputsliders[i],sliders);
  }

  /////////////////////
  // Initialize Visualizations
  /////////////////////
  buildRawDataFeed();
  updateVisualizations(calculateResults());
  buildBarChart();
})
function buildBarChart() {
	bar_width = ((barchart_width-(2*barchart_margin))/(inputs.years+1))-(2*bar_margin);
	barchart_x = d3.scale.linear()
    	.domain([0, 1])
    	.range([barchart_margin, barchart_margin+bar_width+(2*bar_margin)]);
    
	barchart_y = d3.scale.linear()
    	.domain([0, results.totalnetworth])
		.rangeRound([0,barchart_height-(barchart_margin*2)]);
		
	console.log("bar_width = "+bar_width);
	d3.select("#barchart").remove();
			
	var chart = d3.select("#barchart_container").append("svg")
        .attr("id", "barchart")
        .attr("width", barchart_width)
        .attr("height", barchart_height);
    

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
    console.log("updateBarChart()");

    d3.select("#barchart")
        .selectAll(".stockColumn")
        .data(ts_stock)
        .attr("height", function (d) {
            return barchart_y(d);
        })
        .attr("y", function (d,i) {
            return barchart_height - barchart_margin - barchart_y(d+ts_re[i]);
        });
     d3.select("#barchart")
        .selectAll(".realestateColumn")
        .data(ts_re)
        .attr("height", function (d) {
            return barchart_y(d);
        })
        .attr("y", function (d,i) {
            return barchart_height - barchart_margin - barchart_y(d);
        });
    
    console.log("updateBarChart() exit");
}
function buildInputSlider(i,p) {
  var obj = {
    label: $($(document.createElement('label')).attr('for',i.name)).text(i.text) ,
    slider:$($(document.createElement('div')).addClass('slider')).attr('id',i.name) ,
    valuedisplay: $($(document.createElement('div')).addClass('value')).text(i.options.value)
  }

  $(obj.slider).slider(i.options);

  $(p).append(obj.label);
  $(p).append(obj.slider);
  $(p).append(obj.valuedisplay);

  return obj;
}

function calculateResults() {
  inputs = {};

  for (var i = 0; i < inputsliders.length; i++) {
    inputs[inputsliders[i].name] = $(inputsliders[i].obj.slider).slider('option','value');
  }

   monthlymortapr = inputs.mortapr/12
    , numofmortpayments = inputs.term * 12
    , results = {};

  results.propertytaxes = inputs.homeprice * inputs.tax;
  results.mortgagepayment =  inputs.homeprice * (1 - inputs.downpayment) * Math.pow((1 + monthlymortapr),numofmortpayments) * monthlymortapr / (Math.pow((1 + monthlymortapr), numofmortpayments) - 1);
  results.homeexpenses = (results.propertytaxes/12) + inputs.rentmaint + inputs.heatelec + results.mortgagepayment;
  results.monthlysavings =  inputs.income - inputs.expenses - results.homeexpenses;
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
	console.log(ts_re);
	console.log(ts_stock);
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