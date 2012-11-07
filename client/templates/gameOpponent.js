/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/6/12
 * @version 0.1
 *
 * This file is here to put the event handlers, helpers and methods in
 * which belong to the gameOpponent template.
 *
 * This template is used for the gameOpponent to see and hold track of the number of answers the other team
 * has guessed. It will only see the answers that the other party has guessed and checked off.
 */

/**
 * Get the answers that are checked off (considered correct by the other team).
 * @return {Array}  The checked off answers
 */
Template.gameOpponent.checkedOff = function() {
    var game = Games.findOne({'gamecode' : Session.get('gamecode')});
    var answers = new Array();
    if(!game.answers || !game || !game.answers.length) {
        return 0;
    }
    for(var i=0; i<game.answers.length; i++) {
        if(game.answers[i].checkedOff) {
            answers.push(game.answers[i]);
        }
    }
    return answers;
}

/**
 * Gets the number of the current round.
 * @return {Number} The current round
 */
Template.gameOpponent.roundnumber = function () {
    var game = Games.findOne({'gamecode' : Session.get('gamecode')});
    if(game) {
        return game.round;
    }
}

/**
 * Gets the handicap of the current round
 * @return {Number} The handicap.
 */
Template.gameOpponent.handicap = function () {
    var game = Games.findOne({'gamecode' : Session.get('gamecode')});
    if(game) {
        return game.handicap;
    }
}

/**
 * Checks if the game is over (clock === 0), and redirects user if that's the case.
 */
Template.gameOpponent.ready = function () {
    var game = Games.findOne({'gamecode' : Session.get('gamecode')});
    if(game) {
    	if(game.handicap && $('p.waiting_dice')) {
    		if($('p.waiting_dice').remove()) {
    			// 
    		}
    	}
        if(game.clock === 0) {
            render("gameScoreCheck", "body");
        }
        if(game.handicap != null && $('div.countdown.run').length==0) {
            // run the CSS timer animation
            $('.pointer').addClass('run');
            $('div.countdown').addClass('run');
        }
    }
}

/**
 * Get the score of the current game.
 * @return {Number} The score.
 */
Template.gameOpponent.score = function () {
    var team = Teams.findOne(Session.get('team_id'));
    if(team) {
        return team.score;
    }
}