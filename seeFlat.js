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

/////////////////////////////////////////////////////////////////
/////////////////////tooltip for node//////////////////////
///////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////
////////////////////////////FLATS////////////////////////
//////////////////////////////////////////////////////////
function diagonals_flat(d, deep, dataSlice) {
	// console.log(d);

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

	if(parentName!="leaf"){
		var xmulP = squareDim*1* dataSlice[parentName] + squareDim*1.1*positionP;
	}
	else{
		// console.log("parent is leaf");
		parentName = childName;
		var xmulP = squareDim*1* dataSlice[parentName] + squareDim*1.1*positionP;
	}

	if(childName!="leaf"){

		//console.log(childName);
		var xmulC = squareDim*1* dataSlice[childName] + squareDim*1.1*positionC;
	}
	else{
		// console.log("child is leaf");
		childName=parentName;
		var xmulC = squareDim*1* dataSlice[childName] + squareDim*1.1*positionC;
	}
	
				path = `M ${xmulC}, ${350}
				C ${xmulC} ${(350+350)/2- deep*squareDim},
				${xmulP} ${(350+350)/2- deep*squareDim},
				${xmulP} , ${350}`
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
				globalSelect = d.explicitOriginalTarget.__data__;
			}
			else{
				var temp = 'a';
				var curSelect = d.explicitOriginalTarget.__data__;
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
		.attr("d", function(d,i){return diagonals_flat(d,i,dataSlice)})
		.on("pointerover", function(p,d){
			linkDraw.attr("opacity", 1);	
			console.log(d);
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
	nodeDraw.selectAll("square")
			.data(nodes, function(d,i){return d;})
			.enter().append("rect")
			.attr("class","treeSelect")
			.attr('width', function(d) { return 20; })
			.attr('height', function(d) { return 20; })	
			.attr('x', function(d){return (d*2*20)})
			.attr('y', function(d) { return 350; })
			.attr('opacity', 0.25)
			.attr("fill", "black")
			.style("stroke", function(d){return "black"})
			.style("stroke-width", function(d){return "0";})
			.on("mouseover", function(d){

			if(this["attributes"]["width"].value==20){
				d3.select(this)
				.attr('width', 30)
				.attr('height', 30)
				.attr("opacity", 1.0);
				treeSel[d.explicitOriginalTarget.__data__]="true";
			}
			else{
				d3.select(this)
				.attr('width', 20)
				.attr('height', 20)
				.attr("opacity", 1.0);
				treeSel[d.explicitOriginalTarget.__data__]="false";
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
				dataSel[d.explicitOriginalTarget.__data__]="true";
			}
			else{
				d3.select(this)
				.attr('width', 10)
				.attr('height', 10)
				.attr("opacity", 1.0);
				dataSel[d.explicitOriginalTarget.__data__]="false";
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
	// Radial tree seems to be a cool idea
	draw_tree(jsonSK2);
	
}

