// Takes a filename as a input, returns the finename without the extension
// For example, my-file.js -> my-file
function removeExtensionFromFileName(filename) {
	return filename.replace(/\.[^/.]+$/, "");
}

module.exports = removeExtensionFromFileName;