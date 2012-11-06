/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/6/12
 * @version 0.1
 *
 * This file is here to put the event handlers, helpers and methods in
 * which belong to the scoreboard template.
 *
 * This template serves as a last resort where users will land after they've finished the game.
 * On this page the user can see what the scores are and other such statistics we've gathered.
 */

/**
 * Gets the teams of the current game in which the scores is a variable.
 * @return {Array}  An array of the Teams objects currently in the game.
 */
Template.scoreboard.scores = function() {
    var teams = Teams.find({'gamecode':Session.get('gamecode')},{fields:{_id:true, name:true, score:true}}).fetch();
    return scores;
}

/**
 * Gets the winner of the game
 * @return {String} The name of the winner.
 */
Template.scoreboard.winner = function () {
    var game = Games.findOne({'gamecode' : Session.get('gamecode')});
    if(game) {
        return game.winner;
    }
}