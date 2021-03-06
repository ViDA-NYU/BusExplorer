/**
#
# DOT Time Tool, based on Pluto data viewer
#
*/

bus.UiParts = {};

bus.UiParts.Button = function(parentDiv, buttonId, glyph, buttonClass){
    // button div element
    var buttonDiv = parentDiv.append("button")
        .classed("btn btn-primary btn-sm", true)
        .attr("type", "button")
        .attr("id", buttonId);

    // button left space
    if(buttonClass)
        buttonDiv.classed(buttonClass, true);

    // icon element
    buttonDiv.append("span")
        .classed(glyph, true)
        .attr("aria-hidden", "true");

    // returns the element
    return buttonDiv;
};

bus.UiParts.ButtonText = function(parentDiv, buttonId, text, buttonClass){
    // button div element
    var buttonDiv = parentDiv.append("button")
        .classed("btn btn-primary btn-sm", true)
        .attr("type", "button")
        .attr("id", buttonId);

    // button left space
    if(buttonClass)
        buttonDiv.classed(buttonClass, true);

    // icon element
    buttonDiv.append("span")
        .text(text)
        .attr("aria-hidden", "true");

    // returns the element
    return buttonDiv;
};

bus.UiParts.DropDown = function(parentDiv, dropId, dropClass){
    // drop down span element
    var dropDiv = parentDiv.append("span")
        .classed("dropdown", true)
        .attr("id", dropId);

    // button left space
    if(dropClass)
        dropDiv.classed(dropClass, true);

    // creates the drop down
    dropDiv.append("button")
        .classed("btn btn-primary btn-sm dropdown-toggle", true)
        .attr("type", "button")
        .attr("json-toggle", "dropdown")
        .classed(dropClass, true);

    // creates the list
    dropDiv.append("ul")
        .classed("dropdown-menu scrollable-menu", true);

    // returns the element
    return dropDiv;
};

bus.UiParts.SimpleText = function(parentDiv, textId, textClass, text){
    // drop down span element
    var textDiv = parentDiv.append("span")
        .classed("text", true)
        .attr("id", textId)
        .text(text)

    // button left space
    if(textClass)
        textDiv.classed("leftSpace", true);

    // creates the drop down
    textDiv.append("text");
    // textDiv.append("br");

    // returns the element
    return textDiv;
};

bus.UiParts.Date = function(parentDiv, pickerId, textClass, text){
    
    var div = parentDiv.append("input")
        .attr("id",pickerId)
        .attr("type", "text")
        .style("width", "100%");

    $("#"+pickerId).daterangepicker({
        timePicker: true,
        timePicker24Hour: true,
        autoUpdateInput: false,
          locale: {
              cancelLabel: 'Clear'
          }
    });

    $("#"+pickerId).on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('MM/DD/YY HH:mm') + ' to ' + picker.endDate.format('MM/DD/YY HH:mm'));
    });

    $("#"+pickerId).on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
    });

    return div;

};

bus.UiParts.Slider = function(parentDiv, pickerId, range, initialValue){

    var div = parentDiv.append("input")
        .attr("id",pickerId)
        .attr("type", "text")
        .attr("class", "span2")
        .attr("data-slider-min", range[0])
        .attr("data-slider-max", range[1])
        .attr("data-slider-step", 1)

    if(initialValue.length == 2)
        div.attr("data-slider-value", "["+initialValue[0]+","+initialValue[1]+"]");
    else
        div.attr("data-slider-value", initialValue);

    $("#"+pickerId).slider({});

    // creates the drop down
    // div.append("text");
    // div.append("br");

    // returns the element
    return div;
};

bus.UiParts.CheckBox = function(parentDiv, checkboxId, checkboxClass, text){
    // button div element
    var checkboxDiv = parentDiv.append("div")
        .classed("checkbox", true)
        .attr("id", checkboxId);

    // button left space
    if(checkboxClass)
        checkboxDiv.classed(checkboxClass, true);

    var label = checkboxDiv.append("label").html("<input type=\"checkbox\" checked=\"checked\">"+text);

    // returns the element
    return checkboxDiv;
};

bus.UiParts.File = function(parentDiv, fileId, fileClass, text){

    var textDiv = parentDiv.append("div")
        .classed("text", true)
        .attr("id", fileId+"text")
        .text(text)

    // button left space
    if(fileClass)
        textDiv.classed("leftSpace", true);

    // creates the drop down
    textDiv.append("text");
    // textDiv.append("br");

    var fileDiv = parentDiv.append("input")
            .attr("type", "file")
            .attr("id", fileId);

    $("#"+fileId).filestyle({badge: false, buttonName: "btn-primary"});

    // returns the element
    return textDiv;
};

bus.UiParts.Popup = function(parentDiv, popupId, fileClass, text, title, content){

    var popupDiv = parentDiv.append("a")
        .attr("id", popupId+"text")
        .text(text)
        .attr("href","#")
        .attr("data-toggle", "popover")
        // .attr("data-placement", "top")
        .attr("title", title)
        .attr("data-content", content);

    // button left space
    if(fileClass)
        textDiv.classed(fileClass, true);

    // enable
    $("#"+popupId+"text").popover({
        html: false,
        content: content
    });

    // returns the element
    return popupDiv;
};

bus.UiParts.InputFilter = function(parentDiv, filterId){

    var div = parentDiv.append("input")
        .attr("id",filterId+"Input")
        .attr("type", "text")
        .attr("class", "form-control searchBusLine")
        .attr("data-provider", "typeahead");

    return div;
};

bus.UiParts.LineFilter = function(parentDiv, filterId){

    var div = parentDiv.append("input")
        .attr("id",filterId+"Input")
        .attr("type", "text")
        .attr("class", "form-control searchBusLine")
        .attr("data-provider", "typeahead");

    parentDiv.append("textarea")
        .attr("id", filterId+"Area")
        .attr("class", "form-control searchBusLine")
        .attr("cols", 20)
        .attr("rows", 2);

    return div;
};