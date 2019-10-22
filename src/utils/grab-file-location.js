// Takes a filename as a input, return the location of that file
// For example, ../../myProject/modules/myFile.js -> ../../myProject/modules
function grabFileLocation(filename) {
	const fileLocationArray = filename.split('/');
	fileLocationArray.pop();
	return fileLocationArray.join('/');
}

module.exports = grabFileLocation;