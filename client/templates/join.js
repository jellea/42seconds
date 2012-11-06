/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/6/12
 * @version 0.1
 *
 * This file is here to put the event handlers, helpers and methods in
 * which belong to the join template.
 *
 * This templates serves as the page where you can see the code which your friend can join.
 */

/**
 * Events for the join template
 */
Template.join.events({
    /**
     * Event: Click on 'Go!' button
     * Joins the game.
     */
    'click input#joingame':function () {
        var gamecode = $("#gamecode").val();
        Session.set('gamecode',gamecode);
        Meteor.call('joinedGame', gamecode, Session.get('team_id'), function (error, game) {
            if (error) {
                console.log(error);
                return;
            }
            Template.joined.team = game.teams.length;
            render("joined", "body");
        });
    },
    /**
     * Event: Click on the 'back' button.
     */
    'click img.backbutton':function () {
        render("lobby", "body");
    }
});