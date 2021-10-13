
/////////////////////////////////////////////////////////////////////
/////////////////////////global variables/////////////////////////////
////////////////////////////////////////////////////////////////////

// The offset of the grid from x and y axes. (just to center the grid)
var offset = 100;

// To store the previous and current clicked squares position
var objectTracer = {"previous" : {"x": 0, "y" : 0},
					"current" : {"x": 0, "y" : 0}}

// These two variables are used to store the state of clicking activity
var clicked = false;
var transition = false;



/////////////////////////////////////////////////////////////////////
/////////////////////////getData////////////////////////////////////
/////////////////Function to get the array data/////////////////////
////////////////////////////////////////////////////////////////////
function getData() {
	// declare array to store the data
	var data = new Array();

	// initial position is offset point
	var xpos = offset; 
	var ypos = offset;

	// width and height of each square
	var width = 100;
	var height = 100;
	
	// iterate over rows	
	for (var row = 0; row < 4; row++) {
		data.push( new Array() );
		
		// iterate for cells/columns inside rows
		for (var column = 0; column < 5; column++) {
            
			data[row].push({
				"x": xpos,
				"y": ypos,
				"width": width,
				"height": height,
                "r": (column/5)*255,
                "g": (row/4)*255
			})
			xpos += width;
		}

		xpos = offset;
		ypos += height;	
	}
	return data;
}




/////////////////////////////////////////////////////////////////////
/////////////////////////updateData////////////////////////////////////
/////////////////Function to swap any two selected squares/////////////////////
////////////////////////////////////////////////////////////////////
function updateData(){

// Get the previous and current data
var prevData = gridData[(objectTracer.previous.y-offset) / 100][(objectTracer.previous.x-offset) / 100];
var currData = gridData[(objectTracer.current.y-offset) / 100][(objectTracer.current.x-offset) / 100];

// swap the colors of the two variables using temporaty variables
var tempR = prevData.r;
var tempG = prevData.g;

prevData.r = currData.r;
prevData.g = currData.g;

currData.r = tempR;
currData.g = tempG;

gridData[(objectTracer.previous.y-offset) / 100][(objectTracer.previous.x-offset) / 100] = prevData;
gridData[(objectTracer.current.y-offset) / 100][(objectTracer.current.x-offset) / 100] = currData;

// draw the grid again with the swapped data. data is accessed from globally declared variables
drawGrid();
}


/////////////////////////////////////////////////////////////////////
/////////////////////////drawGrid////////////////////////////////////
/////////////////Function to draw the grid/////////////////////
////////////////////////////////////////////////////////////////////
function drawGrid() {

// d3.selectAll("svg").remove();

// var grid = d3.select("#grid")
// 	.append("svg")
// 	.attr("width","600")
// 	.attr("height","600");
var width = 1200,
    height = 1200,
    div = d3.select('#forest'),
    svg = div.append('svg')
        .attr('width', width)
        .attr('height', height),
    rw = 95,
    rh = 95;  
var data = [];

for (var k = 0; k < 3; k += 1) {
    data.push(d3.range(3));
}
console.log(data);
var grp = svg.selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('transform', function(d, i) {
        return 'translate(0, ' + (rh + 5) * i*3 + ')';
    });


	grp.selectAll('rect')
    .data(function(d) { return d; })
    .enter()
    .append('rect')
        .attr('x', function(d, i) { return (rw + 5) * i; })
        .attr('width', rw)
        .attr('height', rh);



// First draw rows
// var tree = grid.selectAll("levels")
// 	.data(gridData)
// 	.enter()
//     .append("g")
// 	.attr("class", "row");
	
// draw columns on top of the rows
// var column = row.selectAll("square")
// 	.data(function(d) { return d; })
// 	.enter().append("rect")
// 	.attr("class","square")
// 	.attr("x", function(d) { return d.x; })
// 	.attr("y", function(d) { return d.y; })
// 	.attr("width", function(d) { return d.width; })
// 	.attr("height", function(d) { return d.height; })
// 	.style("fill", function(d){return("rgb(" + d.r + "," + d.g + ",255)");})
// 	.style("stroke", "rgb(255,255,255)")
// 	.on('click', function(d) {
	   
//         if(clicked){
// 			// This is for the second click
// 			objectTracer["current"]["x"] = d.explicitOriginalTarget.__data__.x;//d.path[0].__data__.x; 
// 		    objectTracer["current"]["y"] = d.explicitOriginalTarget.__data__.y;//d.path[0].__data__.y; 
// 			clicked = false;
// 			transition = true;
//         }
        
//         else{
// 			// THis is for the  first click
// 		    objectTracer["previous"]["x"] = d.explicitOriginalTarget.__data__.x;//d.path[0].__data__.x; 
// 		    objectTracer["previous"]["y"] = d.explicitOriginalTarget.__data__.y;//d.path[0].__data__.y; 
//             d3.select(this).transition().duration('400').style("fill","rgb(0,0,0)");
//             clicked = true;
//         }

// 		// once both square sare clicked transition
// 		if(transition){
// 			updateData();
// 			transition = false;}

    // });


	// add text on top of the squares to show color intensity
	// var text = row.selectAll(".text")
	// .data(function(d) { return d; })
	// .enter()
	// .append("text")
	// .attr("x", function(d) { return d.x + 50; })
	// .attr("y", function(d) { return d.y + 50; })
	// .attr("text-anchor", "middle")
    // .style("font-size", "12px")
	// .style("fill", "rgb(255,255,255)")
	// .text(function(d){return("r: " + d.r/255 + " ,g:" + d.g/255);})
}

// reset to default when the reset button is clicked
function resetState(){
	gridData = getData();
	drawGrid();
	}

// get initial data
var forestData = [{"tree1" : {"node0" : {"node1" : {"node3" : 10, "node4" : 10}, "node2" : 10} }}];

var gridData = getData();
drawGrid();


// Explanation text
// var expText = "<span style='font-size: 12px;'>\
// 					<p>Project2 : Direct Manipulation</p>\
// 					<p>ZID : z1839739</p>\
// 					<p>Name : Devesh Seethi</p>\
// 					<p>Course : Visual Analytics (CSCI680)</p></span>\
// 					<span style='text-decoration: underline; font-size: 18px;'> Explanation :</span>\
// 					<span style='font-size: 18px;'>\
// 					The matrix represents the intensity of red and green colors along it's rows and columns respectively.\
// 					The intensity of color is represented as a fraction by converting the scale range of a particular from 0-255 to 0-1.\
// 					As there are five rows, the range of red is divided into five parts (0, 0.2, 0.4, 0.6, 0.8). Similarly, the range\
// 					 of green is divided into four parts (0, 0.25, 0.50, 0.75) for\
// 					the four columns. In the matrix, red and green color are represented as r and g respectively.\
// 					<p>The matrix can be ordered along the rows when the values of red are arranged correctly.\
// 					It can also be ordered along the columns when the values of green are aranged. The matrix is automatically\
// 					ordered along both rows and columns when they are both ordered individually.</p>\
// 					<p>By default, the user may see the solved matrix is ordered along the rows and columns. The user can order or shuffle the matrix as desried through direct manipulation.\
// 					To directly manipulate the elements, the user must select one square that is to be swapped by clicking on the square. \
// 					The selected square then gets highlighted in black color. Now, the user can select the second square that they want to swap.\
// 					Once the second square is clicked, the two squares exchange the positions, and the steps may repeated until the desired\
// 					configuration is achieved. At any point, to revert the matrix to it's original form, reset button can be clicked to reset the\
// 					positions of all squares in the matrix.</p>\
// 					</span>"

// write the explanation on the right side of the page
// var exp = d3.select("#explanation")
//                 .append("div")
//                 .style("position", "absolute")
//                 .style("color", "black")
//                 .style("border", "#ffebcd")
//                 .style("border-width", "1px")
//                 .style("border-radius", "5px")
//                 .style("padding", "10px");

// 				exp.style("visibility", "visible")
// 				.html(expText);
		  

