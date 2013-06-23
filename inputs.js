function slidecb() {
  //Update text display
  $($(this).prev()).find('.value').val($(this).slider('option','value'));
  
  nwp.update(nwp.calculate());
}
/*
var inputgroups = [
    { 
        id: 'aboutyou'
      , text: 'About You'
      , toggle: false
      , inputs: [
          { name: 'savings', text: 'Initial Savings', notoggle: false, options: { step: 1000, range: 'min', min: 0, max:1000000, value: 50000, slide: slidecb }  }
        , { name: 'income', text: 'Takehome Income', notoggle: false, options: { step: 500, range: 'min', min: 0, max:20000, value: 7000, slide: slidecb } }
        , { name: 'expenses', text: 'Expenses', notoggle: false, options: { step: 500, range: 'min', min: 0, max:20000, value: 2000, slide: slidecb }  }
        ]
    }
  , { 
        id: 'investmentperformance'
      , text: 'Investment Performance'
      , toggle: false
      , inputs: [
          { name: 'reapr', text: 'Real Estate APR', notoggle: false, options: { step: .001, range: 'min', min: 0, max:.1, value: .05, slide: slidecb }  }
        , { name: 'investapr', text: 'Investments APR', notoggle: false, options: { step: .001, range: 'min', min: 0, max:.15, value: .07, slide: slidecb }  }
        ]
    }
  , {
        id: 'abouthome'
      , text: 'About Your Home'
      , toggle: function () {
      //Set default values
      //Switch between renting and owning
        }
      , inputs: [
          { name: 'homeprice', text: 'Home Price', class: 'own', options: { range: 'min', min: 0, max:1000000, value: 100000, slide: slidecb }  }
        , { name: 'rentmaint', text: 'Rent', class: 'rent', options: { range: 'min', min: 0, max:10000, value: 200, slide: slidecb }  }
        , { name: 'mortapr', text: 'Mortgage APR', class: 'own', options: { step: .0001, range: 'min', min: 0, max:.1, value: .03875, slide: slidecb }  }
        , { name: 'downpayment', text: 'Mortgage Downpayment', class: 'own', options: { step: .001, range: 'min', min: 0, max:1, value: .12, slide: slidecb }  }
        , { name: 'term', text: 'Mortgage Term', class: 'own', options: { range: 'min', min: 0, max:50, value: 30, slide: slidecb }  }
        , { name: 'tax', text: 'Property Tax', class: 'own', options: { step: .001, range: 'min', min: 0, max:.1, value: .02, slide: slidecb }  }
      ]
    }
];
*/

var inputsliders = [
     { name: 'savings', text: 'Initial Savings', notoggle: false, options: { step: 1000, range: 'min', min: 0, max:1000000, value: 50000, slide: slidecb }  }
  ,  { name: 'income', text: 'Takehome Income', notoggle: false, options: { step: 500, range: 'min', min: 0, max:20000, value: 7000, slide: slidecb } }
  ,  { name: 'expenses', text: 'Expenses', notoggle: false, options: { step: 500, range: 'min', min: 0, max:20000, value: 2000, slide: slidecb }  }
  ,  { name: 'years', text: 'Years To Project Out', notoggle: false, options: { range: 'min', min: 0, max:60, value: 20, slide: slidecb }  }
  ,  { name: 'reapr', text: 'Real Estate APR', notoggle: false, options: { step: .001, range: 'min', min: 0, max:.1, value: .05, slide: slidecb }  }
  ,  { name: 'investapr', text: 'Investments APR', notoggle: false, options: { step: .001, range: 'min', min: 0, max:.15, value: .07, slide: slidecb }  }
  ,  { name: 'homeprice', text: 'Home Price', notoggle: true, options: { range: 'min', min: 0, max:1000000, value: 100000, slide: slidecb }  }
  ,  { name: 'rent', text: 'Rent', notoggle: false, options: { range: 'min', min: 0, max:10000, value: 200, slide: slidecb }  }
  ,  { name: 'mortapr', text: 'Mortgage APR', notoggle: false, options: { step: .0001, range: 'min', min: 0, max:.1, value: .03875, slide: slidecb }  }
  ,  { name: 'downpayment', text: 'Mortgage Downpayment', notoggle: false, options: { step: .001, range: 'min', min: 0, max:1, value: .12, slide: slidecb }  }
  ,  { name: 'term', text: 'Mortgage Term', notoggle: false, options: { range: 'min', min: 0, max:50, value: 30, slide: slidecb }  }
  ,  { name: 'tax', text: 'Property Tax', notoggle: false, options: { step: .001, range: 'min', min: 0, max:.1, value: .02, slide: slidecb }  }
]


$(function () {
  //INIT

/*
  //Build Input Sliders and group them
  for (var i = 0; i < inputsliders.length; i++) {
    inputsliders[i].obj = buildInputSlider(inputsliders[i]);
  }
  buildGroupsObj();
*/

  function buildInputGroup(group) {
    console.log(group)
    //var container = $($(document.createElement('div')).addClass('inputgroup')).attr('id',group.id);
    
    var header = document.createElement('h5');
    $(header).addClass('inputheader');
    $(header).append(group.text);
    $("#" + group.id).append(header);

    //Toggle?

    var fieldset = document.createElement("fieldset");
      
    //loop through sliders to find members
    for (var i = 0; i < group.inputs.length; i++) {
        //$(fieldset).append(buildInputSlider(group.inputs[i]))
        var input = buildInputSlider(group.inputs[i])
        $(fieldset).append(input.container)
        //$(fieldset).append(input.slider)
    }

    $("#" + group.id).append($($(document.createElement('form')).addClass('pure-form pure-form-aligned')).append(fieldset));

    //return container;
  }

  function buildInputSlider(i) {
    i.obj = {
      i: i,
      container: $(document.createElement('div')).addClass('inputcontainer pure-control-group') ,
      label: $($(document.createElement('label')).attr('for',i.name)).text(i.text) ,
      slider:$(document.createElement('div')).addClass('slider') ,
      valuedisplay: $($(document.createElement('input')).addClass('value pure-input-1-3')).attr('id',i.name).attr('type','text').attr('value',i.options.value)
    }
    
    $(i.obj.slider).slider(i.options);

    $(i.obj.valuedisplay).on('change', function () {
      //Value Input Change
      //Should this be updated as every character changes?
      //remove any non digits
      $(this).parent().next().slider("value",$(this).val());
      nwp.update(nwp.calculate());
    })

   // var valuecontainer = $(document.createElement('div')).addClass('valuecontainer').append(i.obj.valuedisplay);
    
    $(i.obj.container).append(i.obj.label).append(i.obj.valuedisplay).append(i.obj.slider);

    //inputsliders.push(i)

    return i.obj;
  }

  for (var i = 0; i < inputsliders.length; i++) {
    buildInputSlider(inputsliders[i]);

    $("#inputs-" + inputsliders[i].name).append(inputsliders[i].obj.container).append(inputsliders[i].obj.slider)
  }

/*
  for (var i = 0; i < inputgroups.length; i++) {
    //$("#" + inputgroups[i].id).append(buildInputGroup(inputgroups[i]))
    buildInputGroup(inputgroups[i])
  }


  //years input
  var yearsinput = { name: 'years', text: 'Years To Project Out', options: { range: 'min', min: 0, max:60, value: 20, slide: slidecb }  }
  $('.yearsinput').append((buildInputSlider(yearsinput)).container)

  console.log(inputsliders)

  */

/*
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
            //inputgroups[i].toggle();
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
          var valuecontainer = $(document.createElement('div')).addClass('valuecontainer').append(inputsliders[j].obj.valuedisplay);
          $(fieldset).append(inputsliders[j].obj.label).append(inputsliders[j].obj.slider).append(valuecontainer)
        }
      }

      $(inputgroups[i].obj).append(fieldset);
      
      $('.sliders').append(inputgroups[i].obj);
    }
  }
  */
})