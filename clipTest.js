const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const spawnSync = require('child_process').spawnSync;
const spawn = require('child_process').spawn;
const fs = require('fs');


seg = [[1,0,1000],[2,0,2000],[3,2000,3000],[4,1000,4000]];
console.log('output ID is:  '+ generate(seg));








//Concat method
//takes segment ids to be concatenated from /TEMP, creates tmp.txt to concat them
//Then runs ffmpeg -f concat
function concat(ids){
	text = "";
	
	//generate path texts
	for (i = 0; i <= ids.length; i++){
		text += "file 'C:/Users/noxid/Documents/GitHub/2020hylandHackathon/TEMP/"+ids[i]+".mp4\n";
	}
	console.log('paths generated...');
	//write tmp.txt
	fs.writeFile('tmp.txt', text, (err) => {
		if (err) throw err;
		// success case, the file was saved
		console.log('paths saved');
	});
	console.log('file generated...');
	//actual ffmpeg call
	let randID = Math.floor(Math.random()* 10000);
	let args = ["-f", "concat", "-safe","0", "-i", "tmp.txt", "-c", "copy", "OUT/"+randID+".mp4"];
	const ffmpeg = spawn(ffmpegPath, args);
	ffmpeg.on('exit', function (code) {
		console.log('Child process exited with exit code '+code);
	});
	return randID
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
	
	return concat(ids);
}
	
//export function generate(segments);
	
	
