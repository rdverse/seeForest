
/////////////////////////////////////////////////////////////////////
/////////////////////////global variables/////////////////////////////
////////////////////////////////////////////////////////////////////

function plot_node(da,k, svg,rw,rh){
	// var width = 1200,
    // height = 1200,
    // div = d3.select('#forest'),
    // svg = div.append('svg')
    //     .attr('width', width)
    //     .attr('height', height),
    // rw = 95,
    // rh = 95;
	console.log(da);
	var grp = svg.selectAll('g')
	.data(da)
		.enter()
		.append('g')
		.attr('transform', function(d, i) {
			return 'translate(0, ' + (rh + 5) * i*3 + ')';
		});
		
		grp.selectAll('rect' + String(k))
			.data(function(d) { return d; })
			.enter()
			.append('rect')
			.attr('x', function(d, i) { return (rw + 5) * i; })
			.attr('width', rw-20*k)
			.attr('height', rh-20*k)    
			.style("opacity", 0.1+k*0.3);
	}


const jsonData = {
    "name" : "Max",
    "children" : [
        {
        "name": "Sylvia",
        "children":[
                {"name":"Craig"},
                {"name":"Robin"},
            ]
        },
        {
        "name": "David",
        "children":[
                {"name":"Jeff"},
                {"name":"Buffy"}            ]
        }
    ]
};    
    
var canvas  = d3.select("#forest")
.append("svg")
.attr("width", 500)
.attr("height", 500)
.append("g")
.attr("transform", "translate(25,25)");

var i = 0,
    duration = 750,
    root;

	var treeMap = d3.tree().size([400,400]);
	root = d3.hierarchy(jsonData, function(d){return d.children;});
	
	console.log(root);
	console.log(treeMap);
	root.x0 = 500/2;
	root.y0 = 0;
	console.log(root);

	//get x and y coordinates for nodes
	var treeData = treeMap(root);

	// Converts tree structured data into array format for nodes and links
	var nodes = treeData.descendants(),
	// slice to remove root node as there are no connections
	links = treeData.descendants().slice(1);

	console.log("nodes");
	console.log(nodes);
	console.log(links);

	//normalize depth
	nodes.forEach(d => {d.y = d.depth = d.depth*50});

	// ********nodes section ************

	var node = canvas.selectAll(".node")
				.data(nodes, function(d){return d.id ||(d.id = ++i);});
				console.log("node");

	console.log(node);
	var nodeEnter = node.enter()
					.append('g')
					.attr('class', 'node')
					.attr('transform', function (d){return 'translate(' + root.y0 + ',' + root.x0 + ')';});
	
	nodeEnter.append("rect")
			.attr('class', 'node')
			.attr('width', 20)
			.attr('height', 20)
			.attr('opacity', 0.8)
			.attr("fill", "blue").on("pointerover", function(p,d){
						console.log(d);
				});

	nodeEnter.append('text')
	.attr('dy', '.35em')
	.attr('x', function(d){return d.children || d._children ? 33 : 53;})
	//.attr("y", function(d){return d.y;})
	.attr("font-size", "12px")
	.attr('fill', "black")
	.attr('text-anchor', function(d){
		console.log("d");
		console.log(d);
		console.log(d.children || d._children ? 'end' : 'end');
		return d.children || d._children ? 'start' : 'end'
	})
	.text(function(d) {return d.data.name;});


	var nodeUpdate = nodeEnter.merge(node);
	
	nodeUpdate.transition()
    .duration(duration)
    .attr("transform", function(d) { 
        return "translate(" + d.y + "," + d.x + ")";
     });

	 nodeUpdate.select('rect.node')
	 .attr('width', 20)
	 .attr('height', 20)
	 .attr('opacity', 0.8)
	 .attr("fill", "blue").on("pointerover", function(p,d){
				 console.log(d);
		 });;

	// var nodes = d3.hierarchy(jsonData, function(d) {
	// 	return d.children;
	// 	});

	// nodes = treeMap(nodes);
	
	// //var links = nodes.descendants().slice(1);
	// var links = treeMap.links(nodes);
	// console.log(links);

	// //console.log(links);
	// console.log(nodes);

	// var node = canvas.selectAll(".node")
	// .data(nodes)
	// .enter()
	// .append("g")
	// .attr("class", "node")
	// .attr("transform", function (d){
	// 	console.log(d.x);
	// 	xc=d.x+100;
	// 	return "translate(" + xc + "," + d.y + ")";
	// });

	// node.append("rect")
	// 	.attr("width", 20)
	// 	.attr("height", 20)
	// 	.attr("opacity", 0.8)
	// 	.attr("fill", "blue").on("pointerover", function(p,d){
	// 		console.log(d);
	// 	});
	
	// 	var diagonal = d3.linkHorizontal()
	// 						.x(function(d){return d.x})
	// 						.y(function(d){return d.y});

	// var lines = canvas.selectAll(".lines")
	// .data(links)
	// .enter()
	// .append("g")
	// .attr("class" , "lines");

	// lines.append("path")
	// .attr("fill", "none")
	// .attr("stroke", "black")
	// .attr("d", diagonal);

	// 	var node1 = canvas.selectAll(".node1")
	// .data(nodes)
	// .enter()
	// .append("g")
	// .attr("class", "node")
	// .attr("transform", function (d){
	// 	console.log(d.x);
	// 	xc=d.x+100;
	// 	return "translate(" + xc + "," + d.y + ")";
	// });

	// node1.append("rect")
	// 	.attr("width", 20)
	// 	.attr("height", 20)
	// 	.attr("opacity", 0.3)
	// 	.attr("fill", "blue").on("pointerover", function(p,d){
	// 		console.log(d);
	// 	});