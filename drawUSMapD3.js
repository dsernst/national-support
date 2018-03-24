const d3 = require("d3");
const topojson = require('topojson')
const us = require('./us.json')
const congress = require('./us-congress-113.json')

module.exports = (data, options, callback) => svg => {

  //const { height=960, width=600 } = options;

  var projection = d3.geoAlbersUsa()
    .scale(1280)
    //.translate([width / 2, height / 2]);

  var path = d3.geoPath()
    .projection(projection);

  svg.append("defs").append("path")
      .attr("id", "land")
      .datum(topojson.feature(us, us.objects.land))
      .attr("d", path);

  svg.append("clipPath")
      .attr("id", "clip-land")
    .append("use")
      .attr("xlink:href", "#land");

  svg.append("g")
      .attr("class", "districts")
      .attr("clip-path", "url(#clip-land)")
    .selectAll("path")
      .data(topojson.feature(congress, congress.objects.districts).features)
    .enter().append("path")
      .attr("d", path)
    .append("title")
      .text(function(d) { return d.id; });

  svg.append("path")
      .attr("class", "district-boundaries")
      .datum(topojson.mesh(congress, congress.objects.districts, function(a, b) { return a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0); }))
      .attr("d", path);

  svg.append("path")
      .attr("class", "state-boundaries")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("d", path);
}
