// Creates a directory at the specified location
const fs = require('fs');

function createDirectory(dirName) {
	try {
		if (!fs.existsSync(dirName)) {
			fs.mkdirSync(dirName);
		}
	} catch(err) {
		console.error(err.message);
	}
}

module.exports = createDirectory;