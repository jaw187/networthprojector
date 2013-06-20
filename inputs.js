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