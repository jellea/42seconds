/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/6/12
 * @version 0.1
 *
 * Here you will find the helper functions which are
 * supposed to help the developer to create standard logic
 * which is not related to the network topology.
 */

/**
 * This function will recursively create a 3 digit gamecode.
 * @todo            Make this function delete already existing but idle games and take their codes.
 * @return {Number} The gamecode.
 */
function createGamecode() {
    var gamecode = '';
    var random;
    for (i = 0; i < 3; i++) {
        if (i == 0) {
            // don't allow 0 as first digit
            random = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
        } else {
            random = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
        }
        gamecode += '' + random;
    }
    var found = Games.findOne({'gamecode':gamecode});
    if (found) {
        return createGamecode();
    }
    return gamecode;
}

/**
 * This function will load the answers into a specific game.
 * @param gamecode  The game to load the answers in.
 */
function loadAnswers(gamecode) {
	console.log('loadAnswers yay');
    var answers = new Array();
    var checkDuplicates = new Array();
    var fs = __meteor_bootstrap__.require('fs');
    var category = 'Sporten';
    var data = fs.readFileSync('scraper/fortytwoseconds/items.json');
    var data = JSON.parse(data); // because eval is evil !11!!
    console.log(data);
    //data = data.toString().split("\n");

    for(var i=0; i<defaultNumberOfAnswers; i++) {
        random = Math.floor(Math.random() * (data.length - 0 + 1)) + 0;
        var word = data[random];
        if(checkDuplicates.indexOf(word)==-1) {
            checkDuplicates.push(word);
            answers.push({"answer":word});
        } else {
            i=i-1;
        }
    }
    Games.update({'gamecode':gamecode}, {$set:{'answers':answers}});
}