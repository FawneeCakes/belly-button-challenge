// 1.Use the D3 library to read in samples.json from the URL 
// Creating variable for our URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending, this is the middle step for having our data ready when we run the code
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);
  });

// 2. Create a horizontal bar chart with a dropdownMenu menu to display the top 10 OTUs found in that individual
// Load the data using d3.json (our 'data' object contains the properties from our url)
d3.json(url).then(function(data) {
  
// Select the dropdownMenu menu element (the HTML element is a dropdown menu (a <select> element)) and populate it with options
let dropdownMenu = d3.select("#selDataset");
// Extract the values for 'names' in the data
let names = data.names;
// Using 'forEach' method to loop through the 'names' array
names.forEach(function(name) {
  dropdownMenu.append("option")
          .text(name)
          .property("value", name);
});

// Set the default ID to display (first value within 'names')
let defaultID = names[0];

// Call the updateBarChart function to create the initial plot
updateBarChart(defaultID);

// Define the updateBarChart function to update the plot when the dropdownMenu is changed
function updateBarChart(id) {
  
  // Filter the data to get 10 selected sample's OTUs and sort them in descending order
  let sample = data.samples.filter(function(s) { return s.id === id; })[0];
  let otu_ids = sample.otu_ids.slice(0, 10).reverse();
  let sample_values = sample.sample_values.slice(0, 10).reverse();
  let otu_labels = sample.otu_labels.slice(0, 10).reverse();
  
  // Create the trace for the horizontal bar chart
  let trace1 = {
    x: sample_values,
    y: otu_ids.map(id => `OTU ${id}`),
    text: otu_labels,
    type: "bar",
    orientation: "h"
  };

  
  // Define the layout for the chart
  let layout = {
    title: "Top 10 OTUs Found",
    xaxis: { title: "Sample Values" },
    yaxis: { title: "OTU IDs" }
  };
  
  // Plot the chart
  Plotly.newPlot("bar", [trace1], layout);
}

// 3. Create a bubble chart that displays each sample
// Define the updateBubbleChart function to update the plot when the dropdownMenu is changed
function updateBubbleChart(id) {
  
    // Filter the data to get selected sample's OTUs
    let sample = data.samples.filter(function(s) { return s.id === id; })[0];
    let otu_ids = sample.otu_ids;
    let sample_values = sample.sample_values;
    let otu_labels = sample.otu_labels;
    
    // Create the trace for the bubble chart
    let trace2 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      type: 'bubble',
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colourscale: "Earth"
      }
    };
  
    
    // Define the layout for the chart
    let layout = {
      title: "Sample Bubble Chart",
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "Sample Values" }
    };
    
    // Plot the chart
    Plotly.newPlot("bubble", [trace2], layout);
  }

// On change to the DOM, call dropdownMenuChanged()
d3.select("#selDataset").on("change", dropdownMenuChanged);

// 4.Display the sample metadata, i.e., an individual's demographic information.
// 5.Display each key-value pair from the metadata JSON object somewhere on the page.
// Define the updateMetadata function to update the demographic info when the dropdownMenu is changed
function updateMetadata(id) {

    // Filter the data to get the metadata for the selected sample
    let metadata = data.metadata.filter(function(sample) { return sample.id.toString() === id; })[0];
  
    // Select the panel-body element and clear any existing metadata
    let panelBody = d3.select("#sample-metadata");
    panelBody.html("");
  
    // Use Object.entries to add each key-value pair to the panel-body
    Object.entries(metadata).forEach(function([key, value]) {
      panelBody.append("p").text(`${key}: ${value}`);
    });
  }
  
// Call the updateMetadata function to display the initial demographic info
updateMetadata(defaultID);
// Call the updateBubbleChart function to create the initial plot
updateBubbleChart(defaultID);
  
 // Define the function to handle dropdownMenu changes
 function dropdownMenuChanged() {
   let id = d3.select("#selDataset").property("value");
   updateBarChart(id);
   updateBubbleChart(id);
   updateMetadata(id);
 }
 
});