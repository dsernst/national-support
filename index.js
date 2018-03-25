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

const withSVG = (options, callback) =>
  new Promise((resolve, reject) =>
    withWindow(window => {
      window.d3 = d3.select(window.document); //get d3 into the dom
      const svg = window.d3
        .select("body")
        .append("div")
        .attr("class", "container")
        .append("svg")
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("width", options.width)
        .attr("height", options.height)
        .append("g");
      callback(svg);
      // TODO: It might be better to find the size of the 'g' element and simply force the whole SVG element into fram with the height width and transformation.
      resolve(window.d3.select(".container").html());
    })
  );

/**
 * @returns Promise
 */
module.exports = function(data, options = {}) {
  const svgOptions = {height: options.height || 600, width: options.width || 960}
  return withSVG(svgOptions, drawUSMapD3(undefined, options))
};

if (require.main === module) {
  module.exports().then(svg =>
    fs.writeFile('map.svg', svg, () => {console.info("Wrote map to file 'map.svg'")})
  )
}
