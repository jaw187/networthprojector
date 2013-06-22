function slidecb() {
  //Update text display
  $($(this).next()).text($(this).slider('option','value'));
  
  nwp.update(nwp.calculate());
}

var inputgroups = [
    { name: 'asdf', text: 'About You', toggle: false}
  , { name: 'qwer', text: 'APR', toggle: false}
  , { name: 'toggle', text: 'About Your Home', toggle: false}
  , { name: 'ghgh', text: 'About Your Mortgage', toggle: function () {
      //Set default values
    }}
];

var inputsliders = [
     { name: 'savings', text: 'Initial Savings', group: 0, notoggle: false, options: { step: 1000, range: 'min', min: 0, max:1000000, value: 50000, slide: slidecb }  }
  ,  { name: 'income', text: 'Monthly Takehome Income', group: 0, notoggle: false, options: { step: 100, range: 'min', min: 0, max:20000, value: 3000, slide: slidecb } }
  ,  { name: 'expenses', text: 'Monthly Expenses', group: 0, notoggle: false, options: { step: 500, range: 'min', min: 0, max:20000, value: 1000, slide: slidecb }  }
  ,  { name: 'years', text: 'Years To Project Out', group: 0, notoggle: false, options: { range: 'min', min: 0, max:60, value: 20, slide: slidecb }  }
  ,  { name: 'reapr', text: 'Real Estate APR', group: 1, notoggle: false, options: { step: .005, range: 'min', min: 0, max:.2, value: .05, slide: slidecb }  }
  ,  { name: 'investapr', text: 'Investments APR', group: 1, notoggle: false, options: { step: .005, range: 'min', min: 0, max:.30, value: .07, slide: slidecb }  }
  ,  { name: 'homeprice', text: 'Home Price', group: 2, notoggle: true, options: { range: 'min', min: 0, max:1000000, value: 200000, slide: slidecb }  }
  ,  { name: 'rentmaint', text: 'Rent or Maintenance', group: 2, notoggle: false, options: { range: 'min', min: 0, max:10000, value: 200, slide: slidecb }  }
  ,  { name: 'heatelec', text: 'Heat and Electric', group: 2, notoggle: false, options: { range: 'min', min: 0, max:1000, value: 200, slide: slidecb }  }
  ,  { name: 'mortapr', text: 'Mortgage APR', group: 3, notoggle: false, options: { step: .0001, range: 'min', min: 0, max:.1, value: .03875, slide: slidecb }  }
  ,  { name: 'downpayment', text: 'Mortgage Downpayment', group: 3, notoggle: false, options: { step: .001, range: 'min', min: 0, max:1, value: .20, slide: slidecb }  }
  ,  { name: 'term', text: 'Mortgage Term', group: 3, notoggle: false, options: { range: 'min', min: 0, max:30, value: 30, slide: slidecb }  }
  ,  { name: 'tax', text: 'Property Tax', group: 3, notoggle: false, options: { step: .001, range: 'min', min: 0, max:.1, value: .02, slide: slidecb }  }
]

$(function () {
  //INIT

  //Build Input Sliders and group them
  for (var i = 0; i < inputsliders.length; i++) {
    inputsliders[i].obj = buildInputSlider(inputsliders[i]);
  }
  buildGroupsObj();


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
})
