/**
#
# DOT Time Tool, based on Pluto data viewer
#
*/

bus.PlotCard = function(plotType){
    // d3js chart
    var chart = undefined;
    var plotType = plotType;

    // Divs
    var cardDiv  = undefined;
    var chartDiv = undefined;
    var saveBtn = undefined;
    var drop = undefined;
    var data1 = undefined;
    var data2 = undefined;
    var filename1 = undefined;
    var filename2 = undefined;
    var filters1 = undefined;
    var filters2 = undefined;

    // exported api
    var exports = {};

    // clears the chart
    function clearChart(){
        // clean DOM
        if(chartDiv) chartDiv.remove();

        // erase chart
        if(chart){
            chart = undefined;
        }
    }

    // create the div
    function createDiv(parentDiv){
        // creates the new card div
        cardDiv = parentDiv.append("div");
        // setup
        cardDiv.attr("index",bus.globalCardId)
            .classed("bgStyle card",true);
    }

    function getLines(){
        var lines = [];
        for(var l in data1) {
            var line = data1[l].line;
            if(lines.indexOf(line) == -1)
                lines.push(line);
        }
        for(var l in data2){
            var line = data2[l].line;
            if(lines.indexOf(line) == -1)
                lines.push(line);
        }

        return lines.sort().reverse();
    }

    // creates the chart
    function createChart(line){

        if(line == undefined) line = "all";

        // erases old json
        clearChart();

        if(saveBtn == undefined) {
            saveBtn = bus.UiParts.Button(cardDiv,"saveChart", "glyphicon glyphicon-picture","leftSpace topSpace");
        }

        if(drop == undefined) {
            drop = bus.UiParts.DropDown(cardDiv,"lineDropdown","leftSpace topSpace");

            // gets the list
            var ul = drop.select("ul");
            // sets the button label
            drop.select("button").html("Line");

            // binds json to items and appends
            ul.selectAll("li")
                .data(getLines())
                .enter()
                .append('li')
                .html(function(d) { return '<a href="#">' + d + '</a>'; })
                .style("font-weight", "normal")
                .attr("id", function(d){return "plotLines_"+d});

            ul.select("#plotLines_all").select("a").style("font-weight", "bold");

            // updates the button when selecting an item
            ul.selectAll("li")
                .on('click', function(d){
                    ul.selectAll("a").style("font-weight", "normal");
                    d3.select(this).select("a").style("font-weight", "bold");
                    updateChart(d);
                });
        }


        // create chartDiv
        chartDiv = cardDiv.append("div");
        chartDiv.style("padding","5px")
            .style("margin-top", "0px");

        var filename = filename1.replace(/\.[^/.]+$/, "")+"_"+filename2.replace(/\.[^/.]+$/, "");
        if(plotType === "barchart")
            chart = new bus.BarChart();
        else if(plotType === "boxplot")
            chart = new bus.BoxPlot();

        // filter data1 and data2 by line
        var filteredData = {}
        filteredData[0] = data1.filter(function(d) {return d.line == line});
        filteredData[1] = data2.filter(function(d) {return d.line == line});

        chart.create(chartDiv,filteredData, filename);

        saveBtn.on('click', function(){
            chart.saveImage(filename+".png");
        });
    }

    function updateChart(line) {

        if(plotType === "barchart") {
            var filteredData = {}
            filteredData[0] = data1.filter(function(d) {return d.line == line});
            filteredData[1] = data2.filter(function(d) {return d.line == line});

            chart.update(filteredData);
        }
        else {
            createChart(line);
        }
    }

    function parseLine(d) {
        return {
                segment: parseInt(d.segment),
                line: d.line,
                mean : parseFloat(d.mean),
                median : parseFloat(d.median),
                count : parseFloat(d.count),
                min : parseFloat(d.min),
                max : parseFloat(d.max),
                percentile25th: parseFloat(d.percentile25th),
                percentile75th: parseFloat(d.percentile75th)
            };
    }

    function fileSelector(propId){
        var dropId = "propSelector";

        var dropClass = propId==0?"":"leftSpace";

        var file1 = bus.UiParts.File(cardDiv,"plotFileInput1_"+bus.globalCardId,dropClass, "Select file: ");
        
        var file2 = bus.UiParts.File(cardDiv,"plotFileInput2_"+bus.globalCardId, dropClass, "Select file: ");

        // createChart();

        var cardId = bus.globalCardId;
        $("#plotFileInput1_"+bus.globalCardId).change(function() {
            var reader = new FileReader();
            filename1 = this.files[0].name;
            reader.readAsText(this.files[0]);
            reader.onload = function() {
                filters1 = reader.result.substring(0,reader.result.indexOf("\n"));
                var popup1 = bus.UiParts.Popup(file1, "plotPopup1_"+cardId, dropClass, "(+)", "File 1 filters", filters1.replace(/,/g,"\n"));

                var csv = reader.result.substring(reader.result.indexOf("\n")+1);
                data1 = d3.csv.parse(csv, function(d) {
                    return parseLine(d);
                });
                if(data1 != undefined && data2 != undefined) {
                    createChart();
                }
            }
        });

        d3.select("[for=plotFileInput2_"+bus.globalCardId+"]").attr("style", "background-color: rgb(255, 127, 14); border-color: rgb(215, 127, 14)")
        $("#plotFileInput2_"+bus.globalCardId).change(function() {
            var reader = new FileReader();
            filename2 = this.files[0].name;
            reader.readAsText(this.files[0]);
            reader.onload = function() {
                filters2 = reader.result.substring(0,reader.result.indexOf("\n"));
                var popup2 = bus.UiParts.Popup(file2, "plotPopup2_"+cardId, dropClass, "(+)", "File 1 filters", filters2.replace(/,/g,"\n"));

                var csv = reader.result.substring(reader.result.indexOf("\n")+1);
                data2 = d3.csv.parse(csv, function(d) {
                    return parseLine(d);
                });
                if(data1 != undefined && data2 != undefined) {
                    createChart();
                }               
            }
        });
    }

    // closes the card
    function closeCard(){
        var buttonId = "closeCard";

        // adds the button
        var btn = bus.UiParts.Button(cardDiv, buttonId, "glyphicon glyphicon-remove");
        // add callback
        btn.on("click", function(){
            // clears the chart
            clearChart();
            // remove the card
            if(cardDiv) cardDiv.remove();
        });

        cardDiv.append("br");
    }

    // card creation
    exports.initCard = function(){
        // gets the cards div
        var mainDiv = d3.select("#cards");
        // creates the card div
        createDiv(mainDiv);
        // close card
        closeCard();

        // card menu
        fileSelector(0);
        
   };

    // public api
    return exports;
};