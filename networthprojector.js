var input
  , inputsliders
  , inputgroups;

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

  inputgroups = [
      { name: 'asdf', text: 'This is the ASDF group', toggle: false}
    , { name: 'qwer', text: 'Los Qwerty', toggle: false}
    , { name: 'toggle', text: 'Toggle This', toggle: {/*ToggleOptions*/}}
    , { name: 'ghgh', text: 'Bacon Ipsulum'}
  ];

   inputsliders = [
       { name: 'savings', text: 'Initial Savings', group: 0, options: { step: 1000, range: 'min', min: 0, max:1000000, value: 50000, slide: slidecb }  }
    ,  { name: 'income', text: 'Takehome Income', group: 0, options: { step: 500, range: 'min', min: 0, max:20000, value: 7000, slide: slidecb } }
    ,  { name: 'expenses', text: 'Expenses', group: 0, options: { step: 500, range: 'min', min: 0, max:20000, value: 2000, slide: slidecb }  }
    ,  { name: 'years', text: 'Years To Project Out', group: 0, options: { range: 'min', min: 0, max:60, value: 20, slide: slidecb }  }
    ,  { name: 'reapr', text: 'Real Estate APR', group: 1, options: { step: .001, range: 'min', min: 0, max:.1, value: .05, slide: slidecb }  }
    ,  { name: 'investapr', text: 'Investments APR', group: 1, options: { step: .001, range: 'min', min: 0, max:.15, value: .07, slide: slidecb }  }
    ,  { name: 'homeprice', text: 'Home Price', group: 2, options: { range: 'min', min: 0, max:1000000, value: 100000, slide: slidecb }  }
    ,  { name: 'mortapr', text: 'Mortgage APR', group: 2, options: { step: .0001, range: 'min', min: 0, max:.1, value: .03875, slide: slidecb }  }
    ,  { name: 'downpayment', text: 'Mortgage Downpayment', group: 2, options: { step: .001, range: 'min', min: 0, max:1, value: .12, slide: slidecb }  }
    ,  { name: 'term', text: 'Mortgage Term', group: 3, options: { range: 'min', min: 0, max:50, value: 30, slide: slidecb }  }
    ,  { name: 'tax', text: 'Property Tax', group: 3, options: { step: .001, range: 'min', min: 0, max:.1, value: .02, slide: slidecb }  }
    ,  { name: 'rentmaint', text: 'Rent or Maintenance', group: 3, options: { range: 'min', min: 0, max:10000, value: 200, slide: slidecb }  }
    ,  { name: 'heatelec', text: 'Heat and Electric', group: 3, options: { range: 'min', min: 0, max:1000, value: 200, slide: slidecb }  }
  ]

  //Build Input Sliders and group them
  for (var i = 0; i < inputsliders.length; i++) {
    inputsliders[i].obj = buildInputSlider(inputsliders[i]);
  }
  buildGroupsObj();

  /////////////////////
  // Initialize Visualizations
  /////////////////////
  var r = calculateResults();

  buildRawDataFeed();
  buildBarChart();
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
    //Is Toggled?

    //create input groups object and append it 
    inputgroups[i].obj = $(document.createElement('div')).addClass("inputgroup")
    var fieldset = document.createElement("fieldset");
    
    //loop through sliders to find members
    for (var j = 0; j < inputsliders.length; j++) {
      if (inputsliders[j].group === i) {
        console.log("ASDF")
        $(fieldset).append(inputsliders[j].obj.label).append(inputsliders[j].obj.slider).append(inputsliders[j].obj.valuedisplay)
      }
    }

    $(inputgroups[i].obj).append(fieldset);
    
    $('.sliders').append(inputgroups[i].obj);
  }
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