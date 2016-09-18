var request = require("request");
var fs = require("fs");
var cheerio = require("cheerio");
var async = require("async");

exports.query = function(college, dept, callback){
	console.log("start query ...");
	
	var colleges = [];
	var depts = [];
	var courses = [];
	/*collegeAndDeptQuery(college, function(){
		colleges = this.colleges;
		depts = this.depts;
	});
	console.log(colleges);
	courseQuery(dept, function(){
		courses = this.courses;
	});*/
	

	async.parallel([
		function(callback){
			collegeQuery(function(){
				/*colleges = this.colleges;
				depts = this.depts;	*/	
				callback(null, this.colleges);	
			});
		},
		function(callback){
			deptQuery(college, function(){
				/*colleges = this.colleges;
				depts = this.depts;	*/	
				callback(null, this.depts);	
			});
		},
		function(callback){
			courseQuery(dept, function(){
				/*colleges = this.colleges;
				depts = this.depts;	*/	
				callback(null, this.courses);	
			});		
		}
		], function(err, results) {
			var data = {
				colleges: results[0],
				depts: results[1],
				courses: results[2]
			}
			console.log(data);
			/*this.colleges = colleges;
			this.depts = depts;
			this.courses = courses;*/
			callback && callback.call(data);
		}
	);
	
	/*this.colleges = colleges;
	this.depts = depts;
	this.courses = courses;
	
	callback && callback.call(this);*/
}
	
function collegeQuery(callback){
	console.log("query college and dept");
	
	request({
	url: "http://course-query.acad.ncku.edu.tw/qry/",
	method: "GET"
	}, function(e,r,b) {
		if(e || !b){
			return; 
		}
		
		var $ = cheerio.load(b);
		var titles = $(".theader");
		
		var colleges = [];
		for(var i=0; i<titles.length; i++) {
			colleges.push($(titles[i]).text());
		}
		this.colleges = colleges;
		callback && callback.call(this);
	});
	
};

function deptQuery(college, callback){
	console.log("query dept");
	
	request({
	url: "http://course-query.acad.ncku.edu.tw/qry/",
	method: "GET"
	}, function(e,r,b) {
		if(e || !b){
			return; 
		}
		
		var $ = cheerio.load(b);	
		var titles = ".theader[title=" + college + "] + .tbody div ";	

		var depts = [];
		$(titles).each(function(index){
			var $tag = $(this).find("a");
			var href = $tag.attr('href');
			var pos = href.indexOf('dept_no=') + 8;
			var data = {
				type: $(this).attr('class'),
				name: $tag.text(),
				dept_no: href.substring(pos, pos+2)
			};
			depts.push(data);
		});
		this.depts = depts;
		callback && callback.call(this);
	});
}

function courseQuery(dept_no, callback){
	console.log("query course");	
	
	request({
	url: "http://course-query.acad.ncku.edu.tw/qry/qry001.php?dept_no=" + dept_no,
	method: "GET"
	}, function(e,r,b) {
		if(e || !b){
			return; 
		}
		
		var $ = cheerio.load(b);
		var titles = $("tbody tr[class^='course_']");
		
		var headers = [];headers.push("課程名稱");
		var contents = [];
		$(titles).each(function(index){
			var data = {
				name: $(this).find(":nth-child(11) a").text()
			};
			contents.push(data);
		});
		this.courses = {
			headers: headers,
			contents: contents
		};
		callback && callback.call(this);
	});
}
	
