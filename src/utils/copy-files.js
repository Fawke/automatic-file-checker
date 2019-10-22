const fs = require('fs');
const createDirectory = require('./create-directory');

function copyFiles(file, newLocation) {
	// create a directory to copy all the files.
	createDirectory(newLocation);

	const fileLocationArray = file.split('/');
	const fileName = fileLocationArray[fileLocationArray.length - 1];

	fs.copyFile(file, `${newLocation}/${fileName}`, (err) => {
		if (err) {
			console.error(err);
			return;
		}
	});;
}

module.exports = copyFiles;