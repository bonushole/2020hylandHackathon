//TODO-- Require FFmpeg installation in raw form in some sort of way.'
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const fs = require('fs');
const spawn = require('child_process');

//Cut
//Cut given source file ID to given start and end times and save at the given ID in ./projectID/TEMP with the same extention
//
//Params: 	projectID- project ID in use
//			fileID 	 - ID of file from /IN to be cut
//			fileType - Extention of the file being cut
//			saveID	 - ID of file to be saved in /TEMP
//			start 	 - Target start time of clip in ms
//			end   	 - Target end time of clip in ms
cut(projectID, fileID, fileType, saveID, start, end){
	let args = ["-i", projectID+"/IN/"+fileID + '.' + fileType , "-ss", start, "-to", end, projectID+"TEMP/"+saveID + '.' + fileType];
	ffmpeg.spawn(ffmpegPath, args);
	ffmpeg.on('exit', function (code) {
		console.log('FFmpeg exited with exit code '+code);
		if(code = 0)
			console.log('File saved at ' + projectID+"TEMP/"+saveID + '.' + fileType);
		else
			console.log('Error cutting file');
	});
}		

//Concat
//NOTE-- Use 'Concat Filter' to allow different filetypes
//TODO-- Add support for non .mp4 files
//Merge the given clips given by ID, Location (0 = source, 1 = temp), and type in order of appearance, and save as given filetype with given ID in ./projectID/OUT with given bitrate
//
//Params:	projectID - project ID in use
//			clips     - Array of clip objects with the fields ID, location, and TYPE
//			outType   - Type of output file (currently .mp4 only)
//			outID	  - ID of file to be saved in /OUT
//			bitRate	  - Target bitrate for the operation
concat(projectID, clips, outType, outID, bitRate){
	
}

//Thumbnail
//TODO-- Add functionality to check length and modify thumbnail time appropriately
//Create thumbnail for given clip ID and location (source, temp) and save in ./projectID/THUMBS with ID of the form "LOCATION_ID" where LOCATION is an integer 0-1 and ID is the given ID
//Clips >= 1s have thumbnail taken at 1s, else thumbnail is taken at clip end
//	
//Params:	projectID 	 - project ID in use
//			fileID 	 	 - ID of file to create thumbnail for
//			filetype	 - Extention of file as string
//			fileLocation - location of clip (source = 0, temp = 1)
thumbnail(projectID, fileID, fileType, fileLocation){
	if (fileLocation = 0)
		loc = 'IN';
	else if(fileLocation = 1)
		loc = 'TEMP'
	let args = ["-i", projectID+'/'+loc+'/'+fileID+'.'+fileType, '-ss', '00:00:00.000', '-vframes', '1', projectID+'/THUMBS/'+fileLocation+'_'+fileID+'.png'];
	ffmpeg.on('exit', function (code) {
		console.log('FFmpeg exited with exit code '+code);
		if(code = 0)
			console.log('Thumbnail saved at ' + projectID+'/THUMBS/'+fileLocation+'_'+fileID+'.png');
		else
			console.log('Error creating thumbnail');
	});
}

//Render
//Carry out sequence of Cut and Concat commands as specified by the given Sequence object, and return the sequence object with the following changed:
//- set all modified clips to point to their most recent /TEMP ID 
//- set all previouslt uncut clips to have 'cut = true' and point to their /TEMP ID
//
//Params:	projectID - project ID in use
//			sequence  - Sequence object
//
//
render(sequence){
	
}