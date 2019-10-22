// Takes in an absolute path of a file, returns only the name of the file
// For example, ../../myProject/modules/myFile.js -> myFile
function grabFileName(filename) {
	const fileNameArray = filename.split('/');
	return fileNameArray[fileNameArray.length - 1];
}

module.exports = grabFileName;