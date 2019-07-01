//drawing the chart area

var svgWidth = 900;
var svgHeight = 800;
var margin = {
  top: 30,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");

var div = d3.select("#chart").append("div").attr("class", "tooltip").style("opacity", 0);

//importing the data file

d3.csv("data.csv", function (err, censusInfo) {
  if (err) throw err;
  censusInfo.forEach(function (data) {
    data.state = data.state;
    data.abbr = data.abbr;
    data.poverty = +data.poverty;
    data.smokes = +data.smokes;
  });

  // scaling 
  var yLinearScale = d3.scaleLinear().range([height, 0]);
  var xLinearScale = d3.scaleLinear().range([0, width]);
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  var xMin;
  var xMax;
  var yMin;
  var yMax;

  xMin = d3.min(censusInfo, function (data) {
    return +data.poverty * 0.85;
  });

  xMax = d3.max(censusInfo, function (data) {
    return +data.poverty * 1;
  });

  yMin = d3.min(censusInfo, function (data) {
    return +data.smokes * 0.85;
  });

  yMax = d3.max(censusInfo, function (data) {
    return +data.smokes * 1;
  });

  xLinearScale.domain([xMin, xMax]);
  yLinearScale.domain([yMin, yMax]);
  console.log(xMin);
  console.log(yMax);

  var state_text = "State: "
  var pov_perc = "In Poverty(%): "
  var active_perc = "Smokes (%): "

  chart.selectAll("circle")
    .data(censusInfo)
    .enter()
    .append("circle")
    .attr("cx", function (data, index) {
      return xLinearScale(data.poverty);
    })
    .attr("cy", function (data, index) {
      return yLinearScale(data.smokes);
    })
    .attr("r", 12)
    .attr("fill", "#0066cc")
    // tooltip

    .on("mouseover", function (data) {
      div.transition()
        .duration(100)
        .style("opacity", .9);
      div.html(state_text.bold() + data.state + "<br/>" + pov_perc.bold() + data.poverty + "<text>%</text>" + "<br/>" + active_perc.bold() + data.smokes + "<text>%</text>")
        .style("left", (d3.event.pageX) + 10 + "px")
        .style("top", (d3.event.pageY - 0) + "px");
    })

    .on("mouseout", function (data, index) {
      div.transition()
        .duration(500)
        .style("opacity", 0);
    });

  chart.append("text")
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .style("font-weight", "bold")
    .style("font-family", "arial")
    .selectAll("tspan")
    .data(censusInfo)
    .enter()
    .append("tspan")
    .attr("x", function (data) {
      return xLinearScale(data.poverty - 0);
    })
    .attr("y", function (data) {
      return yLinearScale(data.smokes - 0.1);
    })
    .text(function (data) {
      return data.abbr
    });

  chart
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chart.append("g").call(leftAxis);

  chart
    .append("text")
    .style("font-family", "arial")
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 20)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("class", "axis-text")
    .text("Smokes (%)");

  chart
    .append("text")
    .style("font-family", "arial")
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 30) + ")"
    )
    .attr("class", "axis-text")
    .text("In Poverty (%)");


});