const fs = require("fs");
const d3 = require("d3");
const JSDOM = require("jsdom/lib/old-api.js");


const withWindow = func =>
  JSDOM.env({
    html: "",
    features: { QuerySelector: true },
    done: (errors, window) => func(window)
  });

const drawUSMapD3 = (data, options, callback) => window => {

  const { height, width } = options;

const arc = d3.arc().outerRadius(chartWidth / 2 - 10).innerRadius(0);

const colours = [
  "#F00",
  "#000",
  "#000",
  "#000",
  "#000",
  "#000",
  "#000",
  "#000",
  "#000"
];

  window.d3 = d3.select(window.document); //get d3 into the dom

  const svg = window.d3
    .select("body")
    .append("div")
    .attr("class", "container")
    .append("svg")

  svg
    .attr('xmlns', "http://www.w3.org/2000/svg")
    .attr('width', width)
    .attr('height', height)

  svg
    .append("g")
    .attr(
      "transform",
      "translate(" + chartWidth / 2 + "," + chartWidth / 2 + ")"
    );

  svg
    .selectAll(".arc")
    .data(d3.pie()(data))
    .enter()
    .append("path")
    .attr('class', 'arc')
    .attr('d', arc)
    .attr('fill', (d, i) => colours[i])
    .attr(
      'stroke', "#fff"
    );

  callback(window.d3.select(".container").html())
};

module.exports = function(pieData = [12, 31], outputLocation = "pie.svg") {
  withWindow(drawUSMapD3(pieData, drawing => {
    console.log(drawing)
    fs.writeFileSync(outputLocation, drawing)
  }))
}

if (require.main === module) {
  module.exports();
}
