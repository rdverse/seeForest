
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
    "name" : ["Max","Max","Max","Max"],
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
.attr("height", 500).append("g")
.attr("transform", "translate(25,25)");

	var treeMap = d3.tree()
		.size([400,400]);

	var nodes = d3.hierarchy(jsonData, function(d) {
		return d.children;
		});

	nodes = treeMap(nodes)
	var links = nodes.descendants().slice(1);

	//console.log(links);
	console.log(nodes);

	var node = canvas.selectAll(".node")
	.data(nodes)
	.enter()
	.append("g")
	.attr("class", "node")
	.attr("transform", function (d){
		console.log(d.x);
		xc=d.x+100;
		return "translate(" + xc + "," + d.y + ")";
	});

	node.append("rect")
		.attr("width", 20)
		.attr("height", 20)
		.attr("fill", "black");