/////////////////////////////////////////////////////////////////////
/////////////////////////global variables/////////////////////////////
////////////////////////////////////////////////////////////////////
var margin = {top:30, right:60, left:60, bottom:30 },
  			wdim = 1960,
			hdim =  2200,
			width = wdim - margin.right - margin.left,
			height = hdim - margin.top - margin.bottom;
var canvas;
var squareDim = 20;
var ss;
var treeMap;
var linksG = 0;
var nodesG;

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

/////////////////////////////////////////////////////////////////
/////////////////////Set the tree map //////////////////////
///////////////////////////////////////////////////////////////
function set_tree_map(){
	treeMap = d3.tree().size([height, width]).nodeSize([squareDim*6,squareDim*2]);

}

/////////////////////////////////////////////////////////////////
/////////////////////Water nodes and links//////////////////////
///////////////////////////////////////////////////////////////
function Initialize_tree(jsonData){
// Initialize treemap layout with a size

var root = d3.hierarchy(jsonData, function(d){return d.children;});
// Set the start point of root node
root.x0 = height/2;
root.y0 = 0;
// console.log("root");
// console.log(root);

//get x and y coordinates for nodes
var treeData = treeMap(root);

// Converts tree structured data into array format for nodes and links
var nodes = treeData.descendants().reverse(),
// slice to remove root node as there are no connections
links = treeData.descendants().slice(1);

//normalize depth
nodes.forEach(d => {d.x = d.x+width/2; d.y = d.depth*30;});

// nodes.forEach(d => { 
// if(d.x>root.x0){
// 	d.x = root.x0;
// }
// else{
// 	d.x = root.x0 - positions[d.data.name]*;
// }	
// });

// nodes.forEach(d => {d.x = d.x + squareDim*(positions[d.data.name]); console.log(positions[d.data.name]);});

// nodes.forEach(d => {d.x = d.x  +squareDim*(positions[d.data.name]);});


// nodes.forEach(d => {d.x = d.x + positions[d.data.name]>2 ? -squareDim*(positions[d.data.name]);});
linksG = links;
return [root, nodes, links];
}

/////////////////////////////////////////////////////////////////
/////////////////////tooltip for node//////////////////////
///////////////////////////////////////////////////////////////
function add_text(nodeEnter){
	nodeEnter.append('text')
	.attr('dy', '.35em')
	.attr('x', function(d){return d.children || d._children ? 33 : 53;})
	//.attr("y", function(d){return d.y;})
	.attr("font-size", "12px")
	.attr('fill', function(d){return d['data']['name']!="empty"?"green":"white";})
	.attr('text-anchor', function(d){
		//console.log("d");
		//console.log(d);
		//console.log(d.children || d._children ? 'end' : 'end');
		return d.children || d._children ? 'start' : 'end'
	})
	.text(function(d) {return d.data.name;});
return nodeEnter;
}

function draw_nodes(root,treeIndex, nodes, emptyBox=0){

	var i = 0;
	var node = canvas.selectAll(".node" + String(treeIndex))
				.data(nodes, function(d){return d.id ||(d.id = ++i);});
			//	console.log("node");

	// console.log(node);
	var nodeEnter = node.enter()
					.append('g')
					.attr('class', 'node')
					.attr('transform', function (d){return 'translate(' + root.x0 + ',' + root.y0 + ')';});

	nodeEnter.append("rect")
			.attr('class', 'node')
			.attr('width', squareDim)
			.attr('height', squareDim);
			// .on("pointerover", function(p,d){
			// 	console.log(d);
			// 	// d.attr('width',20)
			// 	d3.select(this)
			// 	.attr('width',40)
			// 	.attr('height',40);
			// }).on("pointerout", function(p,d){
			// 	console.log(d);
			// 	// d.attr('width',20)
			// 	d3.select(this)
			// 	.attr('width',10)
			// 	.attr('height',10);
			// });

	// if(emptyBox==0){
	// 	nodeEnter = add_text(nodeEnter);
	// }
	

	var nodeUpdate = nodeEnter.merge(node);

	if(emptyBox==-1){


	}
	
	
	else if(emptyBox==0){
		nodeUpdate.transition()
		.duration(50)
		.attr("transform", function(d) { 
			return "translate(" + (d.x+( (squareDim/(d.depth+1) )*(positions[d.data.name]))) + "," + d.y+ ")";
		});
	
		nodeUpdate.select('rect.node')
		.attr('width', function(d){return squareDim/(d.depth+1)})
		.attr('height', function(d){return squareDim/(d.depth+1)})
		.transition()
		.delay((d,i) => i*1)
		.attr('opacity', 0.05)
		.attr("fill", function(d){return d['data']['name']=="empty"?"white":"black";})
		.style("stroke",function(d){return d['data']['name']=="empty"?"white":"black";})
		.style("stroke-width", function(d){return d['data']['name']=="empty"?"0":"1";});
	}

	else {
		nodeUpdate.transition()
		.duration(500)
		.attr("transform", function(d) { 
			return "translate(" + (d.x + ( squareDim/(d.depth+1) *emptyBox)) + "," + d.y+ ")";
		});
	
		nodeUpdate.select('rect.node')
		.attr('width', function(d){return squareDim/(d.depth+1)})
		.attr('height', function(d){return squareDim/(d.depth+1)})
		.attr('opacity', 0.05)
		.attr("fill", "none")
		.transition()
		.delay((d,i) => i*1)
		.style("stroke", function(d){return "black"})
		.style("stroke-width", function(d){return d['data']['name']=="empty"?"0":"1";});
	}
}


function draw_tree(jsonData,treeIndex){
	set_tree_map();
	//jsonSK2= jsonSK2empty;
	// jsonSK2= jsonSK22;
	// ruleData = ruleData2;
	// jsonSK2 = jsonSK2mini;
	// ruleData=ruleDatamini;
for(var i =0; i<20; i++){
	jsonSK2 = rfTrees[i];
	//ruleData=ruleDatamini;
	console.log(rfRules[i]);
	ruleData=rfRules[i];
	// *********get initializations*******************
	var [root, nodes, links] = Initialize_tree(jsonSK2);
	nodesG = nodes;
	//********nodes section ************
	draw_nodes(root,treeIndex, nodes);

	//******** All about the links ******
	draw_nodes(root,treeIndex, nodes, emptyBox=1);
	draw_nodes(root,treeIndex, nodes, emptyBox=2);
	draw_nodes(root,treeIndex, nodes, emptyBox=3);
	draw_nodes(root,treeIndex, nodes, emptyBox=4);
	draw_nodes(root,treeIndex, nodes, emptyBox=5);
}
	


	// jsonSK2 = jsonSK2MiniEmpty;
	// //ruleData=ruleDatamini;
	// ruleData=ruleDataMiniEmpty;
	// // *********get initializations*******************
	// var [root, nodes, links] = Initialize_tree(jsonSK2);

	// //********nodes section ************
	// draw_nodes(root,treeIndex, nodes);

	// //******** All about the links ******
	// draw_links(root,treeIndex, links);
	// draw_nodes(root,treeIndex, nodes, emptyBox=1);
	// draw_nodes(root,treeIndex, nodes, emptyBox=2);
	// draw_nodes(root,treeIndex, nodes, emptyBox=3);
	// draw_nodes(root,treeIndex, nodes, emptyBox=4);
	// draw_nodes(root,treeIndex, nodes, emptyBox=5);



	// // // *********get initializations*******************
	// var [root, nodes, links] = Initialize_tree(jsonData);

	// // ********nodes section ************
	// draw_nodes(root,treeIndex, nodes);

	// // ******** All about the links ******
	// draw_links(root,treeIndex, links);
	// console.log("draw_tree");

	// draw_nodes(root,treeIndex, nodes, emptyBox=1);
	// draw_nodes(root,treeIndex, nodes, emptyBox=2);
	// draw_nodes(root,treeIndex, nodes, emptyBox=3);
	// draw_nodes(root,treeIndex, nodes, emptyBox=4);
	// draw_nodes(root,treeIndex, nodes, emptyBox=5);

	// console.log(nodes);
}
	
////////////////////////////////////////////////////////////////////
/////////////////////// MAIN //////////////////////////////////////
//////////////////////////////////////////////////////////////////
function main(){

	// Radial tree seems to be a cool idea
	canvas = build_canvas();
	draw_tree(jsonSK2);
	
	//draw_tree(jsonSK);	
	// var zoom = d3.zoom()
    //   .scaleExtent([1, 8])
    //   	.on('zoom', function(event) {
    //       canvas.selectAll('')
    //        .attr('transform', event.transform);
	// 	});

	// canvas.call(zoom);

	// function zoomed({transform}) {
	// 	canvas.attr("transform", transform);
	//   }
	  
	// canvas.call(d3.zoom()
	// .extent([[0, 0], [width, height]])
	// .scaleExtent([0, 2])
	// .on("zoom", zoomed));

	// var fisheye = d3.fisheye.circular()
    // .radius(200)
    // .distortion(2);
	// var fisheye = d3.fisheye();
	// // canvas.on("mousemove", function() {
	// // 	fisheye.focus(d3.mouse(this));
	// //   });
	// canvas.on("pointerover", function() {
	// 	fisheye.center(d3.mouse(this));
	// 	path.attr("d", function(d) { return line(d.map(fisheye)); });
	//   });
	  

	//jsonList.forEach(function(d, i){draw_tree(d, i);});
}

main();