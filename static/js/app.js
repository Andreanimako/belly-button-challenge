// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;
    console.log(metadata);


    // Filter the metadata for the object with the desired sample number
    let result = metadata.filter(object => object.id == sample);
    let idResult = result[0];
    console.log(idResult);

    // Use d3 to select the panel with id of `#sample-metadata`
    let sample_metadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sample_metadata.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(idResult).forEach(([key, value]) => {
      sample_metadata.append("h6").text(`${key.toUpperCase()}: ${value}`);
  });
});
};


// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let Samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let findings = Samples.filter(object => object.id == sample);
    let Result = findings[0];
    console.log(Result);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids= Result.otu_ids;
    let otu_labels= Result.otu_labels;
    let sample_values= Result.sample_values;
    console.log(otu_ids);

    // Build a Bubble Chart
    let bubbleTrace= {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode:'markers',
      marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: 'Earth'
        }
    };

    let bubbleLayout = {
        title: 'Bacteria Cultures Per Sample',
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Number of Bateria' }
    };

    let bubbleData = [bubbleTrace];

    
    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout)


    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks=[]
    for (let i = 0; i< otu_ids.length; i++){
      yticks.push("OTU"+ otu_ids[i])
    };
    console.log(yticks);

    let topten = sample_values.sort(function sortFunction(a,b) {
      return b-a;
    });
    let toptenSliced = topten.slice(0,10);

    let toptenList = toptenSliced.reverse();
    console.log(toptenList);

    // Build a Bar Chart
    let barTrace={
      x: toptenList,
      y: yticks,
      text: otu_labels,
      type:'bar',
      orientation: "h"
    };

    let barLayout = {
        title: 'Top 10 Bacteria Cultures Found',
        xaxis: { title: 'Number of Bateria' },
        margin: {
          l: 120,
          r: 100,
          t: 100,
          b: 100
        }
      
    };

    let barData = [barTrace];
    
    // Don't forget to slice and reverse the input data appropriately
    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);

  });
}


// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    input = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    
    names.forEach((sample) =>{
      input.append("option").text(sample).property("value",sample)
    })

    // Get the first sample from the list
    let firstSample= names[0];
    console.log(firstSample);

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Function for event listener 
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  
  buildMetadata(newSample);
  buildCharts(newSample);
};

// Initialize the dashboard

init();
