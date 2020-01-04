const http = require('http');
//var manipulations = require('clipTest.js');
var formidable = require('formidable');
var url = require('url');
var fs = require('fs');
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
		var newpath = './IN/' + currID +".mp4";
		sources.push({ID: currID, Name: files.filetoupload.name});
		currID++;
		fs.rename(oldpath, newpath, function (err) {
			if (err) throw err;
			res.write('File uploaded and moved!');
			res.end();
		});
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
		index = -1;
		
		temp = segments[moveID];
		segments.splice(moveID);
		
		for(i = 0; i < segments.length; i++){
			if(segments[i].segmentID == destinationID){
				index = i;
			}
		}
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
		index = -1;
		for(i = 0; i < segments.length; i++){
			if(segments[i].segmentID == destinationID){
				index = i;
			}
		}
		segments.insert(index, temp)

	} else if(q.pathname == "/render"){
		//render video
		manipulations.generate(segments);


	}else{


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
