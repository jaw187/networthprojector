var inputsliders;

$(function () {
  function updateVisualizations(results) {
    setRawDataFeedValues(results);
    /////////////////////
    // Add your function for updating visualizations
    /////////////////////
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
})

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
  var inputs = {};

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
  results.homevalue =  inputs.homeprice * (Math.pow((1 + inputs.reapr),inputs.years));
  results.realestatedebt = ((inputs.homeprice * (1 - inputs.downpayment) * Math.pow(1 + inputs.mortapr, inputs.years)) - (results.mortgagepayment * 12 * (Math.pow((1 + inputs.mortapr),inputs.years) - 1) / inputs.mortapr));
  results.realestateequity = results.homevalue - results.realestatedebt;
  results.initstock = inputs.savings - inputs.downpayment * inputs.homeprice;
  results.stockequity = (results.initstock * Math.pow((1 + inputs.investapr), inputs.years) + Math.max(0,results.monthlysavings) * 12 * (Math.pow(1 + inputs.investapr,(inputs.years + 1)) - (1 + inputs.investapr)) / inputs.investapr);
  results.totalnetworth = (results.realestateequity + results.stockequity);
  results.instock = 100 * results.stockequity / (results.totalnetworth);
  results.inrealestate = 100 * results.realestateequity / (results.totalnetworth);
  results.indebt = 100 * results.realestatedebt / (results.totalnetworth);

  return results;
}