/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/6/12
 * @version 0.1
 */

/**
 * This file is here to put the event handlers, helpers and methods in
 * which belong to the advancedSettings template.
 *
 * This templated serves as a place for players to set the advanced settings such as difficulty, rounds and
 * other stuff for a new game.
 */

/**
 * Events for the advancedSettings template
 */
Template.advancedSettings.events({
    /**
     * Event: Click on the 'start game' button
     */
    'click input#startgame':function () {
        var rounds = $('input[name="rounds"]:checked').val();
        var category = $('input[name="category"]:checked').val();
        var difficulty = $('input[name="difficulty"]:checked').val();

        // Start a new game
        Meteor.call('start_new_game', Session.get('team_id'), rounds, category, difficulty, function (error, game) {
            Template.showCode.rounds = rounds;
            Template.showCode.category = category;
            Template.showCode.difficulty = difficulty;
            Template.showCode.gamecode = game.gamecode;
            Template.showCode.team = game.teams.length;
            Session.set('teamNumber',game.teams.length);
            Spark.finalize($("body")[0]);
            var fragment = Meteor.render(Template.showCode);
            $("body").html(fragment);
        });
    }
});