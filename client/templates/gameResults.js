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

Template.gameResults.ready = function () {
    var game = Games.findOne({'gamecode' : Session.get('gamecode')});
    if(game.nextRound) {
        console.log("New round started!");
        // Render the game opponent template
        if(game.team._id === Session.get('team_id')) {
            Games.update({'gamecode': Session.get('gamecode')}, {'$set':{'nextRound':false}});
            render("gameDice", "body");
        } else {
            Games.update({'gamecode': Session.get('gamecode')}, {'$set':{'nextRound':false}});
            render("gameOpponent", "body");
        }
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
        var game = Games.findOne({'gamecode': Session.get('gamecode')});
        // Check if we're not in conflicted state
        if(game.nextRound) {
            return;
        }

        if(game.round === game.rounds) {
            // The game is over.
            var game = Games.findOne({'gamecode':Session.get('gamecode')});
            var teamOne = game.teams[0];
            var teamTwo = game.teams[1];
            var winner;
            if(teamOne.score > teamTwo.score) {
                winner = teamOne;
            }
            if(teamOne.score === teamTwo.score) {
                winner = 'tie';
            }
            if(teamTwo.score > teamOne.score) {
                winner = teamTwo;
            }
            Games.update({'gamecode': Session.get('gamecode')}, {'$set':{'winner':winner}});
            render("scoreboard", "body");
            return;
        }

        console.log("Starting new round");
        if(game.team._id === Session.get('team_id')) {
            Meteor.call('newRound', Session.get('gamecode'), function () {
                render("gameOpponent", "body");
            });
        } else {
            Meteor.call('newRound', Session.get('gamecode'), function () {
                render("gameDice", "body");
            });
        }
    }
});