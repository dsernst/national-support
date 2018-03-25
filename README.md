# national-support

Really good example of this type of map in d3: https://bl.ocks.org/mbostock/4060606

```
const ns = require('national-support')

ns({districtColors: {
  TX3: "#abc",
  TX4: "yellow",
  CA1: "black"
}, defaultColor: "grey" // default color for districts with not values.
}).then(svg => youGotTheSVG(svg))

// List all the districts. Not in any order.
ns.districts // => ["NE1", "NE2", .... "GA4", "IL7"]

```
