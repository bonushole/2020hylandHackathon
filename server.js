const http = require('http');
var manipulations = require('./clipTest.js');

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
		sources.push({id: currID, Name: files.filetoupload.name});
		currID++;
		console.log(newpath);
		fs.rename(oldpath, newpath, function (err) {
			if (err) throw err;
			
			//Do thumbs stuff
			manipulations.createThumb(currID - 1)
			
			var json = JSON.stringify(sources);
			res.write(json);
			res.end();
		});
		
		
	
		
		
		
	});
	}else if(q.pathname == "/edit"){

		fs.readFile("./bigImportantVideoEditPage.html", function(err, data) {
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(data + "");
			res.end();
		});
		
		//MOVE: Moves specified clip to after the destination given
		//Takes moveID, destinationID
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
		
		//INSERT: Adds clip after specified segment ID
		//Takes sourceFileID, afterID
	} else if(q.pathname == "/insert"){
		var qdata = q.query;
		var sourceFileID = qdata.sourceFileID;
		var start = 0;
		var afterID = qdata.afterID;
		
		let x = manipulations.getLength(sourceID)
		
		var end = x
		var totalLength= x
		
		
		
		//create segment
		var temp = {sourceFileID: sourceFileID, start: start, end: end, segmentID: segmentID, totalLength: totalLength}
		//rearrange segments
		index = searchByID(afterID)
		segments.insert(index, temp)
		
		//RENDER: Renders the current sequence and outputs the file to ./OUT with a unique ID
		//Takes no arguments
	} else if(q.pathname == "/render"){
		//render video
		manipulations.generate(segments);
		//serve download 


		//CUT: Changes the duration of the specified clip to be between the bounds of start and end
		//Takes ID, start, end
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
		
		//DELETE: Remove the specified clip from the sequence
		//Takes ID
	}else if(q.pathname == "/delete"){
		
		var qdata = q.query;
		var ID = q.ID;
	
		index = searchByID(ID);
		segments.splice[index];
		
		//THUMB: load the thumbnail for the specified ID
		//Takes ID
	}else if(q.pathname == "/thumb"){
	
		var id = q.id;
		fs.readFile("./THUMBS/"+id+".png", function(err, data) {
			res.writeHead(200, {'Content-Type': 'img/png'});
			res.write(data + "");
			res.end();
		});
		
		
	}else{
		if(q.pathname.endsWith("png")){
			console.log("."+q.pathname);
			fs.readFile("."+q.pathname, function(err, data) {
				if(err) console.log("error");
				
				res.writeHead(200, {'Content-Type': 'image/png'});
				console.log(data);
				res.write(data);
				res.end();
			});
		}
		/*
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write('<form action="upload" method="post" enctype="multipart/form-data">');
		res.write('<input type="file" name="filetoupload"><br>');
		res.write('<input type="submit">');
		res.write('</form>');
		return res.end();
		
		*/
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

//Helper function to find sequence index given object ID
function searchByID(id){
	i = 0;
	for(i = 0; i < segments.length; i++){
		if(segments[i] == id){
			index = i;
		}
	}
	return index;
}
