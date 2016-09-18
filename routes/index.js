var parser = require("../parser.js");

exports.course = function(req, res){
	console.log("redirect to /course");
	console.log(req.query.college);
	if(req.query.college){
		console.log("get query");
	}else{
		console.log("no query");
	}
	var result = [];
	parser.query(req.query.college, req.query.dept_no, function(){
		res.render( 'course', {
			college: req.query.college? req.query.college : '',
			colleges: this.colleges,
			depts: this.depts,
			courses: this.courses
		});	
	});
	
	
	
};

exports.about = function(req, res){
	
};

