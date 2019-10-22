import arg from 'arg';
const glob = require('glob');

const moveFiles = require('./utils/move-files');
const copyFiles = require('./utils/copy-files');
const deletedAdaptersCSVMaker = require('./modules/deleted-adapters-csv-maker');
const patternMatcher = require('./utils/pattern-matcher');
const grabEmail = require('./utils/grab-email');
const removeExtensionFromFileName = require('./utils/remove-extension-from-filename');
const grabFileName = require('./utils/grab-filename');

const VIOLATION_REGEX = require('./configs/VIOLATION_REGEX');

function parseArgumentsIntoOptions() {
	const args = arg(
		{
			// types
			'--dir': String,               // location of the directory where you want to run this command
			'--pattern': String,           // the pattern that you want to search for
			'--output-csv-location': String,        // the outpath of the generated csv file
			'--deleted-files-location': String,    // output path of the deleted folder
			'--hard-delete': Boolean,			 // if set to true, will delete all the files matching the pattern, if false, will keep them & move them to a temporary location
		}
	);
	return args;
}

export function cli(args) {
	try {
		const options = parseArgumentsIntoOptions(args);
		glob(options['--dir'], null, function (err, files) {
			if (err) {
				console.error(err.message);
				return;
			}

			let count = 1;
			let rows = [];
			files.forEach(file => {
				const violations = patternMatcher(file, VIOLATION_REGEX);
				if (violations.length > 0) {
					// TO DO: Find a better delimiter, current I've chosen ' ' because CSV is not getting constructed
					// properly if I chose ",", but comma is a much better option. Easy to view.
					const fileNameWihoutExtension = removeExtensionFromFileName(file);
					const fileName = grabFileName(fileNameWihoutExtension);
					const email = grabEmail(`${fileNameWihoutExtension}.md`);
					rows.push(`\n${count}, ${fileName}, ${violations.join(' ')}, ${email}`)
					count = count + 1;

					// Check if the user provided deleted-files-location option, if yes, then execute moveFilesToNewLocation() function
					if (options['--deleted-files-location']) {
						const newLocation = options['--deleted-files-location'];

						// if hard-delete options is set to true, it'll permaneently move the files, else, it'll just copy the files.
						// it's recommended to NOT hard-delete at first, review your files in the csv, review the deleted files, once, you're sure that the files are correctly deleted, then only do a hard delete.
						if (options['--hard-delete']) {
							moveFiles(file, newLocation);
						} else {
							copyFiles(file, newLocation);
						}
					}
				} else {
					// Did not find any matching patterns in this file.
					// If you want to do anything with those files, you can do here.
				}
			});

			if (options['--output-csv-location']) {
				// Create the CSV file
				const csvLocation = options['--output-csv-location'];
				deletedAdaptersCSVMaker(['S.No', 'BidAdapter Name', 'Violations', 'Email'], rows, csvLocation);
			}
		});
	} catch (err) {
		console.error("ERR:", err.message);
	}
}