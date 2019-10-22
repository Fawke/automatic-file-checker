const fs = require('fs');

// Creates a CSV file and writes it to a specific location

// TO DO: Add Email of the Adapter maintainer to the CSV file.
function deletedAdaptersCSVMaker(header, row, location) {
	const headerRow = header.join();
	const rows = row.join();
	const data = headerRow + rows;
	fs.writeFile(`${location}/deleted-adapters.csv`, data, (err) => {
		if (err) {
			console.error(err);
			return;
		}
		console.log('csv written successfully!');
	});
}

module.exports = deletedAdaptersCSVMaker;