import arg from 'arg';
const glob = require('glob');
const fs = require('fs');

function parseArgumentsIntoOptions(rawArgs) {
 const args = arg(
     {
         // types
         '--dir': String,               // location of the directory where you want to run this command
         '--pattern': String,           // the pattern that you want to search for
         '--output-csv': String,        // the outpath of the generated csv file
         '--deleted-folder': String,    // output path of the deleted folder
         '--replace': [String]          // replace deleted files 
     }
 );
 return args;
}

// finds a matching pattern in a file and returns the matched pattern if found, empty array otherwise
function patternMatch(file, patterns) {
		let violations = [];
		try {
			// might wanna convert this to a async function later on.
			const data = fs.readFileSync(file, 'utf-8');
			if (patterns.length > 1) {
				patterns.forEach(pattern => {
					data.toString().match(pattern) ? violations.push(data.toString().match(pattern)) : undefined;
				});
			} else {
				violations = [data.toString().match(patterns)];
			}
		} catch(e) {
			console.error(e.message);
			return;
		}
		const flattenArray = [].concat.apply([], violations);
		return [...new Set(flattenArray)];
}

const VIOLATION_REGEX = [	
	/utils\.getTopWindowLocation\(\)/gm,
	/utils\.getTopFrameReferrer\(\)/gm,
	/utils\.getAncestorOrigins\(\)/gm,
	/utils\.getTopWindowUrl\(\)/gm,
	/utils\.getTopWindowReferrer\(\)/gm
];

// TO DO: Add Email of the Adapter maintainer to the CSV file.
function csvMaker(header, row) {
	const headerRow = header.join();
	const rows = row.join();
	const data = headerRow + rows;
	fs.writeFile('report.csv', data, (err) => {
		if (err) {
			console.log(err);
			return;
		}
		console.log('csv written successfully!');
	});
}

export function cli(args) {
    try {
				const options = parseArgumentsIntoOptions(args);
				console.log(options['--dir']);
				
				glob(options['--dir'], null, function(err, files) {
					if (err) {
						console.error(err.message);
						return;
					}
					let count = 1;
					let rows = [];
					files.forEach(file => {
						const violations = patternMatch(file, VIOLATION_REGEX);
						if (violations.length > 0) {
							// TO DO: Find a better delimiter, current I've chosen ' ' because CSV is not getting constructed
							// properly if I chose ",", but comma is a much better option. Easy to view.
							rows.push(`\n${count}, ${file}, ${violations.join(' ')}`)
							count = count + 1;
						} else {
							// Did not find any matching patterns in this file.
							// If you want to do anything with those files, you can do here.
						}
					});
					csvMaker(['S.No', 'BidAdapter Name', 'Violations', 'Email'], rows);
				});
    } catch(err) {
        console.log("ERR: ", err.message);
    }
}