d3.json("samples.json").then((inData) =>{
    console.log(inData);
    
    d3.select("#selDataset").selectAll("option")
        .data(inData.names)
        .enter()
        .append("option")
        .text(function(d){return d});

    var initialValue = d3.select("#selDataset").select("option").text();
    optionChanged(initialValue);

});

function optionChanged(name){
    d3.json("samples.json").then((inData)=>{
        // STORING THE SAMPLEDATA BIOGRAPHY INFO 
        var biography;
        var sampleData;
        for (var i=0; i<inData.samples.length; i++){
            if (parseInt(name) === inData.metadata[i].id){
                biography = inData.metadata[i];
                sampleData = inData.samples[i];
            };
        }
        console.log({'biography': biography, 'sample':sampleData});

        // CREATING THE DEMOGRAPHIC INFORMATION
        d3.select("#sample-metadata").selectAll("p").remove().append("p");
        // AFTER CLEANING THE BOX APPEN NEW INFORMATION
        var demographic = [];
        Object.entries(biography).forEach(([key, value]) =>{
            if(value !== null){
                demographic.push(`${key} : ${value}`)
            }
        });
        d3.select("#sample-metadata")
        .selectAll("p")
        .data(demographic)
        .enter()
        .append("p")
        .text(function(d){return d});

        //CREATING THE BAR PLOT FOR EACH ENTRY
        d3.select("#sample-metadata").selectAll("p")
            .data(biography.id)
            .enter()
            .append("p")
            .text(`id : ${biography.id}`)

        var traceBar ={
            x : sampleData.sample_values.slice(0,10).reverse(),
            y : sampleData.otu_ids.slice(0,10).reverse().map(val => `OTU ${val}`),
            text : sampleData.otu_labels.slice(0,10).reverse(),
            type : "bar",
            orientation : "h"
        }
        var dataBar =[traceBar];
        Plotly.newPlot("bar", dataBar);
        
        // CREATING THE BUBBLE PLOT FOR THE ENTRY
        var traceBubble = {
            x : sampleData.otu_ids,
            y : sampleData.sample_values,
            text : sampleData.otu_labels,
            mode : "markers",
            marker : {
                size : sampleData.sample_values,
                color : sampleData.otu_ids
            }
        }
        var dataBubble = [traceBubble];
        Plotly.newPlot("bubble", dataBubble);

        // CREATING GAUGE PLOT
        var data = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: biography.wfreq,
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per week" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [0, 10] },
                steps: [
                    { range: [0, 1], color: "rgb(210,240,200)" },
                    { range: [1, 2], color: "rgb(200,230,190)" },
                    { range: [2, 3], color: "rgb(190,220,180)" },
                    { range: [3, 4], color: "rgb(180,210,170)" },
                    { range: [4, 5], color: "rgb(170,200,160)" },
                    { range: [5, 6], color: "rgb(160,190,150)" },
                    { range: [6, 7], color: "rgb(150,180,140)" },
                    { range: [7, 8], color: "rgb(140,170,130)" },
                    { range: [8, 9], color: "rgb(130,160,120)" },
                    { range: [9, 10], color: "rgb(120,140,110)" }
                ]
            }
        }]; 
        var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', data, layout);
    });
};


