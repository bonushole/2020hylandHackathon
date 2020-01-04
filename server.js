const http = require('http');
<<<<<<< HEAD
//var manipulations = require('clipTest.js');
=======
var manipulations = require('./clipTest.js');
>>>>>>> 9e3909fcf51f3876fe387f03080b22b9e278b688
var formidable = require('formidable');
var url = require('url');
var fs = require('fs');
//var cors = require('cors');
const fetch = require("node-fetch");

var segments = [];
var sources = [];
var currID = 0;
const hostname = '127.0.0.1';
const port = 8081;

//console.log(('b' + 'a' + + 'a' + 'a').toLowerCase());

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	var q = url.parse(req.url, true);	
	if(q.pathname=="/upload"){
		var form = new formidable.IncomingForm();
		form.parse(req, function (err, fields, files) {
		var oldpath = files.filetoupload.path;
		console.log(oldpath);
		var newpath = './IN/' + currID +".mp4";
		sources.push({ID: currID, Name: files.filetoupload.name});
		currID++;
		console.log(newpath);
		fs.rename(oldpath, newpath, function (err) {
			if (err) throw err;
			var json = JSON.stringify(sources);
			res.write(json);
			res.end();
		});
		
		//Do thumbs stuff
		manipulations.createThumb(currID)
	
		
		
		
	});
	}else if(q.pathname == "/edit"){

		fs.readFile("./bigImportantVideoEditPage.html", function(err, data) {
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(data + "");
			res.end();
		});

	} else if(q.pathname == "/move"){
		var qdata = q.query;
		var moveID = qdata.moveID;
		var destinationID = qdata.destinationID;
		
		//rearrange segments
		
		//Find index of object to move in front of	
		temp = segments[moveID];
		segments.splice(moveID);
		
		index = searchByID(destinationID)
		//put it there
		segments.insert(index, temp)


	} else if(q.pathname == "/insert"){
		var qdata = q.query;
		var sourceFileID = qdata.sourceFileID;
		var start = qdata.start;
		var end = qdata.end;
		var totalLength= qdata.totalLength;
		var afterID = qdata.afterID;
		
		//create segment
		var temp = {sourceFileID: sourceFileID, start: start, end: end, segmentID: segmentID, totalLength: totalLength}
		//rearrange segments
		index = searchByID(afterID)
		segments.insert(index, temp)

	} else if(q.pathname == "/render"){
		//render video
		manipulations.generate(segments);
		//serve download 

	}else if(q.pathname == "/cut"){
		
		var qdata = q.query;
		var ID = q.ID;
		var newStart = q.start;
		var newEnd = q.end;
		var temp = segments[searchByID(ID)];
		if(newEnd > temp.totalLength)
			newEnd = totalLength;
		if(newStart < 0)
			newStart = 0;
		temp.start = newStart;
		temp.end = newEnd;
		

	}else if(q.pathname == "/delete"){
		
		var qdata = q.query;
		var ID = q.ID;
	
		index = searchByID(ID);
		segments.splice[index]
	}
	else{


		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write('<form action="upload" method="post" enctype="multipart/form-data">');
		res.write('<input type="file" name="filetoupload"><br>');
		res.write('<input type="submit">');
		res.write('</form>');
		return res.end();
		/*
		res.setHeader('Content-Type', 'text/plain');
		var string = "Hello World From: \n";
		string = string +"Max \n";
		res.end(string);
		*/
	}
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});

function searchByID(id){
	i = 0;
	for(i = 0; i < segments.length; i++){
		if(segments[i] == id){
			index = i;
		}
	}
	return index;
}
