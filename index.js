const fs = require("fs");
const d3 = require("d3");
const JSDOM = require("jsdom/lib/old-api.js");

const drawUSMapD3 = require("./drawUSMapD3");

const withWindow = callback =>
  JSDOM.env({
    html: "",
    features: { QuerySelector: true },
    done: (errors, window) => callback(window)
  });

const withSVG = (options, callback) => new Promise((resolve, reject) =>
  withWindow(window => {
    window.d3 = d3.select(window.document); //get d3 into the dom
    const svg = window.d3
    .select("body")
    .append("div")
    .attr("class", "container")
    .append("svg")
    .attr('xmlns', "http://www.w3.org/2000/svg")
    .attr('width', options.width)
    .attr('height', options.height)
    .append("g")
    //.attr( "transform", "translate(" + options.height / 2 + "," + options.width / 2 + ")");

    callback(svg)
    resolve(window.d3.select(".container").html())
  })
)

const drawD3 = (data, options, callback) => svg => {
};

module.exports = function() {
  withSVG({height: 600, width: 960}, drawUSMapD3({}, {}))
  .then(drawing => {
    console.log(drawing)
    fs.writeFileSync('map.svg', drawing)
  })
}

if (require.main === module) {
  module.exports();
}
