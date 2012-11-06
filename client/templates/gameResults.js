/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/6/12
 * @version 0.1
 *
 * This file is here to put the event handlers, helpers and methods in
 * which belong to the gameResults template.
 *
 * This template serves as the page where the user will see their score after playing one round.
 * Here they are also able to continue to the new round and see who's turn it is.
 */

/**
 * Get the teams playing in this game.
 * @return {Array}  The teams.
 */
Template.gameResults.teams = function () {
    return Teams.find({'gamecode':Session.get('gamecode')},{fields:{_id:true, name:true, score:true}}).fetch();
};

/**
 * Gets the answers belonging to this round.
 * @return {Array}  The answers
 */
Template.gameResults.answers = function () {
    var game = Games.findOne({'gamecode' : Session.get('gamecode')});
    if(game) {
        return game.answers;
    }
};

/**
 * Events for the gameResults template
 */
Template.gameResults.events({
    /**
     * Event: Click on the 'Done!' button.
     * This will start a new round.
     */
    'click .scoreok': function () {
        console.log("Starting new round");
        var game = Games.findOne({'gamecode': Session.get('gamecode')});
        if(game.team._id === Session.get('team_id')) {
            render("gameDice", "body");
        } else {
            render("gameOpponent", "body");
        }
    }
});