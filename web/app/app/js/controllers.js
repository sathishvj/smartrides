'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('NavCtrl', ["$scope", "$http", "$location", '$route', function ($scope, $http, $location, $route) {
		switch($location.path()) {
			case "":
			case "/home":
				$scope.activeLink = "Home";
				break;
			case "/about":
				$scope.activeLink = "About";
				break;
			case "/sensors":
				$scope.activeLink = "Sensors";
				break;
			case "/bikes":
				$scope.activeLink = "Bikes";
				break;
			case "/bikers":
				$scope.activeLink = "Bikers";
				break;
			case "/Biker Gangs":
				$scope.activeLink = "BikerGangs";
				break;
			case "/feedback":
				$scope.activeLink = "Feedback";
				break;
		}

        $scope.setActive = function (selLink) {
			//this call doesn't seem to stop the page from reloading when clicking an already selected link
			if ($scope.activeLink === selLink) {
				return;
			}
            $scope.activeLink = selLink;
        };

		$scope.showHelp = false;

		$scope.startIntro = function (){
			var intro = introJs();
			intro.setOptions({
				steps: [
				{
					element: document.querySelector('.logo'),
					intro: "Smart Ride connects your bike rides, bikers, and bikes and is able to collect various data using sensors.",
					position: 'bottom'
				},
				{
					element: document.querySelector('#menuHome'),
					intro: "A dashboard of all your activities and a visualization of available data. (Currently a mock up with saved data.)",
					position: 'bottom'
				},
				{
					element: document.querySelector('#menuSensors'),
					intro: "Get a view of all sensors on all the bikes.",
					position: 'bottom'
				},
				{
					element: document.querySelector('#menuBikes'),
					intro: "Get a view of all the vehicles you are managing.",
					position: 'bottom'
				},
				{
					element: document.querySelector('#menuBikers'),
					intro: "Get a view of all the vehicles you are managing.",
					position: 'bottom'
				}
				,
				{
					element: document.querySelector('#menuBikerGangs'),
					intro: "Group your rides based on the gangs you are riding with and see data about each ride.",
					position: 'bottom'
				}
				
			]
			});

			intro.start();
		};

    }])
	.controller("GoogleMapsCtrl", [ "$scope", "mapService", "optionsService", "$timeout", function($scope, mapService, optionsService, $timeout) {
		//$scope.options = optionsService.getOptions();

		angular.extend($scope, {
			center: {
				latitude: mapService.location.lat, // initial map center latitude
				longitude: mapService.location.lon // initial map center longitude
			},
			markers: [], // an array of markers,
			zoom: 4 // the zoom level
		});

		//var a = $scope.center;

		//$scope.center = {
			//latitude: 29,
			//longitude: 29 
		//};
		//var t = $timeout( function() { 
			//mapService.location = {"lat": 17, "lon": 57};
			//console.log(mapService.location); 
		//}, 2000);
		setInterval(function(){
			$scope.$apply(function() {
				$scope.center = {
					latitude:  Math.floor(Math.random()*90),
					longitude:  Math.floor(Math.random()*180)
				};
			});
		//}, 100000);
		}, 1000 * optionsService.getOptions().Maps.interval);

		//$scope.$watch("mapService.location", function(newVal, oldVal) {
			//console.log(newVal);
			//console.log(oldVal);
			//console.log("Here inside watch.");
			//console.log(location.lat, location.lon);
			//a.latitude = 88;
			//$scope.center = {
				//latitude: mapService.location.lat,
				//longitude: mapService.location.lon 
			//};
		//});
	}])
    .controller('d3SunburstCtrl', ["$scope", "$http", "$location", '$route', function ($scope, $http, $location, $route) {
		var width = 960;
		var height = 600;
		var radius = Math.min(width, height) / 2;

		// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
		var b = {
		  w: 75, h: 30, s: 3, t: 10
		};

		// Mapping of step names to colors.
		/*
		 *var colors = {
		 *  "home": "#5687d1",
		 *  "product": "#7b615c",
		 *  "search": "#de783b",
		 *  "account": "#6ab975",
		 *  "other": "#a173d1",
		 *  "end": "#bbbbbb"
		 *};
		 */

		var colors = {
		  "Gangs": "#5687d1",
		  "Bikes": "#7b615c",
		  "Riders": "#de783b",
		  "Sensors": "#6ab975",
		  "Proximity": "#a173d1",
		  "Position": "#bbbbbb"
		};

		// Total size of all segments; we set this later, after loading the data.
		var totalSize = 0; 

		var vis = d3.select("#chart").append("svg:svg")
			.attr("width", width)
			.attr("height", height)
			.append("svg:g")
			.attr("id", "container")
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

		var partition = d3.layout.partition()
			.size([2 * Math.PI, radius * radius])
			.value(function(d) { return d.size; });

		var arc = d3.svg.arc()
			.startAngle(function(d) { return d.x; })
			.endAngle(function(d) { return d.x + d.dx; })
			.innerRadius(function(d) { return Math.sqrt(d.y); })
			.outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

		// Use d3.text and d3.csv.parseRows so that we do not need to have a header
		// row, and can receive the csv as an array of arrays.
		d3.text("testdata/visit-sequences.csv", function(text) {
		  var csv = d3.csv.parseRows(text);
		  var json = buildHierarchy(csv);
		  createVisualization(json);
		});

		// Main function to draw and set up the visualization, once we have the data.
		function createVisualization(json) {
		//$scope.createVisualization = function (json) {

		  // Basic setup of page elements.
		  initializeBreadcrumbTrail();
		  drawLegend();
		  d3.select("#togglelegend").on("click", toggleLegend);

		  // Bounding circle underneath the sunburst, to make it easier to detect
		  // when the mouse leaves the parent g.
		  vis.append("svg:circle")
			  .attr("r", radius)
			  .style("opacity", 0);

		  // For efficiency, filter nodes to keep only those large enough to see.
		  var nodes = partition.nodes(json)
			  .filter(function(d) {
			  return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
			  });

		  var path = vis.data([json]).selectAll("path")
			  .data(nodes)
			  .enter().append("svg:path")
			  .attr("display", function(d) { return d.depth ? null : "none"; })
			  .attr("d", arc)
			  .attr("fill-rule", "evenodd")
			  .style("fill", function(d) { return colors[d.name]; })
			  .style("opacity", 1)
			  .on("mouseover", mouseover);

		  // Add the mouseleave handler to the bounding circle.
		  d3.select("#container").on("mouseleave", mouseleave);

		  // Get total size of the tree = value of root node from partition.
		  totalSize = path.node().__data__.value;
		 //};
		 };

		// Fade all but the current sequence, and show it in the breadcrumb trail.
		function mouseover(d) {

		  var percentage = (100 * d.value / totalSize).toPrecision(3);
		  var percentageString = percentage + "%";
		  if (percentage < 0.1) {
			percentageString = "< 0.1%";
		  }

		  d3.select("#percentage")
			  .text(percentageString);

		  d3.select("#explanation")
			  .style("visibility", "");

		  var sequenceArray = getAncestors(d);
		  updateBreadcrumbs(sequenceArray, percentageString);

		  // Fade all the segments.
		  d3.selectAll("path")
			  .style("opacity", 0.3);

		  // Then highlight only those that are an ancestor of the current segment.
		  vis.selectAll("path")
			  .filter(function(node) {
						return (sequenceArray.indexOf(node) >= 0);
					  })
			  .style("opacity", 1);
		}

		// Restore everything to full opacity when moving off the visualization.
		function mouseleave(d) {

		  // Hide the breadcrumb trail
		  d3.select("#trail")
			  .style("visibility", "hidden");

		  // Deactivate all segments during transition.
		  d3.selectAll("path").on("mouseover", null);

		  // Transition each segment to full opacity and then reactivate it.
		  d3.selectAll("path")
			  .transition()
			  .duration(1000)
			  .style("opacity", 1)
			  .each("end", function() {
					  d3.select(this).on("mouseover", mouseover);
					});

		  d3.select("#explanation")
			  .transition()
			  .duration(1000)
			  .style("visibility", "hidden");
		}

		// Given a node in a partition layout, return an array of all of its ancestor
		// nodes, highest first, but excluding the root.
		function getAncestors(node) {
		  var path = [];
		  var current = node;
		  while (current.parent) {
			path.unshift(current);
			current = current.parent;
		  }
		  return path;
		}

		function initializeBreadcrumbTrail() {
		  // Add the svg area.
		  var trail = d3.select("#sequence").append("svg:svg")
			  .attr("width", width)
			  .attr("height", 50)
			  .attr("id", "trail");
		  // Add the label at the end, for the percentage.
		  trail.append("svg:text")
			.attr("id", "endlabel")
			.style("fill", "#000");
		}

		// Generate a string that describes the points of a breadcrumb polygon.
		function breadcrumbPoints(d, i) {
		  var points = [];
		  points.push("0,0");
		  points.push(b.w + ",0");
		  points.push(b.w + b.t + "," + (b.h / 2));
		  points.push(b.w + "," + b.h);
		  points.push("0," + b.h);
		  if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
			points.push(b.t + "," + (b.h / 2));
		  }
		  return points.join(" ");
		}

		// Update the breadcrumb trail to show the current sequence and percentage.
		function updateBreadcrumbs(nodeArray, percentageString) {

		  // Data join; key function combines name and depth (= position in sequence).
		  var g = d3.select("#trail")
			  .selectAll("g")
			  .data(nodeArray, function(d) { return d.name + d.depth; });

		  // Add breadcrumb and label for entering nodes.
		  var entering = g.enter().append("svg:g");

		  entering.append("svg:polygon")
			  .attr("points", breadcrumbPoints)
			  .style("fill", function(d) { return colors[d.name]; });

		  entering.append("svg:text")
			  .attr("x", (b.w + b.t) / 2)
			  .attr("y", b.h / 2)
			  .attr("dy", "0.35em")
			  .attr("text-anchor", "middle")
			  .text(function(d) { return d.name; });

		  // Set position for entering and updating nodes.
		  g.attr("transform", function(d, i) {
			return "translate(" + i * (b.w + b.s) + ", 0)";
		  });

		  // Remove exiting nodes.
		  g.exit().remove();

		  // Now move and update the percentage at the end.
		  d3.select("#trail").select("#endlabel")
			  .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
			  .attr("y", b.h / 2)
			  .attr("dy", "0.35em")
			  .attr("text-anchor", "middle")
			  .text(percentageString);

		  // Make the breadcrumb trail visible, if it's hidden.
		  d3.select("#trail")
			  .style("visibility", "");

		}

		function drawLegend() {

		  // Dimensions of legend item: width, height, spacing, radius of rounded rect.
		  var li = {
			w: 75, h: 30, s: 3, r: 3
		  };

		  var legend = d3.select("#legend").append("svg:svg")
			  .attr("width", li.w)
			  .attr("height", d3.keys(colors).length * (li.h + li.s));

		  var g = legend.selectAll("g")
			  .data(d3.entries(colors))
			  .enter().append("svg:g")
			  .attr("transform", function(d, i) {
					  return "translate(0," + i * (li.h + li.s) + ")";
				   });

		  g.append("svg:rect")
			  .attr("rx", li.r)
			  .attr("ry", li.r)
			  .attr("width", li.w)
			  .attr("height", li.h)
			  .style("fill", function(d) { return d.value; });

		  g.append("svg:text")
			  .attr("x", li.w / 2)
			  .attr("y", li.h / 2)
			  .attr("dy", "0.35em")
			  .attr("text-anchor", "middle")
			  .text(function(d) { return d.key; });
		}

		function toggleLegend() {
		  var legend = d3.select("#legend");
		  if (legend.style("visibility") == "hidden") {
			legend.style("visibility", "");
		  } else {
			legend.style("visibility", "hidden");
		  }
		}

		// Take a 2-column CSV and transform it into a hierarchical structure suitable
		// for a partition layout. The first column is a sequence of step names, from
		// root to leaf, separated by hyphens. The second column is a count of how 
		// often that sequence occurred.
		function buildHierarchy(csv) {
		  var root = {"name": "root", "children": []};
		  for (var i = 0; i < csv.length; i++) {
			var sequence = csv[i][0];
			var size = +csv[i][1];
			if (isNaN(size)) { // e.g. if this is a header row
			  continue;
			}
			var parts = sequence.split("-");
			var currentNode = root;
			for (var j = 0; j < parts.length; j++) {
			  var children = currentNode["children"];
			  var nodeName = parts[j];
			  var childNode;
			  if (j + 1 < parts.length) {
		   // Not yet at the end of the sequence; move down the tree.
			var foundChild = false;
			for (var k = 0; k < children.length; k++) {
			  if (children[k]["name"] == nodeName) {
				childNode = children[k];
				foundChild = true;
				break;
			  }
			}
		  // If we don't already have a child node for this branch, create it.
			if (!foundChild) {
			  childNode = {"name": nodeName, "children": []};
			  children.push(childNode);
			}
			currentNode = childNode;
			  } else {
			// Reached the end of the sequence; create a leaf node.
			childNode = {"name": nodeName, "size": size};
			children.push(childNode);
			  }
			}
		  }
		  return root;
		};
	}])
    .controller('d3ShowReel', ["$scope", "$http", "$location", '$route', function ($scope, $http, $location, $route) {
		var m = [20, 20, 30, 20],
			w = 960 - m[1] - m[3],
			h = 500 - m[0] - m[2];

		var x,
			y,
			duration = 1500,
			delay = 500;

		var color = d3.scale.category10();

		//var svg = d3.select("body").append("svg")
		var svg = d3.select("#d3ShowReelChart").append("svg")
			.attr("width", w + m[1] + m[3])
			.attr("height", h + m[0] + m[2])
		  .append("g")
			.attr("transform", "translate(" + m[3] + "," + m[0] + ")");

		var stocks,
			symbols;

		// A line generator, for the dark stroke.
		var line = d3.svg.line()
			.interpolate("basis")
			.x(function(d) { return x(d.date); })
			.y(function(d) { return y(d.price); });

		// A line generator, for the dark stroke.
		var axis = d3.svg.line()
			.interpolate("basis")
			.x(function(d) { return x(d.date); })
			.y(h);

		// A area generator, for the dark stroke.
		var area = d3.svg.area()
			.interpolate("basis")
			.x(function(d) { return x(d.date); })
			.y1(function(d) { return y(d.price); });

		d3.csv("testdata/models.csv", function(data) {
		  var parse = d3.time.format("%b %Y").parse;

		  // Nest stock values by symbol.
		  symbols = d3.nest()
			  .key(function(d) { return d.symbol; })
			  .entries(stocks = data);

		  // Parse dates and numbers. We assume values are sorted by date.
		  // Also compute the maximum price per symbol, needed for the y-domain.
		  symbols.forEach(function(s) {
			s.values.forEach(function(d) { d.date = parse(d.date); d.price = +d.price; });
			s.maxPrice = d3.max(s.values, function(d) { return d.price; });
			s.sumPrice = d3.sum(s.values, function(d) { return d.price; });
		  });

		  // Sort by maximum price, descending.
		  symbols.sort(function(a, b) { return b.maxPrice - a.maxPrice; });

		  var g = svg.selectAll("g")
			  .data(symbols)
			.enter().append("g")
			  .attr("class", "symbol");

		  setTimeout(lines, duration);
		});

		function lines() {
		  x = d3.time.scale().range([0, w - 60]);
		  y = d3.scale.linear().range([h / 4 - 20, 0]);

		  // Compute the minimum and maximum date across symbols.
		  x.domain([
			d3.min(symbols, function(d) { return d.values[0].date; }),
			d3.max(symbols, function(d) { return d.values[d.values.length - 1].date; })
		  ]);

		  var g = svg.selectAll(".symbol")
			  .attr("transform", function(d, i) { return "translate(0," + (i * h / 4 + 10) + ")"; });

		  g.each(function(d) {
			var e = d3.select(this);

			e.append("path")
				.attr("class", "line");

			e.append("circle")
				.attr("r", 5)
				.style("fill", function(d) { return color(d.key); })
				.style("stroke", "#000")
				.style("stroke-width", "2px");

			e.append("text")
				.attr("x", 12)
				.attr("dy", ".31em")
				.text(d.key);
		  });

		  function draw(k) {
			g.each(function(d) {
			  var e = d3.select(this);
			  y.domain([0, d.maxPrice]);

			  e.select("path")
				  .attr("d", function(d) { return line(d.values.slice(0, k + 1)); });

			  e.selectAll("circle, text")
				  .data(function(d) { return [d.values[k], d.values[k]]; })
				  .attr("transform", function(d) { return "translate(" + x(d.date) + "," + y(d.price) + ")"; });
			});
		  }

		  var k = 1, n = symbols[0].values.length;
		  d3.timer(function() {
			draw(k);
			if ((k += 2) >= n - 1) {
			  draw(n - 1);
			  setTimeout(horizons, 500);
			  return true;
			}
		  });
		}

		function horizons() {
		  svg.insert("defs", ".symbol")
			.append("clipPath")
			  .attr("id", "clip")
			.append("rect")
			  .attr("width", w)
			  .attr("height", h / 4 - 20);

		  var color = d3.scale.ordinal()
			  .range(["#c6dbef", "#9ecae1", "#6baed6"]);

		  var g = svg.selectAll(".symbol")
			  .attr("clip-path", "url(#clip)");

		  area
			  .y0(h / 4 - 20);

		  g.select("circle").transition()
			  .duration(duration)
			  .attr("transform", function(d) { return "translate(" + (w - 60) + "," + (-h / 4) + ")"; })
			  .remove();

		  g.select("text").transition()
			  .duration(duration)
			  .attr("transform", function(d) { return "translate(" + (w - 60) + "," + (h / 4 - 20) + ")"; })
			  .attr("dy", "0em");

		  g.each(function(d) {
			y.domain([0, d.maxPrice]);

			d3.select(this).selectAll(".area")
				.data(d3.range(3))
			  .enter().insert("path", ".line")
				.attr("class", "area")
				.attr("transform", function(d) { return "translate(0," + (d * (h / 4 - 20)) + ")"; })
				.attr("d", area(d.values))
				.style("fill", function(d, i) { return color(i); })
				.style("fill-opacity", 1e-6);

			y.domain([0, d.maxPrice / 3]);

			d3.select(this).selectAll(".line").transition()
				.duration(duration)
				.attr("d", line(d.values))
				.style("stroke-opacity", 1e-6);

			d3.select(this).selectAll(".area").transition()
				.duration(duration)
				.style("fill-opacity", 1)
				.attr("d", area(d.values))
				.each("end", function() { d3.select(this).style("fill-opacity", null); });
		  });

		  setTimeout(areas, duration + delay);
		}

		function areas() {
		  var g = svg.selectAll(".symbol");

		  axis
			  .y(h / 4 - 21);

		  g.select(".line")
			  .attr("d", function(d) { return axis(d.values); });

		  g.each(function(d) {
			y.domain([0, d.maxPrice]);

			d3.select(this).select(".line").transition()
				.duration(duration)
				.style("stroke-opacity", 1)
				.each("end", function() { d3.select(this).style("stroke-opacity", null); });

			d3.select(this).selectAll(".area")
				.filter(function(d, i) { return i; })
			  .transition()
				.duration(duration)
				.style("fill-opacity", 1e-6)
				.attr("d", area(d.values))
				.remove();

			d3.select(this).selectAll(".area")
				.filter(function(d, i) { return !i; })
			  .transition()
				.duration(duration)
				.style("fill", color(d.key))
				.attr("d", area(d.values));
		  });

		  svg.select("defs").transition()
			  .duration(duration)
			  .remove();

		  g.transition()
			  .duration(duration)
			  .each("end", function() { d3.select(this).attr("clip-path", null); });

		  setTimeout(stackedArea, duration + delay);
		}

		function stackedArea() {
		  var stack = d3.layout.stack()
			  .values(function(d) { return d.values; })
			  .x(function(d) { return d.date; })
			  .y(function(d) { return d.price; })
			  .out(function(d, y0, y) { d.price0 = y0; })
			  .order("reverse");

		  stack(symbols);

		  y
			  .domain([0, d3.max(symbols[0].values.map(function(d) { return d.price + d.price0; }))])
			  .range([h, 0]);

		  line
			  .y(function(d) { return y(d.price0); });

		  area
			  .y0(function(d) { return y(d.price0); })
			  .y1(function(d) { return y(d.price0 + d.price); });

		  var t = svg.selectAll(".symbol").transition()
			  .duration(duration)
			  .attr("transform", "translate(0,0)")
			  .each("end", function() { d3.select(this).attr("transform", null); });

		  t.select("path.area")
			  .attr("d", function(d) { return area(d.values); });

		  t.select("path.line")
			  .style("stroke-opacity", function(d, i) { return i < 3 ? 1e-6 : 1; })
			  .attr("d", function(d) { return line(d.values); });

		  t.select("text")
			  .attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w - 60) + "," + y(d.price / 2 + d.price0) + ")"; });

		  setTimeout(streamgraph, duration + delay);
		}

		function streamgraph() {
		  var stack = d3.layout.stack()
			  .values(function(d) { return d.values; })
			  .x(function(d) { return d.date; })
			  .y(function(d) { return d.price; })
			  .out(function(d, y0, y) { d.price0 = y0; })
			  .order("reverse")
			  .offset("wiggle");

		  stack(symbols);

		  line
			  .y(function(d) { return y(d.price0); });

		  var t = svg.selectAll(".symbol").transition()
			  .duration(duration);

		  t.select("path.area")
			  .attr("d", function(d) { return area(d.values); });

		  t.select("path.line")
			  .style("stroke-opacity", 1e-6)
			  .attr("d", function(d) { return line(d.values); });

		  t.select("text")
			  .attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w - 60) + "," + y(d.price / 2 + d.price0) + ")"; });

		  setTimeout(overlappingArea, duration + delay);
		}

		function overlappingArea() {
		  var g = svg.selectAll(".symbol");

		  line
			  .y(function(d) { return y(d.price0 + d.price); });

		  g.select(".line")
			  .attr("d", function(d) { return line(d.values); });

		  y
			  .domain([0, d3.max(symbols.map(function(d) { return d.maxPrice; }))])
			  .range([h, 0]);

		  area
			  .y0(h)
			  .y1(function(d) { return y(d.price); });

		  line
			  .y(function(d) { return y(d.price); });

		  var t = g.transition()
			  .duration(duration);

		  t.select(".line")
			  .style("stroke-opacity", 1)
			  .attr("d", function(d) { return line(d.values); });

		  t.select(".area")
			  .style("fill-opacity", .5)
			  .attr("d", function(d) { return area(d.values); });

		  t.select("text")
			  .attr("dy", ".31em")
			  .attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w - 60) + "," + y(d.price) + ")"; });

		  svg.append("line")
			  .attr("class", "line")
			  .attr("x1", 0)
			  .attr("x2", w - 60)
			  .attr("y1", h)
			  .attr("y2", h)
			  .style("stroke-opacity", 1e-6)
			.transition()
			  .duration(duration)
			  .style("stroke-opacity", 1);

		  setTimeout(groupedBar, duration + delay);
		}

		function groupedBar() {
		  x = d3.scale.ordinal()
			  .domain(symbols[0].values.map(function(d) { return d.date; }))
			  .rangeBands([0, w - 60], .1);

		  var x1 = d3.scale.ordinal()
			  .domain(symbols.map(function(d) { return d.key; }))
			  .rangeBands([0, x.rangeBand()]);

		  var g = svg.selectAll(".symbol");

		  var t = g.transition()
			  .duration(duration);

		  t.select(".line")
			  .style("stroke-opacity", 1e-6)
			  .remove();

		  t.select(".area")
			  .style("fill-opacity", 1e-6)
			  .remove();

		  g.each(function(p, j) {
			d3.select(this).selectAll("rect")
				.data(function(d) { return d.values; })
			  .enter().append("rect")
				.attr("x", function(d) { return x(d.date) + x1(p.key); })
				.attr("y", function(d) { return y(d.price); })
				.attr("width", x1.rangeBand())
				.attr("height", function(d) { return h - y(d.price); })
				.style("fill", color(p.key))
				.style("fill-opacity", 1e-6)
			  .transition()
				.duration(duration)
				.style("fill-opacity", 1);
		  });

		  setTimeout(stackedBar, duration + delay);
		}

		function stackedBar() {
		  x.rangeRoundBands([0, w - 60], .1);

		  var stack = d3.layout.stack()
			  .values(function(d) { return d.values; })
			  .x(function(d) { return d.date; })
			  .y(function(d) { return d.price; })
			  .out(function(d, y0, y) { d.price0 = y0; })
			  .order("reverse");

		  var g = svg.selectAll(".symbol");

		  stack(symbols);

		  y
			  .domain([0, d3.max(symbols[0].values.map(function(d) { return d.price + d.price0; }))])
			  .range([h, 0]);

		  var t = g.transition()
			  .duration(duration / 2);

		  t.select("text")
			  .delay(symbols[0].values.length * 10)
			  .attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w - 60) + "," + y(d.price / 2 + d.price0) + ")"; });

		  t.selectAll("rect")
			  .delay(function(d, i) { return i * 10; })
			  .attr("y", function(d) { return y(d.price0 + d.price); })
			  .attr("height", function(d) { return h - y(d.price); })
			  .each("end", function() {
				d3.select(this)
					.style("stroke", "#fff")
					.style("stroke-opacity", 1e-6)
				  .transition()
					.duration(duration / 2)
					.attr("x", function(d) { return x(d.date); })
					.attr("width", x.rangeBand())
					.style("stroke-opacity", 1);
			  });

		  setTimeout(transposeBar, duration + symbols[0].values.length * 10 + delay);
		}

		function transposeBar() {
		  x
			  .domain(symbols.map(function(d) { return d.key; }))
			  .rangeRoundBands([0, w], .2);

		  y
			  .domain([0, d3.max(symbols.map(function(d) { return d3.sum(d.values.map(function(d) { return d.price; })); }))]);

		  var stack = d3.layout.stack()
			  .x(function(d, i) { return i; })
			  .y(function(d) { return d.price; })
			  .out(function(d, y0, y) { d.price0 = y0; });

		  stack(d3.zip.apply(null, symbols.map(function(d) { return d.values; }))); // transpose!

		  var g = svg.selectAll(".symbol");

		  var t = g.transition()
			  .duration(duration / 2);

		  t.selectAll("rect")
			  .delay(function(d, i) { return i * 10; })
			  .attr("y", function(d) { return y(d.price0 + d.price) - 1; })
			  .attr("height", function(d) { return h - y(d.price) + 1; })
			  .attr("x", function(d) { return x(d.symbol); })
			  .attr("width", x.rangeBand())
			  .style("stroke-opacity", 1e-6);

		  t.select("text")
			  .attr("x", 0)
			  .attr("transform", function(d) { return "translate(" + (x(d.key) + x.rangeBand() / 2) + "," + h + ")"; })
			  .attr("dy", "1.31em")
			  .each("end", function() { d3.select(this).attr("x", null).attr("text-anchor", "middle"); });

		  svg.select("line").transition()
			  .duration(duration)
			  .attr("x2", w);

		  setTimeout(donut,  duration / 2 + symbols[0].values.length * 10 + delay);
		}

		function donut() {
		  var g = svg.selectAll(".symbol");

		  g.selectAll("rect").remove();

		  var pie = d3.layout.pie()
			  .value(function(d) { return d.sumPrice; });

		  var arc = d3.svg.arc();

		  g.append("path")
			  .style("fill", function(d) { return color(d.key); })
			  .data(function() { return pie(symbols); })
			.transition()
			  .duration(duration)
			  .tween("arc", arcTween);

		  g.select("text").transition()
			  .duration(duration)
			  .attr("dy", ".31em");

		  svg.select("line").transition()
			  .duration(duration)
			  .attr("y1", 2 * h)
			  .attr("y2", 2 * h)
			  .remove();

		  function arcTween(d) {
			var path = d3.select(this),
				text = d3.select(this.parentNode.appendChild(this.previousSibling)),
				x0 = x(d.data.key),
				y0 = h - y(d.data.sumPrice);

			return function(t) {
			  var r = h / 2 / Math.min(1, t + 1e-3),
				  a = Math.cos(t * Math.PI / 2),
				  xx = (-r + (a) * (x0 + x.rangeBand()) + (1 - a) * (w + h) / 2),
				  yy = ((a) * h + (1 - a) * h / 2),
				  f = {
					innerRadius: r - x.rangeBand() / (2 - a),
					outerRadius: r,
					startAngle: a * (Math.PI / 2 - y0 / r) + (1 - a) * d.startAngle,
					endAngle: a * (Math.PI / 2) + (1 - a) * d.endAngle
				  };

			  path.attr("transform", "translate(" + xx + "," + yy + ")");
			  path.attr("d", arc(f));
			  text.attr("transform", "translate(" + arc.centroid(f) + ")translate(" + xx + "," + yy + ")rotate(" + ((f.startAngle + f.endAngle) / 2 + 3 * Math.PI / 2) * 180 / Math.PI + ")");
			};
		  }

		  setTimeout(donutExplode, duration + delay);
		}

		function donutExplode() {
		  var r0a = h / 2 - x.rangeBand() / 2,
			  r1a = h / 2,
			  r0b = 2 * h - x.rangeBand() / 2,
			  r1b = 2 * h,
			  arc = d3.svg.arc();

		  svg.selectAll(".symbol path")
			  .each(transitionExplode);

		  function transitionExplode(d, i) {
			d.innerRadius = r0a;
			d.outerRadius = r1a;
			d3.select(this).transition()
				.duration(duration / 2)
				.tween("arc", tweenArc({
				  innerRadius: r0b,
				  outerRadius: r1b
				}));
		  }

		  function tweenArc(b) {
			return function(a) {
			  var path = d3.select(this),
				  text = d3.select(this.nextSibling),
				  i = d3.interpolate(a, b);
			  for (var key in b) a[key] = b[key]; // update data
			  return function(t) {
				var a = i(t);
				path.attr("d", arc(a));
				text.attr("transform", "translate(" + arc.centroid(a) + ")translate(" + w / 2 + "," + h / 2 +")rotate(" + ((a.startAngle + a.endAngle) / 2 + 3 * Math.PI / 2) * 180 / Math.PI + ")");
			  };
			}
		  }

		  setTimeout(function() {
			svg.selectAll("*").remove();
			svg.selectAll("g").data(symbols).enter().append("g").attr("class", "symbol");
			lines();
		  }, duration);
		}
    }])
    .controller('SensorsCtrl', ["$scope", "$http", "$location", '$route', "apigeeDataService", function ($scope, $http, $location, $route, apigeeDataService) {
		/*
		 *$scope.myData = [{name: "Moroni", age: 50},
		 *    {name: "Tiancum", age: 43},
		 *    {name: "Jacob", age: 27},
		 *    {name: "Nephi", age: 29},
		 *    {name: "Enos", age: 34}
		 *];
		 */

		
		 $scope.apigee = apigeeDataService;
		 //$scope.apigee.refreshSensorData();
		 $scope.myData = $scope.apigee.entities;
		 //console.log($scope); 

		$scope.gridOptions = { 
			data: 'myData',
			//data: $scope.apigee.entities
			//data: $scope.apigee.entities
			showGroupPanel: true,
			jqueryUIDraggable: true,
			columnDefs: [{field: 'VehicleID', width: 80}, 
				{field:'Timestamp', width: 150},
				{field:'GpsE', displayName: 'Longitude',  width: 120},
				{field:'GpsN', displayName: 'Latitude',  width: 120},
				{field:'Humidity', width: 80, cellTemplate: '<div ng-class="{pinkcell: row.getProperty(col.field) > 82}"><div class="ngCellText">{{row.getProperty(col.field)}}</div></div>'},
				{field:'Temperature', width: 80, cellTemplate: '<div ng-class="{orangecell: row.getProperty(col.field) > 78}"><div class="ngCellText">{{row.getProperty(col.field)}}</div></div>'},
				{field:'AmbientTemp', width: 80},
				{field:'Vehicle', width: 120},
				{field:'Owner', width: 120}
			]
		};

		/*
		 *$scope.$watch( function() {
		 *       return apigeeDataService.entities;
		 *}, function( value ) {
		 *    if (value) {
		 *       console.log("Value is:" +  value );
		 *        $scope.gridOptions.data = value;			   
		 *        $scope.$apply($scope.gridOpitons);
		 *    }
		 *});
		 */
		
		$scope.deleteAll = function() {
			$scope.apigee.deleteAll();
		};
		
    }])
    .controller('BikesCtrl', ["$scope", "$http", "$location", '$route', "apigeeDataService", function ($scope, $http, $location, $route, apigeeDataService) {
		 $scope.apigee = apigeeDataService;
		 //$scope.apigee.refreshSensorData();
		 $scope.myData = $scope.apigee.entities;

		$scope.gridOptions = { 
			data: 'myData',
			showGroupPanel: true,
			jqueryUIDraggable: true,
			columnDefs: [{field: 'VehicleID', width: 80}, 
				{field:'Vehicle', width: 180},
				{field:'GpsE', displayName: 'Longitude',  width: 180},
				{field:'GpsN', displayName: 'Latitude',  width: 180},
				{field:'Humidity', width: 120},
				{field:'Temperature', width: 120},
				{field:'Timestamp', width: 150},
			]
		};

    }])
    .controller('BikersCtrl', ["$scope", "$http", "$location", '$route', "apigeeDataService", function ($scope, $http, $location, $route, apigeeDataService) {
		 $scope.apigee = apigeeDataService;
		 //$scope.apigee.refreshSensorData();
		 $scope.myData = $scope.apigee.entities;

		$scope.gridOptions = { 
			data: 'myData',
			showGroupPanel: true,
			jqueryUIDraggable: true,
			columnDefs: [
				{field:'Owner', width: 200},
				{field:'Vehicle', width: 200},
				{field:'GpsE', displayName: 'Longitude',  width: 200},
				{field:'GpsN', displayName: 'Latitude',  width: 200},
				{field:'Timestamp', width: 150}
			]
		};

    }])
    .controller('HomeCtrl', ["$scope", "$http", "$location", '$route', "apigeeDataService", function ($scope, $http, $location, $route, apigeeDataService) {
		 $scope.apigee = apigeeDataService;
		 $scope.apigee.refreshSensorData();

		 $scope.selectedChart = "mostUsedBikes";

		 $scope.setSelectedChart = function(chart) {
			 $scope.selectedChart = chart;
		 };
	}]);
