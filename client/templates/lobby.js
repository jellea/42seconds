/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/6/12
 * @version 0.1
 *
 * This file is here to put the event handlers, helpers and methods in
 * which belong to the lobby template.
 *
 * This template serves as the 'homepage' of the application. People can decide to start or join a new game and
 * check out the rules if they don't know them yet.
 */

/**
 * The events in the lobby.
 */
Template.lobby.events({

    /**
     * Event: Click on 'new game'
     */
    'click input#newgame':function () {
        Meteor.call('newGame', function (error, result) {
            Spark.finalize($("body")[0]);
            $("body").html(Meteor.render(Template.newGame));
        });
    },

    /**
     * Event: Click on 'join game'
     */
    'click input#joingame':function () {
        Spark.finalize($("body")[0]);
        $("body").html(Meteor.render(Template.join));
    },

    /**
     * Event: Click on the link to the rules
     */
    'click #ruleslink':function () {
        Spark.finalize($("body")[0]);
        $("body").html(Meteor.render(Template.rules));
        return false;
    }
});