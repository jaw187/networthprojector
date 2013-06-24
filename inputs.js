function slidecb() {
  //Update text display
  $($(this).prev()).find('.value').val($(this).slider('option','value'));
  
  nwp.update(nwp.calculate());
}

var inputsliders = [
     { name: 'savings', text: 'Initial Savings', notaligned: false, options: { step: 1000, range: 'min', min: 0, max:1000000, value: 50000, slide: slidecb }  }
  ,  { name: 'income', text: 'Takehome Income', notaligned: false, options: { step: 500, range: 'min', min: 0, max:20000, value: 7000, slide: slidecb } }
  ,  { name: 'expenses', text: 'Expenses', notaligned: false, options: { step: 500, range: 'min', min: 0, max:20000, value: 2000, slide: slidecb }  }
  ,  { name: 'years', text: 'Years', inputclass: 'pure-input-1', notaligned: true, options: { orientation: "vertical", range: 'min', min: 0, max:60, value: 20, slide: slidecb }  }
  ,  { name: 'reapr', text: 'Real Estate APR', notaligned: false, options: { step: .001, range: 'min', min: 0, max:.1, value: .05, slide: slidecb }  }
  ,  { name: 'investapr', text: 'Investments APR', notaligned: false, options: { step: .001, range: 'min', min: 0, max:.15, value: .07, slide: slidecb }  }
  ,  { name: 'homeprice', text: 'Home Price', notaligned: false, options: { range: 'min', min: 0, max:1000000, value: 100000, slide: slidecb }  }
  ,  { name: 'rent', text: 'Rent', notaligned: false, options: { range: 'min', min: 0, max:10000, value: 200, slide: slidecb }  }
  ,  { name: 'mortapr', text: 'Mortgage APR', notaligned: false, options: { step: .0001, range: 'min', min: 0, max:.1, value: .03875, slide: slidecb }  }
  ,  { name: 'downpayment', text: 'Mortgage Downpayment', notaligned: false, options: { step: .001, range: 'min', min: 0, max:1, value: .12, slide: slidecb }  }
  ,  { name: 'term', text: 'Mortgage Term', notaligned: false, options: { range: 'min', min: 0, max:50, value: 30, slide: slidecb }  }
  ,  { name: 'tax', text: 'Property Tax', notaligned: false, options: { step: .001, range: 'min', min: 0, max:.1, value: .02, slide: slidecb }  }
]


$(function () {
  //INIT

  function buildInputGroup(group) {
    
    var header = document.createElement('h5');
    $(header).addClass('inputheader');
    $(header).append(group.text);
    $("#" + group.id).append(header);

    //Toggle?

    var fieldset = document.createElement("fieldset");
      
    //loop through sliders to find members
    for (var i = 0; i < group.inputs.length; i++) {
        var input = buildInputSlider(group.inputs[i])
        $(fieldset).append(input.container)
    }

    $("#" + group.id).append($($(document.createElement('form')).addClass('pure-form pure-form-aligned')).append(fieldset));
  }

  function buildInputSlider(i) {
    i.obj = {
      i: i,
      container: $(document.createElement('div')).addClass('inputcontainer') ,
      label: $($(document.createElement('label')).attr('for',i.name)).text(i.text) ,
      slider:$(document.createElement('div')).addClass('slider') ,
      valuedisplay: $($(document.createElement('input')).addClass('value')).attr('id',i.name).attr('type','text').attr('value',i.options.value)
    }

    if (i.inputclass) {
      $(i.obj.valuedisplay).addClass(i.inputclass)
    }
    else {
      $(i.obj.valuedisplay).addClass('pure-input-1-3')
    }

    if (!i.notaligned) $(i.obj.container).addClass('pure-control-group')
    
    $(i.obj.slider).slider(i.options);

    $(i.obj.valuedisplay).on('change', function () {
      //Value Input Change
      //Should this be updated as every character changes?
      //remove any non digits
      $(this).parent().next().slider("value",$(this).val());
      nwp.update(nwp.calculate());
    })
    
    $(i.obj.container).append(i.obj.label).append(i.obj.valuedisplay).append(i.obj.slider);

    return i.obj;
  }

  for (var i = 0; i < inputsliders.length; i++) {
    buildInputSlider(inputsliders[i]);

    $("#inputs-" + inputsliders[i].name).append(inputsliders[i].obj.container).append(inputsliders[i].obj.slider)
  }
})