var results;

function netWorthProjector() {
  function updateVisualizations(r) {
    var bankrupt = false;
    for (var i = 0; i < r.length; i++) {
      if (r[i].bankrupt) {
  	    console.log("bankrupt")
  	    $("#barchart_container").hide();
  	    $("#piechart_container").hide();
  	    $(".bankruptcy").show();
        bankrupt = true;
  	    break;
      }
    }

    if (bankrupt)
      return;

    else {
    	$("#barchart_container").show();
	    $("#piechart_container").show();
	    $(".bankruptcy").hide();
    }
    
    /////////////////////
    // Add your function for updating visualizations
    /////////////////////
    rawdata.setvalues(r[r.length - 1]);

    barchart.populate(r);
    barchart.build(r[r.length - 1].totalnetworth);
    
    piechart.update(r[r.length - 1]);
  }

  function init() {
    var r = calculateResults();

    /////////////////////
    // Initialize Visualizations
    /////////////////////
    rawdata.build();
    
    //barchart.build(r);
    
    piechart.build(r[r.length - 1]);
    
    updateVisualizations(r);
  }

  function calculateResults() {
    inputs = {};

    for (var i = 0; i < inputsliders.length; i++) {
      inputs[inputsliders[i].name] = $(inputsliders[i].obj.slider).slider('option','value');
    }

    var monthlymortapr = inputs.mortapr/12
      , numofmortpayments = inputs.term * 12
      , results = [], bankrupt = false;

    for (var i = 0; i < inputs['years']; i++) {
      results[i] = {};

      results[i].bankrupt = false;
      
      results[i].bankrupt = ((inputs.downpayment * inputs.homeprice) > inputs.savings);
      
      if (results[i].bankrupt) {
        bankrupt = true;
        break; 
      }
      
      results[i].propertytaxes = inputs.homeprice * inputs.tax;
      
      results[i].mortgagepayment =  inputs.homeprice * (1 - inputs.downpayment) * Math.pow((1 + monthlymortapr),numofmortpayments) * monthlymortapr / (Math.pow((1 + monthlymortapr), numofmortpayments) - 1);
      
      results[i].homeexpenses = (results[i].propertytaxes/12) + inputs.rent + results[i].mortgagepayment;
      
      results[i].monthlysavings =  inputs.income - inputs.expenses - results[i].homeexpenses;
      
      results[i].bankrupt = (results[i].monthlysavings < 0);
      
      if (results[i].bankrupt) {
        bankrupt = true;
        break;
      }
      
      results[i].homevalue =  calculateRealEstateValue(inputs.homeprice, inputs.reapr, i+1);
      
      results[i].realestatedebt = calculateRealEstateDebt(inputs.homeprice, inputs.downpayment, inputs.mortapr, results[i].mortgagepayment, i+1);
      
      results[i].realestateequity = results[i].homevalue - results[i].realestatedebt;
      
      results[i].initstock = inputs.savings - inputs.downpayment * inputs.homeprice;
      
      results[i].stockequity = calculateStockEquity(results[i].initstock, inputs.investapr, results[i].monthlysavings, i+1);
      
      results[i].totalnetworth = (results[i].realestateequity + results[i].stockequity);
      
      results[i].instock = 100 * results[i].stockequity / (results[i].totalnetworth);
      
      results[i].inrealestate = 100 * results[i].realestateequity / (results[i].totalnetworth);
      
      results[i].indebt = 100 * results[i].realestatedebt / (results[i].totalnetworth);
    }
    
    function calculateStockEquity(initstock, investapr, monthlysavings, years) {
      return (initstock * Math.pow((1 + investapr), years) + Math.max(0,monthlysavings) * 12 * (Math.pow(1 + investapr,(years + 1)) - (1 + investapr)) / investapr);  
    }
    function calculateRealEstateValue(homeprice, reapr, years) {
      return homeprice * (Math.pow((1 + reapr),years));
    }
    function calculateRealEstateDebt(homeprice, downpayment, mortapr, mortgagepayment, years) {
      return ((homeprice * (1 - downpayment) * Math.pow(1 + mortapr, years)) - (mortgagepayment * 12 * (Math.pow((1 + mortapr),years) - 1) / mortapr));
    } 
    
    return results;
  }

  return {
      update: updateVisualizations
    , calculate: calculateResults
    , init: init
  }
}

var nwp = netWorthProjector();

$(function () {
  nwp.init();

  $('.headernavlink').on('click', function () {
    $(this).parent().siblings().find('.headernavlink').removeClass('pure-menu-selected');

    $(this).addClass('pure-menu-selected')
  })
})