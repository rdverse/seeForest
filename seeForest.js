/////////////////////////////////////////////////////////////////////
/////////////////////////global variables/////////////////////////////
////////////////////////////////////////////////////////////////////
var margin = {top:30, right:60, left:60, bottom:30 },
  			wdim = 960,
			hdim =  600,
			width = wdim - margin.right - margin.left,
			height = hdim - margin.top - margin.bottom;
var canvas;
var ss;
/////////////////////////////////////////////////////////////////
/////////////////////Function to draw lines for each link///////
///////////////////////////////////////////////////////////////
function diagonal(s, d) {
//	s.y = s.y+20;
	//d.x=d.x+20;
	//d.x = d.x-10;
    //d.x = d.x+10
	//s.x = s.x+10
	// path = `M ${s.y} ${s.x+10}
    //         C ${(s.y + d.y) / 2} ${s.x+10},
    //           ${(s.y + d.y) / 2} ${d.x+10},
    //           ${d.y} ${d.x+10}`
	// console.log("s");
	// console.log(ss);

// 	for(var key in s.data){
// 	console.log(s.data[key]);
// 	console.log(s.data["val"]);
// }
var xmul;
if("data" in s){
	console.log(d);
}
	try{
		console.log("try");
		xmul = 20*s.data["val"];
	}
	catch{
		console.log("catch");
		xmul = 20;
	}

if(Number.isNaN(xmul)){
	xmul = 20;
}
console.log(xmul);
	path = `M ${s.y}, ${s.x+xmul}
			C ${(s.y + d.y) / 2} ${s.x+xmul},
            ${(s.y + d.y) / 2} ${d.x+xmul},
			${d.y+20} , ${d.x+xmul}`

    return path
  }

/////////////////////////////////////////////////////////////////
/////////////////////Function to build svg//////////////////////
///////////////////////////////////////////////////////////////
function build_canvas(){
	var svg  = d3.select("#forest")
	.append("svg")
	.attr("width", wdim)
	.attr("height", hdim)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	return svg;
}  


function Initialize_tree(jsonData){
// Initialize treemap layout with a size

var treeMap = d3.tree().size([height, width]);
var root = d3.hierarchy(jsonData, function(d){return d.children;});
// Set the start point of root node
root.x0 = height/2;
root.y0 = 0;

//get x and y coordinates for nodes
var treeData = treeMap(root);

// Converts tree structured data into array format for nodes and links
var nodes = treeData.descendants(),
// slice to remove root node as there are no connections
links = treeData.descendants().slice(1);

//normalize depth
nodes.forEach(d => {d.y = d.depth = d.depth*150});

return [root, nodes, links];
}

function draw_nodes(root, nodes){
	var i = 0;
	var node = canvas.selectAll(".node")
				.data(nodes, function(d){return d.id ||(d.id = ++i);});
			//	console.log("node");

	// console.log(node);
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
						//console.log(d);
				});

	nodeEnter.append('text')
	.attr('dy', '.35em')
	.attr('x', function(d){return d.children || d._children ? 33 : 53;})
	//.attr("y", function(d){return d.y;})
	.attr("font-size", "12px")
	.attr('fill', "black")
	.attr('text-anchor', function(d){
		//console.log("d");
		//console.log(d);
		//console.log(d.children || d._children ? 'end' : 'end');
		return d.children || d._children ? 'start' : 'end'
	})
	.text(function(d) {return d.data.name;});


	var nodeUpdate = nodeEnter.merge(node);

	nodeUpdate.transition()
	.duration(750)
	.attr("transform", function(d) { 
		return "translate(" + d.y + "," + d.x + ")";
	});

	nodeUpdate.select('rect.node')
	.attr('width', 20)
	.attr('height', 20)
	.attr('opacity', 0.8)
	.attr("fill", "none")
	.style("stroke", "black");

}

function draw_links(root, links){
	var link = canvas.selectAll('path.link')
					.data(links, function(d){return d.id;});

	var linkEnter = link.enter()
						.insert('path', "g")
						.attr("class", "link")
						.attr("stroke", "red")
						.attr("fill", "none")
						.attr("stroke-width", "0.5px");

						// .attr('d', function(d){
						// 	var o = {x: root.x0, y: root.y0};
						// 	return diagonal(o,o);
						// })

					//  .attr("d", function(d){
					// 	 var o = {x : d.source.x0, y: d.source.y0};
					// 	 return diagonal(o,o);
					//  });

	//console.log("link generated");
	//console.log(link);
	var linkUpdate = linkEnter.merge(link)
					.attr('d', function(d){ return diagonal(d, d.parent)});

}

function draw_tree(jsonData){
	// *********get initializations*******************
	var [root, nodes, links] = Initialize_tree(jsonData);

	// ********nodes section ************
	draw_nodes(root, nodes);

	// ******** All about the links ******
	draw_links(root, links);
}
	
////////////////////////////////////////////////////////////////////
/////////////////////// MAIN //////////////////////////////////////
//////////////////////////////////////////////////////////////////

function main(){
	canvas = build_canvas();
	draw_tree(jsonData);
}

main();