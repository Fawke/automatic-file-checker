const fs = require('fs');
const createDirectory = require('./create-directory');

// Moves files to a new dicrectory.
function moveFiles(file, newLocation) {
	// create a directory to move all the files.
	createDirectory(newLocation);

	const fileLocationArray = file.split('/');
	const fileName = fileLocationArray[fileLocationArray.length - 1];
	
	fs.rename(file, `${newLocation}/${fileName}`, (err) => {
		if (err) {
			console.error(err);
			return;
		}
	});
}

module.exports = moveFiles;