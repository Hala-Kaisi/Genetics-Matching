"use strict";

const fs = require( 'fs' );
let interval = 25;
let input_buffer = [];
let hooks = {
	ready: noop,
	data: noop,
	reset: noop,
	end: noop
};

function noop(){
};

module.exports.on = function( hook, handler ) {
	hooks[hook] = handler;
};

module.exports.frequencyTable = function( table ) {
	for( const key in table ) {
		console.log( key, table[key] );
	}
};

module.exports.foundMatch = function( pattern, offset ) {
	console.log( "[MATCH]", pattern, "found at", offset );
};

module.exports.runTests = function() {
	sendByte();
};

module.exports.setup = function( testNumber, ioDelay = 25 ) {
	interval = ioDelay;
	let dataFile = fs.createReadStream( `task${testNumber}.data`, { encoding: 'utf8', fd: null } );
	dataFile.on('readable', function() {
		let chunk;
		while (null !== (chunk = dataFile.read(1))) {
			input_buffer.push( chunk[0] );
		}
	});
	dataFile.on( 'end', function() {
		fs.readFile( `task${testNumber}.seq`, function( err, data ) {
			hooks['reset']();
			hooks['ready']( data.toString().split('\n') );
		} );
	} );
}

let index = 0;
function sendByte() {
	if( input_buffer[index].charAt(0) === '\n' )
		hooks['reset']();
	else
		hooks['data']( input_buffer[index].charAt(0) );
	index++;

	if( index >= input_buffer.length ) {
		hooks['end']();
	}
	else
		setTimeout( sendByte, interval );
}
