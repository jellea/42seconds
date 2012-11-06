/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/6/12
 * @version 0.1
 */

/**
 * This file is here to put the event handlers, helpers and methods in
 * which belong to the gameScoreCheckWait template.
 *
 * This template serves as the page where the user waits in order for the other teams to check their score.
 */

/**
 * Ready event for checking if the score is confirmed.
 * If the score is confirmed it will redirect the user, else it will show the waiting screen.
 */
Template.gameScoreCheckWait.ready = function () {
    var game = Games.findOne({'gamecode' : Session.get('gamecode')});
    if (game) {
        if (game.scoreConfirmed) {
            $("body").html(Meteor.render(Template.gameResults));
        }
    }
};