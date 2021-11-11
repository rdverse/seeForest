/////////////////////////////////////////////////////////////////////
/////////////////////////global variables/////////////////////////////
////////////////////////////////////////////////////////////////////
var margin = {top:30, right:60, left:60, bottom:30 },
  			wdim = 960,
			hdim =  1200,
			width = wdim - margin.right - margin.left,
			height = hdim - margin.top - margin.bottom;
var canvas;
var squareDim = 20;
var ss;
var treeMap;
var links = 0;
/////////////////////////////////////////////////////////////////
/////////////////////Function to draw lines for each link///////
///////////////////////////////////////////////////////////////
function diagonal(s, d,i) {
//	s.y = s.y+squareDim;
	//d.x=d.x+squareDim;
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
//console.log(ruleData[i]);

//console.log("parent: " + d["data"]["name"] + "   child :" +  s["data"]["name"] )

for(rule in ruleData[i]){
}
var xmul;
	try{
		// console.log("try");
		xmul = squareDim*s.data["val"];// + squareDim*(s.data["feat"]);
	}
	catch{
		// console.log("catch");
		xmul = squareDim;
	}

if(Number.isNaN(xmul)){
	xmul = squareDim;//+ squareDim*(s.data["feat"]-1);
}

	path = `M ${s.y}, ${s.x+xmul}
			C ${(s.y + d.y) / 2} ${s.x+xmul},
            ${(s.y + d.y) / 2} ${d.x+xmul},
			${d.y+squareDim} , ${d.x+xmul}`

    return path
}
  

  function diagonals(p, c, dataSlice) {
	// var temp = s;
	// s = d;
	// d=temp;

	var parentName = p.data.name;	
	var childName = c.data.name;
	var childNameCopy = childName;

	if(childName=="leaf"){
	childName = parentName;	
	}
	if(childName=="empty"){
		childName = parentName;	
		}
	var xmul;

//	console.log(jsonData[childName][ruleIndex]);
	positionP = positions[parentName];
	positionC = positions[childNameCopy];
	
	// console.log("postiions");
	// console.log(positionP);
	// console.log(positionC);

	xmulP = squareDim* dataSlice[childName] + squareDim*positionP;
	xmulC = squareDim* dataSlice[childName] + squareDim*positionC;
	//console.log(dataSlice[childName]);
	// console.log("xmuls");
	// console.log(xmulP);
	// console.log(xmulC);
	// console.log(xmul);
	
	if(Number.isNaN(xmul)){
		xmul = squareDim+ squareDim*1;
	}

				path = `M ${p.x + xmulP}, ${p.y+squareDim}
				C ${((p.x + c.x +20) / 2)} ${p.y+squareDim/2},
				${((p.x + c.x +20) / 2)} ${c.y+squareDim/2},
				${c.x+xmulC} , ${c.y}`
	
				// path = `M ${s.y}, ${s.x+xmulC}
				// C ${(s.y + d.y + squareDim) / 2} ${s.x+xmulC},
				// ${(s.y + d.y + squareDim) / 2} ${d.x+ xmulP},
				// ${d.y+squareDim} , ${d.x+xmulP}`
	

					// return "M" + d.source.y + "," + d.source.x
					// 	+ "C" + (d.source.y + d.target.y) / 2 + "," + d.source.x
					// 	+ " " + (d.source.y + d.target.y) / 2 + "," + d.target.x
					// 	+ " " + d.target.y + "," + d.target.x;

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

/////////////////////////////////////////////////////////////////
/////////////////////Set the tree map //////////////////////
///////////////////////////////////////////////////////////////
function set_tree_map(){
	treeMap = d3.tree().size([height, width]).nodeSize([squareDim*7,squareDim*7]);

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
nodes.forEach(d => {d.x = d.x +450;d.y = d.depth*150;});

// nodes.forEach(d => {d.x = d.x + squareDim*(positions[d.data.name]); console.log(positions[d.data.name]);});

nodes.forEach(d => {d.x = d.x  -squareDim*(positions[d.data.name]);});


// nodes.forEach(d => {d.x = d.x + positions[d.data.name]>2 ? -squareDim*(positions[d.data.name]);});

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
	.attr('fill', "black")
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
			.attr('height', squareDim)
			.on("pointerover", function(p,d){
				console.log(d);
				});

	if(emptyBox==0){nodeEnter = add_text(nodeEnter);
	}
	

	var nodeUpdate = nodeEnter.merge(node);

	if(emptyBox==0){
		nodeUpdate.transition()
		.duration(750)
		.attr("transform", function(d) { 
			
			return "translate(" + (d.x+(squareDim*(positions[d.data.name]))) + "," + d.y+ ")";
	
		});
	
		nodeUpdate.select('rect.node')
		.attr('width', squareDim)
		.attr('height', squareDim)
		.transition()
		.delay((d,i) => i*100)
		.attr('opacity', 0.2)
		.attr("fill", "blue")
		.style("stroke", "black");
	
	}
	else {
		nodeUpdate.transition()
		.duration(500)
		.attr("transform", function(d) { 
			return "translate(" + (d.x + (squareDim*emptyBox)) + "," + d.y+ ")";
		});
	
		nodeUpdate.select('rect.node')
		.attr('width', squareDim)
		.attr('height', squareDim)
		.attr('opacity', 0.2)
		.attr("fill", "none")
		.transition()
		.delay((d,i) => i*100)
		.style("stroke", function(d){return "black"});
	}
}

function draw_links(root,treeIndex, links){
	// console.log("links")
	// console.log(links["0"]);

	// console.log("data slice");
	// console.log((jsonData)=> {return jsonData});

	colors = {0:"red", 1: "blue", 2:"green"}

	for(var i = 0; i<150;i++){	

		var dataSlice = {};
	
		for(key in jsonData){
			dataSlice[key] = jsonData[key][i];
		};

		// console.log(i);
		var link = canvas.selectAll('path.link' + String(treeIndex) + "_" + String(i))
					.data(links, function(d){return d.id;});
		
		var linkEnter = link.enter()
					.insert('path', "g")
					.attr("class", "link")
					.attr("stroke", colors[dataTarget[i]])
					.attr("fill", "none")
					.attr("opacity", 0.3)
					.attr("stroke-width", "0.5px");

		var linkUpdate = linkEnter.merge(link);

		// linkUpdate.attr('d', function(d,rule){ return (console.log(ruleData[rule][i], rule))});
		// linkUpdate.attr('d', function(d,rule){ return (ruleData[rule][i]==1)?console.log("some"):console.log("none");});
		
		linkUpdate.transition()
		 .delay((d,i) => i*100)
		 .attr('d', function(d,rule){ return (ruleData[String(rule)][i]==1)?diagonals(d.parent,d,dataSlice):null;});
	};
	// var count = 0;
	// // console.log(ruleData); 	
	// 	//console.log(ruleData["0"][rule]);
	// 	// console.log(rule);

	// 	if(ruleData["3"][rule]==1){
	// 	}
	// 	count+=1;
	
// for each data point
	// rule 0 
	// rule 1
	// rule 2
	// rule 3
	// .. 
	// ..
}

function draw_tree(jsonData,treeIndex){
	set_tree_map();

	//jsonSK2= jsonSK2empty;

	// jsonSK2= jsonSK22;
	// ruleData = ruleData2;
	// jsonSK2 = jsonSK2mini;
	// ruleData=ruleDatamini;
	// *********get initializations*******************
	var [root, nodes, links] = Initialize_tree(jsonSK2);

	//********nodes section ************
	draw_nodes(root,treeIndex, nodes);

	//******** All about the links ******
	draw_links(root,treeIndex, links);
	draw_nodes(root,treeIndex, nodes, emptyBox=1);
	draw_nodes(root,treeIndex, nodes, emptyBox=2);
	draw_nodes(root,treeIndex, nodes, emptyBox=3);
	draw_nodes(root,treeIndex, nodes, emptyBox=4);
	draw_nodes(root,treeIndex, nodes, emptyBox=5);



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