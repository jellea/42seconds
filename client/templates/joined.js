/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/6/12
 * @version 0.1
 *
 * This file is here to put the event handlers, helpers and methods in
 * which belong to the joined template.
 *
 * This templates serves as the waiting page where you wait for the other player to join in.
 */

/**
 * Wait until everyone joined the game and is ready to begin.
 */
Template.joined.ready = function () {
    var game = Games.findOne({'gamecode' : Session.get('gamecode')});
    if (game) {
        if (game.teams.length >= 2) {
            Spark.finalize($("body")[0]);
            $("body").html(Meteor.render(Template.gameOpponent));
        }
    }
}