var inputsliders;

$(function () {
  function updateVisualizations(results) {
    /////////////////////
    // Add your function for updating visualizations
    /////////////////////
    
    setRawDataFeedValues(results[results.length - 1]);

    sbg.set(results)
    sbg.update()
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
  var r = calculateResults();

  buildRawDataFeed();

  var sbg = stackedBarGraph();
  sbg.set(r)
  sbg.build();

  updateVisualizations(r);
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
    , results = [];

  var n = inputs.years;

  for (var i=0; i < n; i++) {
    inputs.years = i + 1;

    results[i] = {};

    results[i].propertytaxes = inputs.homeprice * inputs.tax;
    results[i].mortgagepayment =  inputs.homeprice * (1 - inputs.downpayment) * Math.pow((1 + monthlymortapr),numofmortpayments) * monthlymortapr / (Math.pow((1 + monthlymortapr), numofmortpayments) - 1);
    results[i].homeexpenses = (results[i].propertytaxes/12) + inputs.rentmaint + inputs.heatelec + results[i].mortgagepayment;
    results[i].monthlysavings =  inputs.income - inputs.expenses - results[i].homeexpenses;
    results[i].homevalue =  inputs.homeprice * (Math.pow((1 + inputs.reapr),inputs.years));
    results[i].realestatedebt = ((inputs.homeprice * (1 - inputs.downpayment) * Math.pow(1 + inputs.mortapr, inputs.years)) - (results[i].mortgagepayment * 12 * (Math.pow((1 + inputs.mortapr),inputs.years) - 1) / inputs.mortapr));
    results[i].realestateequity = results[i].homevalue - results[i].realestatedebt;
    results[i].initstock = inputs.savings - inputs.downpayment * inputs.homeprice;
    results[i].stockequity = (results[i].initstock * Math.pow((1 + inputs.investapr), inputs.years) + Math.max(0,results[i].monthlysavings) * 12 * (Math.pow(1 + inputs.investapr,(inputs.years + 1)) - (1 + inputs.investapr)) / inputs.investapr);
    results[i].totalnetworth = (results[i].realestateequity + results[i].stockequity);
    results[i].instock = 100 * results[i].stockequity / (results[i].totalnetworth);
    results[i].inrealestate = 100 * results[i].realestateequity / (results[i].totalnetworth);
    results[i].indebt = 100 * results[i].realestatedebt / (results[i].totalnetworth);

    //console.log(results[i])
  }

  

  return results;
}
