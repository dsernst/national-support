const d3 = require("d3");
const topojson = require("topojson");
const us = require("./us.json");
const congress = require("./us-congress-113.json");

const STATE_CODES = {
  1: "AL",
  2: "AK",
  4: "AZ",
  5: "AR",
  6: "CA",
  8: "CO",
  9: "CT",
  10: "DE",
  11: "DC",
  12: "FL",
  13: "GA",
  15: "HI",
  16: "ID",
  17: "IL",
  18: "IN",
  19: "IA",
  20: "KS",
  21: "KY",
  22: "LA",
  23: "ME",
  24: "MD",
  25: "MA",
  26: "MI",
  27: "MN",
  28: "MS",
  29: "MO",
  30: "MT",
  31: "NE",
  32: "NV",
  33: "NH",
  34: "NJ",
  35: "NM",
  36: "NY",
  37: "NC",
  38: "ND",
  39: "OH",
  40: "OK",
  41: "OR",
  42: "PA",
  44: "RI",
  45: "SC",
  46: "SD",
  47: "TN",
  48: "TX",
  49: "UT",
  50: "VT",
  51: "VA",
  53: "WA",
  54: "WV",
  55: "WI",
  56: "WY",
  60: "AS",
  64: "FM",
  66: "GU",
  68: "MH",
  69: "MP",
  70: "PW",
  72: "PR",
  74: "UM",
  78: "VI"
};

module.exports = (data, options, callback) => svg => {
  // const { height=960, width=600 } = options;
  const {
    districtColors = {},
    /*{
      TX3: "brown",
      GA4: "red",
      MT0: "blue",
      MN1: "blue",
      CA4: "green"
    },*/
    defaultColor = "#ccc"
  } = options;

  const projection = d3
    .geoAlbersUsa()
    // .scale(Math.floor(Math.sqrt(height * height + width * width))
    .scale(1080);

  const path = d3.geoPath().projection(projection);

  svg
    .append("defs")
    .append("path")
    .attr("id", "land")
    .datum(topojson.feature(us, us.objects.land))
    .attr("d", path)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round");

  svg
    .append("clipPath")
    .attr("id", "clip-land")
    .append("use")
    .attr("xlink:href", "#land");

  svg
    .append("g")
    .attr("class", "districts")
    .attr("clip-path", "url(#clip-land)")
    .selectAll("path")
    .data(topojson.feature(congress, congress.objects.districts).features)
    .enter()
    .append("path")
    .attr("class", d =>
      [
        STATE_CODES[Math.floor(d.id / 100)] + d.id % 100,
        STATE_CODES[Math.floor(d.id / 100)]
      ].join(" ")
    )
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", path)
    .attr("fill", d => {
      //return d3.interpolateGreens(d.id / 7000);
      return districtColors[STATE_CODES[Math.floor(d.id / 100)] + d.id % 100] || defaultColor
    });

  svg
    .append("path")
    .attr("class", "district-boundaries")
    .datum(
      topojson.mesh(congress, congress.objects.districts, function(a, b) {
        return a !== b && ((a.id / 100) | 0) === ((b.id / 100) | 0);
      })
    )
    .attr("d", path)
    .attr("stroke-width", "0.5px")
    .attr("stroke", "white")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("fill", 'none')

  svg
    .append("path")
    .attr("class", "state-boundaries")
    .datum(
      topojson.mesh(
        us,
        us.objects.states,
        // Filters points
        function(a, b) {
          return a !== b; // && ((a.id / 100) | 0) === ((b.id / 100) | 0)
        }
      )
    )
    .attr("d", path)
    .attr("stroke-width", "1px")
    .attr("stroke", "white")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("fill", 'none');

  return svg;
};
