/////////////////////////////////////////////////////////////////////
/////////////////////////global variables/////////////////////////////
////////////////////////////////////////////////////////////////////
var margin = {top:30, right:60, left:60, bottom:30 },
  			wdim = 1960,
			hdim =  500,
			width = wdim - margin.right - margin.left,
			height = hdim - margin.top - margin.bottom;
var canvas;
var squareDim = 80;
var ss;
var treeMap;
var linksG = 0;
var nodesG;
var sample_id = 0;
var op = 1/10;
var globalSelect = -1;
var clicked = false;
var positions = ppositions;
var positionsRev = ppositionsRev;
/////////////////////////////////////////////////////////////////
/////////////////////Function to draw lines for each link///////
///////////////////////////////////////////////////////////////

  function diagonals(c,p, dataSlice) {

	var parentName = p.data.name;	
	var childName = c.data.name;
	var childNameCopy = childName;
	
	if(childName=="leaf"){
	childName = parentName;	
	}
	if(childName=="empty"){
		return null;
		}
	if(parentName=="empty"){
		return null;
		}
		
	var xmul;

	positionP = positions[parentName];
	positionC = positions[childNameCopy];	

	var xmulP = squareDim* dataSlice[childName] + squareDim*positionP;
	var xmulC = squareDim* dataSlice[childName] + squareDim*positionC;

	
	if(Number.isNaN(xmul)){
		xmul = squareDim+ squareDim*1;
	}
				path = `M ${xmulC}, ${150}
				C ${xmulC} ${(150+150)/2-c.depth*squareDim},
				${xmulP} ${(150+150)/2-c.depth*squareDim},
				${xmulP} , ${150}`

				path = `M ${xmulC}, ${c.y}
				C ${xmulC} ${(c.y+p.y + squareDim)/2},
				${xmulP} ${(c.y+p.y + squareDim)/2},
				${xmulP} , ${p.y+squareDim}`
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
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	svg.append("text")
    .attr("x", (wdim / 4))
    .attr("y", (20 ))
    .attr("text-anchor", "middle")
    .style("font-size", "24px")
    .style("text-decoration", "underline")
    .style('fill', '#black')
    .text("Main Graph");
	
	return svg;
}  

////////////////////////////////////////////////////////
////////////////////////////FLATS////////////////////////
//////////////////////////////////////////////////////////
function diagonals_flat(d, deep, dataSlice, treeIndex) {
	// console.log(d);
	console.log(d);
	var dch = [];
	// var keyIndices = Object.keys(positions);
	// // console.log(keyIndices);
	var keyVals = Object.keys(positions).map(function(key){return positions[key]});
	// console.log(keyVals);
	dch[0] = keyVals[d[0]];//positions[positionsRev[keyIndices[d[0]]]];
	dch[1] = keyVals[d[1]];//positions[positionsRev[keyIndices[d[1]]]];
	// console.log(d,dch);

	var childName = positionsRev[dch[1]];
	var parentName = positionsRev[dch[0]];

	positionC = dch[1];	
	positionP = dch[0];

	var bendornot="bend";

	// what to do if parent is leaf
	if(parentName!="leaf"){
		// to have same position as previous feature value
		//var xmulP = squareDim*1* dataSlice[parentName] + squareDim*1.1*positionP;
		// to have the relative treeIndex value, n_trees=10
		var xmulP = squareDim*1* dataSlice[parentName] + squareDim*1.1*positionP;
	}
	else{
		console.log("Something terribly wor==rong!!!!!!");
		console.log("parent is leaf");
		parentName = childName;
		var xmulP = squareDim*1* dataSlice[parentName] + squareDim*1.1*positionP;
	}

	// what to do if child is leaf
	if(childName!="leaf"){

		//console.log(childName);
		var xmulC = squareDim*1* dataSlice[childName] + squareDim*1.1*positionC;
	}
	else{
		bendornot = 'dontbend';
		// console.log("child is leaf");
		childName=parentName;
		var xmulC = squareDim*1* treeIndex/10 + squareDim*1.1*positionC;
	}

	// bend the line right or left a bit
	var bend = 0;
	if(bendornot=='bend'){
		console.log();
		if(d[0]>d[1]){
			bend = -(xmulC+xmulP)/8;
		}
		else{
			bend = +(xmulC+xmulP)/8;
		}
	
	}
	
				// path = `M ${xmulC}, ${350}
				// C ${xmulC} ${350-deep*squareDim},
				// ${xmulP} ${350- deep*squareDim},
				// ${xmulP} , ${350}`
if(xmulC==xmulP){bend=0;}
bend=0;
				path = `M ${xmulC}, ${350}
				L ${(((xmulC+xmulP)/2) + bend)}, ${350-(deep+1)* (squareDim/2)},
				L ${xmulP}, ${350}`

				
	console.log(path);
	return path
}

function add_flat_text(){
	var textData = Object.keys(positions).slice(0,5);
	var textDraw = canvas.selectAll("texts")
					.data(textData, function(d,i){return d;})
					.enter()
					.append("g")
					.attr('class', 'texts');

	var text = canvas.selectAll('docTextChoice')
	.data(textData)
   .enter().append('text')
	.attr("x", function(d,i){return (i*1.2)*squareDim})
	.attr("y", function(d) { return 0; })
	.attr("fill", "#000")
	.attr("text-anchor","start")
	.style("font-size", 2)
	.attr('transform', (d,i)=>{
		return 'translate( '+0 +' , '+380+'),'+ 'rotate(0)';})
	.text(function(d){return d});
}


function get_pointer_data(d){
if(Object.keys(d).includes("explicitOriginalTarget"))
{
	return d.explicitOriginalTarget.__data__;
}
else{
	// console.log(d.srcElement.__data__);
	return(d.srcElement.__data__);
}
}


function draw_flat_nodes(root=[], treeIndex=[], nodes=[], emptyBox=0){	
	nodes = [1,2,3,4,5];
	var i = 0;
	count = {};
	var P = rfPath.flat(3);
	var maxLen = P.length;
	P.forEach(e => count[e] ? count[e]++ : count[e] = 1 );
	var keyVals = Object.keys(positions).map(function(key){return positions[key]});

	// nodes = keyVals;
	var nodeDraw = canvas.selectAll("nodes" + String(treeIndex))
					.data(nodes, function(d,i){return d;})
					.enter()
					.append("g")
					.attr('class', 'node');
	console.log(keyVals);
	nodeDraw.selectAll("square")
			.data(nodes, function(d,i){return d;})
			.enter().append("rect")
			.attr("class","square")
			.attr('width', function(d) { return squareDim; })
			.attr('height', function(d) { return squareDim/2; })	
			.attr('x', function(d){return (d*1.1)*squareDim})
			.attr('y', function(d) { return 350; })
			.attr('opacity', function(d){return count[keyVals[d]-1]/(maxLen*10)})
			.attr("fill", "black")
			.style("stroke", function(d){return "black"})
			.style("stroke-width", function(d){return "0";})
			.on("click",function(d){
			if(globalSelect==-1){
				// console.log(d);
				globalSelect = get_pointer_data(d);
			}
			else{
				var temp = 'a';
				// console.log(d);
				var curSelect = get_pointer_data(d);
				// swap Revpositions
					temp = positionsRev[curSelect];
					positionsRev[curSelect] = positionsRev[globalSelect];
					positionsRev[globalSelect]=temp;

				// swap positions
				positions[positionsRev[curSelect]] = curSelect;
				positions[positionsRev[globalSelect]] = globalSelect;
				globalSelect = -1;
				d3.selectAll("svg").remove();
				main();
			}
			});

	nodeDraw.append("text")
	.attr("x", function(d,i){return ((i+1)*1.15)*squareDim})
	.attr("y", function(d) { return 400; })
	.attr("dy", ".35em")
	.attr("fill", "#000")
	.attr("text-anchor","start")
	.style("font-size", 8)
	.text(function(d){return positionsRev[d]});

	// d3.selectAll(".square")
	// 	.attr("fill", "red")
	// 	.style("stroke", function(d){return "black"});
	// add_flat_text();
	}

function draw_flat_links(root,treeIndex, links){
	
	colors = {0:"red", 1: "blue", 2:"green"}
	for(var i = 0; i<150 ;i++){	
		if(dataSel[i]!="true"){
			continue;
		}
		var dataSlice = { };
	
		for(key in jsonData){
			dataSlice[key] = jsonData[key][i];
		};

		var linkDraw = canvas.selectAll('paths')
					.data(rfPath[treeIndex][i], function(d){return d;})
					.enter()
					.append("g")
					.attr("class", "link");

		linkDraw.selectAll("links")
		.data(rfPath[treeIndex][i], function(d){return d;})		
		.enter()
		.append("path")
				//.insert('path', "g")
		.attr("class", "links")
		.attr("stroke", function(d){ return colors[dataTarget[i]]})
		.attr("fill", "none")
		.attr("opacity", op)
		.attr("stroke-width", "1px")
		.attr("d", function(d,i){return diagonals_flat(d,i,dataSlice, treeIndex)})
		.on("pointerover", function(p,d){
			linkDraw.attr("opacity", 1);	
			// console.log(d);
			});			
		
		// linkDraw.attr("d", function(d,i){return diagonals_flat(d,i,dataSlice)})
			
			}
		}

function draw_tree(jsonData,treeIndex){
	canvas = build_canvas();
	// set_tree_map();
for(var i =0; i<10; i++){
if(treeSel[i]=="true"){
	draw_flat_nodes('root',i, 'nodes');
	draw_flat_links('root',i, 'links');
}
	
}	
}
//////////////////////////////////////////////
///////////////select functions//////////////
////////////////////////////////////////////
function tree_select(){
	// console.log("in tree select fn");
	var svg  = d3.select("#treeSelect")
	.append("svg")
	.attr("width", 500)
	.attr("height", hdim)
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		// nodes = keyVals;

		svg.append("text")
		.attr("x", (wdim / 6))
		.attr("y", (90 ))
		.attr("text-anchor", "middle")
		.style("font-size", "24px")
		.style("text-decoration", "underline")
		.style('fill', '#black')
		.text("Select Trees");

	nodes =  Object.keys(treeSel);
	var nodeDraw = svg.selectAll("nodes")
					.data(nodes, function(d,i){return d;})
					.enter()
					.append("g")
					.attr('class', 'node');

	nodeDraw.selectAll("treeSquare")
			.data(nodes, function(d,i){return d;})
			.enter().append("rect")
			.attr("class","treeSquare")
			.attr('width', function(d) { return 20; })
			.attr('height', function(d) { return 20; })	
			.attr('x', function(d){return (d*2*20)})
			.attr('y', function(d) { return 150; })
			.attr("fill", "black")
			.style("stroke", function(d){return "black"})
			.style("stroke-width", function(d){return "0";})
			.attr('opacity', 0.25)
			.on("mouseover", function(d){
					// console.log("tree mouse over");
					// console.log(this);
			if(this["attributes"]["width"].value==20){
				d3.select(this)
				.attr('width', 30)
				.attr('height', 30)
				.attr("opacity", 1.0);
				// console.log(d);
				treeSel[get_pointer_data(d)]="true";
			}
			else{
				d3.select(this)
				.attr('width', 20)
				.attr('height', 20)
				.attr("opacity", 1.0);
				// console.log(d);

				treeSel[get_pointer_data(d)]="false";
			}
			});
		}

function data_select(){
	var svg  = d3.select("#dataSelect")
	.append("svg")
	.attr("width", 1800)
	.attr("height", hdim)
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		// nodes = keyVals;

		svg.append("text")
		.attr("x", (wdim / 4))
		.attr("y", (90 ))
		.attr("text-anchor", "middle")
		.style("font-size", "24px")
		.style("text-decoration", "underline")
		.style('fill', '#black')
		.text("Select data points");

	nodes =  Object.keys(dataSel);

	var nodeDraw = svg.selectAll("nodes")
					.data(nodes, function(d,i){return d;})
					.enter()
					.append("g")
					.attr('class', 'node');
	nodeDraw.selectAll("square")
			.data(nodes, function(d,i){return d;})
			.enter().append("rect")
			.attr("class","treeSelect")
			.attr('width', function(d) { return 10; })
			.attr('height', function(d) { return 10; })	
			.attr('x', function(d){return (d*1.1*10)})
			.attr('y', function(d) { return 350; })
			.attr('opacity', 0.25)
			.attr("fill", function(d){return colors[dataTarget[d]]})
			.style("stroke", function(d){return "black"})
			.style("stroke-width", function(d){return "0";})
			.on("mouseover", function(d){
			if(this["attributes"]["width"].value==10){
				d3.select(this)
				.attr('width', 15)
				.attr('height', 45)
				.attr("opacity", 1.0);
				// console.log(d);

				dataSel[get_pointer_data(d)]="true";
			}
			else{
				d3.select(this)
				.attr('width', 10)
				.attr('height', 10)
				.attr("opacity", 1.0);
				// console.log(d);

				dataSel[get_pointer_data(d)]="false";
			}
			});
}

////////////////////////////////////////////////////////////////////
/////////////////////// MAIN //////////////////////////////////////
//////////////////////////////////////////////////////////////////
function main(){
	d3.selectAll("svg").remove();
	tree_select();
	data_select();
	draw_tree(jsonSK2);
	for(var i = 0; i<150;i++){
		dataSel[i] = "false";
	}
	for(var i = 0; i<10;i++){
		treeSel[i] = "false";
	}

}