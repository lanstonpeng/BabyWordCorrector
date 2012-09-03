var tempDict = "Hello, world.  Imagine you were granted the magic power to change any website in the whole world-wide web the way you like it, to make it better, more functional, more useful, better looking, more pleasing or disrupting to the eye.  Which one would you pick?  We've also played that game. And we've chosen Wikipedia. We are New!, a creative agency, hunting for new ideas regardless of their form.  Wikipedia is one of our favorite sources of accumulated knowledge, hats off to Jimmy Wales.  But from the user's and designer's point of view it still has room to improve.  That's why we decided to spend two spring months on this project, looking for the ways how to make it better, reader or editor friendlier, clearer and aesthetically satisfying.  The project is called Wikipedia Redefined and we hope you will find this interesting.Use the scroll bar to navigate further or to go back.";


//to-do
//fetch the dict in Worker
//generate the CModel In Worker ?

var Speller = function(){
    
    var CModel = {},
        alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
    
    function uniq(arr){
        return arr.filter(function(item,idx){
            return idx === arr.indexOf(item);
        });
    }
    function fetchDictWithWoker(){
        var worker = new Worker("worker.js");
        worker.postMessage({cmd:"fetchDict"});
        worker.onmessage = function(data){
        
        }
    }
    function fetchDict( callback ){
        var xhr = new XMLHttpRequest();
        xhr.open("GET","big.txt");
        xhr.onload = function(data){
            generateDict(xhr.response);
            callback && callback();
        }
        xhr.send();
    }

    function generateDict(text){
        
        var re = /[a-z]+/g,
            text = text || tempDict,
            text = text.toLowerCase(),
            word;

        while(word = re.exec(text)){
            CModel[word] = CModel[word] ? CModel[word]+1 : 1;
            }
        console.log("finish generating");
    }

    function generateEdit1(word){
        var i=0,
            len = word.length,
            results = [];
        //delete    
        for(;i<len;i++){
            results.push(word.slice(0, i) + word.slice(i+1));
        }
        //transpose
        for(i=0;i<len-1;i++){
            results.push(word.slice(0, i) + word.slice(i+1, i+2) + word.slice(i, i+1) + word.slice(i+2));
        }
        //replace
        for(i=0;i<len;i++){
            alphabet.forEach(function(letter){
                results.push(word.slice(0,i) + letter + word.slice(i+1));
            }); 
        }
        //insert
        for(i=0;i<len+1;i++){
            alphabet.forEach(function(letter){
                results.push(word.slice(0,i) + letter + word.slice(i) );
            });     
        }
        return uniq(results);
    }

    function generateEdit2(word){
        var results = generateEdit1(word),
            Arr = [],
            tempArr;
        results.forEach(function(letter,idx){
            tempArr = getKnownWords( generateEdit1(letter) );
            tempArr && Arr.concat(tempArr);
        });
        return Arr;
    }

    function getKnownWords(wordArr){
        return wordArr.filter(function(word,idx){
                return !!CModel[word];  
            });
    }
    
    function correct(word){
        var results = [],
            max = 0,
            maxIdx = -1;

        function _HighestRanking(wordArr){
            wordArr.forEach(function(word,idx){
                if( CModel[word] > max){
                    max = CModel[word];
                    maxIdx = idx
                }
            });
            return wordArr[maxIdx];
        }
        
        if(CModel[word]){
            return word;    
        }

        else if( (results = getKnownWords( generateEdit1(word))) && (results.length > 0) ){
            return _HighestRanking(results);
        }
        else if( (results = generateEdit2(word)) && (results.length > 0) ){
            return _HighestRanking(results); 
        }
        else{
           return word;
        }
    }
    
    return {
        //generateDict:generateDict,
        //generateEdit1 : generateEdit1,
        //getKnownWords  : getKnownWords,
        correct : correct,
        fetchDict : fetchDict,
        CModel : CModel
    }
}();

/*
 
    P(c|w) ~= P(w|c)P(c)

 */

//procedure
//train a dictionary as a language model ---> P(c) correct model
//  read a Language Dictionary
//  generatae a word-counting mapping
//
//P(w|c):
//generate the wrong words according to the correct words model
//note that:
//  wrong word distance
//
