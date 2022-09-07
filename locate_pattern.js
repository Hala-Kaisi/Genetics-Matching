"use strict";

const testlib = require( './testlib.js' );
let buffer = [];
let sequenceNumber = 0;
let Sequences = {};
let largerLength = 2;           //the longest pattern length
let sequencesKeys;

testlib.on( 'ready', function( patterns ) {
	console.log("Patterns searched for are: " + patterns)
	patterns.forEach(key => {Sequences[key] = 0})
    sequencesKeys = Object.keys(Sequences);     //the keys of the pattern
	testlib.runTests();
} );

testlib.on( 'data', function( data ) {
	buffer.push(data);
} );

testlib.on( 'reset', function() {
	if(sequenceNumber > 0){
		console.log("\nSequence number " + sequenceNumber + ": \n");
		findPatternLength();          //find length of the longest pattern in "patterns" of the file.
        checkMatchingSequence();                //search for sequences
		buffer = [];
        resetSequences();
	}
	sequenceNumber++;
});

testlib.on( 'end', function() {
		console.log("\nSequencing has finished.")
	}
);

function findPatternLength(patternIndex){
	sequencesKeys.forEach(pattern => {
		if(pattern.length > largerLength){
			largerLength = pattern.length;
		}
	})
}


function checkMatchingSequence(){
    buffer.map((element, index, array) => {
        let group = "elemnt";
        if(array[index+1]){
            group = element.concat(array[index+1])
            if(Sequences[group] >= 0){
                testlib.foundMatch(group, index)
            }
            findNextSequences(2, group, index, array);
        }
    });
}

function findNextSequences(patternLength, group, index, array){
    if(patternLength+1 <= largerLength){
        if(array[index+patternLength]){
            group = group.concat(array[index+patternLength])
            if(Sequences[group] >= 0){
                testlib.foundMatch(group, index)
            }
        }
        patternLength++;
        findNextSequences(patternLength, group, index, array)
    }
}


function resetSequences(){
	sequencesKeys.forEach(key => Sequences[key] = 0);
}

testlib.setup( 2 ); // Runs test 1 (task1.data and task1.seq)