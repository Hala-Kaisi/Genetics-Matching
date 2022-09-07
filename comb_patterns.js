"use strict";

const testlib = require( './testlib.js' );
let buffer = [];
let sequenceNumber = 0;
let Sequences = {};
let largerLength = 2;           //the longest pattern length
let sequencesKeys;
let combinations = {
    R : ["G", "A"], B : ["G", "T", "C"],
    Y : ["T", "C"], B : ["G", "T", "C"],
    K : ["G", "T"], B : ["G", "T", "C"],
    M : ["A", "C"], B : ["G", "T", "C"],
    S : ["G", "C"], N : ["A", "C", "G", "T"],
    W : ["A", "T"]
}

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
        testlib.frequencyTable(Sequences);
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
        firstSequences(element, index, array)
    });
}

function firstSequences(element, index, array){
    let group = "element";
    if(array[index+1]){
        group = element.concat(array[index+1])
        checkCombination(group, index)
        findNextSequences(2, group, index, array);
    }
}

function findNextSequences(patternLength, group, index, array){
    if(patternLength+1 <= largerLength){
        if(array[index+patternLength]){
            group = group.concat(array[index+patternLength])
            checkCombination(group, index)
        }
        patternLength++;
        findNextSequences(patternLength, group, index, array)
    }
}

function checkCombination(group, index){
    let groupLimit = 0;                 //keep track of which letter are we checking
    let letterCombination;              //holds the combination associated with the current letter
    let groupCopy = group;              //used to alter the group string
    let groupCombination = [];               //array to list all possible combinations
    groupCombination.push(group);       //to add a base combination
    createCombinations();
    function createCombinations(){
        if(groupLimit < group.length){
            if(combinations[group.charAt(groupLimit)] && groupCombination.length == 1){
                letterCombination = combinations[group.charAt(groupLimit)];
                    if(letterCombination){
                    letterCombination.forEach(letter => {
                        groupCopy = groupCopy.substring(0, groupLimit) + letter + groupCopy.substring(groupLimit+1);
                        if(!groupCombination.includes(groupCopy)){
                            groupCombination.push(groupCopy);
                        }
                        groupCopy = group;
                    })
                }
            }
            if (combinations[group.charAt(groupLimit)] && groupCombination.length > 1){
                letterCombination = combinations[group.charAt(groupLimit)];
                if(letterCombination){
                    letterCombination.forEach(letter => {
                        groupCombination.forEach(combLetter => {
                            groupCopy = combLetter;
                            groupCopy = groupCopy.substring(0, groupLimit) + letter + groupCopy.substring(groupLimit+1);
                            if(!groupCombination.includes(groupCopy)){
                                groupCombination.push(groupCopy);
                            }
                        })
                    })
                }
            }
            groupCopy = group;
            groupLimit++;
            createCombinations();
        }
    }
    groupCombination.forEach(combination => {
        if(Sequences[combination] >= 0){
            Sequences[combination]++;
            testlib.foundMatch(combination, index)
        }
    })
}

function resetSequences(){
	sequencesKeys.forEach(key => Sequences[key] = 0);
}

testlib.setup( 3 ); // Runs test 1 (task1.data and task1.seq)