
var jsonData = {
    "name" : "Max",
	"feat" : 1,
	"val" : 0.3,
    "children" : [
        {
        "name": "Sylvia",
        "children":[
                {"name":"Craig",
				"feat" : 1,
				"val" : 0.3},
                {"name":"Robin",
				"feat" : 1,
				"val" : 0.3
			},
            ]
        },
        {
        "name": "David",
		"feat" : 1,
		"val" : 0.3,
	
        "children":[
                {"name":"Jeff",
				"feat" : 1,
				"val" : 0.3
			},
                {"name":"Buffy",
				"feat" : 1,
				"val" : 0.3
			}            ]
        }
    ]
};    

var jsonData2 = {
    "name" : "Max",
    "children" : [
        {
        "name": "Sylvia",
        "children":[
                {"name":"Craig"},
                {"name":"Robin"},
                {"name":"Anna"}
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
    
    

        
//export {jsonData};