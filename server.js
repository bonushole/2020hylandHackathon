const http = require('http');
var formidable = require('formidable');
var url = require('url');
var fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	var q = url.parse(req.url, true);	
	if(q.pathname=="/upload"){
		var form = new formidable.IncomingForm();
		form.parse(req, function (err, fields, files) {
		var oldpath = files.filetoupload.path;
		var newpath = './videos/' + 		files.filetoupload.name;
		fs.rename(oldpath, newpath, function (err) {
			if (err) throw err;
			res.write('File uploaded and moved!');
			res.end();
		});
	});
	} else{


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
