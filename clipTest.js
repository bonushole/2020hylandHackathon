const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const spawnSync = require('child_process').spawnSync;
const spawn = require('child_process').spawn;
const VideoLib = require('node-video-lib');
const fs = require('fs');
var ids = [];


console.log(getLength(1));


//Concat method
//takes segment ids to be concatenated from /TEMP, creates tmp.txt to concat them
//Then runs ffmpeg -f concat
function concat(ids){
	text = "";
	
	//generate path texts
	for (i = 0; i < ids.length; i++){
		text += "file ./TEMP/"+ids[i]+".mp4\n";
	}
	console.log('paths generated...');
	//write tmp.txt
	fs.writeFile('tmp.txt', text, (err) => {
		if (err) throw err;
		// success case, the file was saved
		console.log('paths saved');
		console.log('file generated...');
		//actual ffmpeg call
		let randID = Math.floor(Math.random()* 10000);
		let args = ["-f", "concat", "-safe","0", "-i", "tmp.txt", "-c", "copy", "OUT/"+randID+".mp4"];
		const ffmpeg = spawn(ffmpegPath, args);
		ffmpeg.on('exit', function (code) {
			console.log('Child process exited with exit code '+code);
		});
		return randID
	});

}

//Cut method
//takes segment id to be cut from /IN, start time, and end time, places cut clip in /TEMP
//returns temp id
function cut(id, start, end){
	shouldQuit = 0;
	randID = Math.floor(Math.random()* 10000);
	let args = ["-i", "IN/"+id+".mp4", "-ss", start/1000, "-to", end/1000, "TEMP/"+randID+".mp4"];
	const ffmpeg = spawnSync(ffmpegPath, args);
	//ffmpeg.on('exit', function (code) {
	//	console.log('Child process exited with exit code '+code);
	//});
	return randID;
}
	
//generate video method
//Takes list of segments
//cuts all segments appropriately
//concatenates all segments
//returns output video ID
function generate(segments){
	ids = [];
	for(i = 0; i < segments.length; i++){
		//ids.push(cut(segments[i].sourceFileID, segments[i].start, segments[i].end));
		ids.push(cut(segments[i][0], segments[i][1], segments[i][2]));
	}
	console.log(ids);
	ret = concat(ids);
	return ret;
}

function free(){
	for(i = 0; i < ids.length; i++){
		fs.unlink("./TEMP/"+ids[i]+".mp4", (err) => {
		if (err) {
			console.error(err)
			return
		}

		//file removed
		})
	}
}

function createThumbs(ID){
	console.log("creating thumb for "+ID);
	let args = ["-i", "./IN/"+ID+".mp4", '-ss', '00:00:01.000', '-vframes', '1', './THUMBS/'+ID+'.png'] 
	const ffmpeg = spawnSync(ffmpegPath, args);
}

function getLength(sourceID){
	fd = fs.openSync('./IN/'+sourceID+'.mp4', 'r')
    try {
        let movie = VideoLib.MovieParser.parse(fd);
        // Work with movie
        return(movie.relativeDuration()*1000);
    } catch (ex) {
        console.error('Error:', ex);
    } finally{
		fs.closeSync(fd);
	}
	
}
	
exports.generate = generate;
exports.createThumb =  createThumbs;
exports.getLength = getLength;
	
	
