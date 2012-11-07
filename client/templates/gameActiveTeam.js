/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/6/12
 * @version 0.1
 *
 * This file is here to put the event handlers, helpers and methods in
 * which belong to the gameActiveTeam template.
 *
 * This template serves as the main game template. Here the user wil see a number of answers which
 * he then has to explain to his other counterpart, all until the 42 seconds run out.
 */

/**
 * Gets the number of the round.
 * @return {Number} The round number.
 */
Template.gameActiveTeam.roundnumber = function () {
    var game = Games.findOne({'gamecode' : Session.get('gamecode')});
    if(game) {
        return game.round;
    }
}

/**
 * Gets the answers which the user has to guess.
 * @return {Array}  The array with answers.
 */
Template.gameActiveTeam.answers = function () {
    var game = Games.findOne({'gamecode' : Session.get('gamecode')});
    if(game) {
        return game.answers;
    }
}

/**
 * Get the handicap of the current round.
 * @return {Number} The handicap.
 */
Template.gameActiveTeam.handicap = function () {
    var game = Games.findOne({'gamecode' : Session.get('gamecode')});
    if(game) {
        return game.handicap;
    }
}

/**
 * An event handler on the event when the clock has reached 0.
 * When the time has run out the user will be redirected to the gameScoreCheckWait template.
 */
Template.gameActiveTeam.ready = function () {
    var game = Games.findOne({'gamecode' : Session.get('gamecode')});
    if(game) {
    	if(game.handicap != null && $('p.waiting_dice')) {
    		$('p.waiting_dice').remove();
    	}


	    var answers = new Array();
	    if(!game.answers || !game || !game.answers.length) {
	        return 0;
	    }
	    for(var i=0; i<game.answers.length; i++) {
	        if(game.answers[i].checkedOff) {
	            answers.push(game.answers[i]);
	        }
	    }
    	
        if(game.clock === 0 || answers.length === game.answers.length) {
            render("gameScoreCheckWait", "body");
        }
    }
}

/**
 * Gets the score of the current game.
 * @return {Number} The score.
 */
Template.gameActiveTeam.score = function () {
    var team = Teams.findOne(Session.get('team_id'));
    if(team) {
        return team.score;
    }
}

/**
 * Event handlers for the gameActiveTeam template.
 */
Template.gameActiveTeam.events({
    /**
     * Event: Click on the answer to check or uncheck it.
     */
    'click input': function () {
        $("input[id='" + this.answer + "']").parent().css('text-decoration','line-through');
        var game = Games.findOne({'gamecode' : Session.get('gamecode')});
        var answers = game.answers;
        for(i=0;i<answers.length;i++) {
            if(answers[i].answer === this.answer && answers[i].checkedOff) {
                answers[i].checkedOff = false;
                continue;
            }
            if(answers[i].answer == this.answer) {
                answers[i].checkedOff = true;
                continue;
            }
            if(!answers[i].answer == this.answer && !answers[i].checkedOff) {
                answers[i].checkedOff = false;
                continue;
            }
        }
        Games.update({'gamecode':Session.get('gamecode')},{$set:{'answers':answers}});
    }
});