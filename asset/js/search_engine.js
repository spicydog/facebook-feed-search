
var globalDictionary;
var globalDocuments;
var currentWordIndex = 0;


function initSearchEngine() {
    globalDictionary = new Array();
    globalDocuments = new Array();
    currentWordIndex = 0;
    buildThaiDictionary();

    //var str = 'Hello Chaingmai :) ทำไมพังวะ';
    //console.log(tokenize(str).join('|'));
}

function addDataToBarrel(data) {

    data = tokenize(data).join(' ');
    var result = indexData(data,globalDictionary);
}


function normalizeString(string) {
    console.log("1: "+ string);
    string = convertLowerCase(string);
    console.log("2: "+ string);
    string = filterSymbols(string);
    console.log("3: "+ string);
    return string;
}

function convertLowerCase(string) {
    return string.toLowerCase();
}

function indexData(data, dictionary) {

    var words = data.split(" ");

    var nextIndex = currentWordIndex;

    for(var i in words) {
        var word = words[i];
        if(word && word.length>0) {
            var index = 0;
            if(dictionary[word]) {
                index = dictionary[word].length;
            } else {
                dictionary[word] = new Array();
            }
            dictionary[word][index] = nextIndex;
            nextIndex++;
        }
    }


    var fromIndex = currentWordIndex;
    var toIndex = nextIndex - 1;
    currentWordIndex = nextIndex;

    return {from:fromIndex,to:toIndex};
}

function getSortedIndices(array) {
    var indices = new Array();
    for(var key in array) {
        indices.push(key);
    }

    for(var i=0; i<array.length; i++) {
        for(var j=i+1; j<array.length; j++) {
            if( array[indices[i]] > array[indices[j]] ) {
                var swap = indices[i];
                indices[i] = indices[j];
                indices[j] = swap;
            }
        }
    }
    return indices;
}




function printDictionary(dictionary,n) {
    var result = "";
    for(word in dictionary) {
        if(n--<=0)
            break;

        var positions = dictionary[word];
        result += word + " ("+ positions.length +")" + ": ";
        for(i in positions) {
            var position = positions[i];
            result += position + ", ";
        }
        result = result.substr(0, result.length - 2);
        result += "\n";
    }
    return result;
}