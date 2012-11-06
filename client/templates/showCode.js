/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/6/12
 * @version 0.1
 */

/**
 * This file is here to put the event handlers, helpers and methods in
 * which belong to the showCode template.
 *
 * This template serves as the page where the user sees his code which he then has to
 * give to the other team.
 */

/**
 * Method for waiting to get ready to start the game.
 */
Template.showCode.ready = function () {
    var game = Games.findOne({'gamecode':Session.get('gamecode')});
    if (game) {
        if (game.teams.length >= 2) {
            Spark.finalize($("body")[0]);
            $("body").html(Meteor.render(Template.gameDice));
        }
    }
}

/**
 * Events for the showCode template
 */
Template.showCode.events({
    /**
     * Event: Click on the 'back' button.z
     */
    'click img.backbutton' : function () {
        Spark.finalize($("body")[0]);
        var fragment = Meteor.render(Template.lobby);
        $("body").html(fragment);
    }
});