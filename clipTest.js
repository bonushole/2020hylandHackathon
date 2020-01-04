const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const spawn = require('child_process').spawn;
const fs = require('fs');


//Concat method
//takes segment ids to be concatenated from /TEMP, creates tmp.txt to concat them
//Then runs ffmpeg -f concat
function concat(ids){
	text = "";
	
	//generate path texts
	for (i = 0; i < ids.length; i++){
		text += "file 'C:/Users/noxid/Documents/GitHub/2020hylandHackathon/TEMP/"+ids[i]+".mp4\n";
	}
	
	//write tmp.txt
	fs.writeFile('tmp.txt', text, (err) => {
		if (err) throw err;
		// success case, the file was saved
		console.log('paths saved');
	});
	
	//actual ffmpeg call
	let outID= ""+Math.random()+""+Math.random()
	let args = ["-f", "concat", "-safe","0", "-i", "tmp.txt", "-c", "copy", "OUT/"+outID+".mp4"];
	const ffmpeg = spawn(ffmpegPath, args);
	ffmpeg.on('exit', function (code) {
		console.log('Child process exited with exit code '+code);
	});
	return outID
}

//Cut method
//takes segment id to be cut from /IN, start time, and end time, places cut clip in /TEMP
//returns temp id
function cut(id, start, end){
	randID = Math.random();
	let args = ["-i", "IN/"+id+".mp4", "-ss", start, "-to", end, "TEMP/"+randID+".mp4"];
	const ffmpeg = spawn(ffmpegPath, args);
	ffmpeg.on('exit', function (code) {
		console.log('Child process exited with exit code '+code);
	});
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
		ids.push(cut(segments[i].sourceID, segments[i].start, segments[i].end));
	}
	return concat(ids);
}
	
	
	
	
