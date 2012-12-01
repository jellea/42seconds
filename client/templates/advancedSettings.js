/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/6/12
 * @version 0.1
 *
 * This file is here to put the event handlers, helpers and methods in
 * which belong to the advancedSettings template.
 *
 * This templated serves as a place for players to set the advanced settings such as difficulty, rounds and
 * other stuff for a new game.
 */

/**
 * Events for the advancedSettings template
 */

Template.advancedSettings.categories = function () {
	var categories = new Array('All','Nerdy','Films','Acteurs','Sporten','Landen','Televisie','Steden');
	return categories;
};

Template.advancedSettings.difficulties = function () {
	var difficulties = new Array({'name': 'Super easy'},{'name':'Easy'},{'name':'Medium','selected':true},{'name':'Hard'},{'name':'Power extreme'});
	return difficulties;
}

Template.advancedSettings.events({
    /**
     * Event: Click on the 'start game' button
     */
    'click input#startgame':function () {
        var rounds = $('select[name="rounds"]').val()*1;
        var category = $('select[name="category"]').val();
        var difficulty = $('select[name="difficulty"]').val();

        // Start a new game
        Meteor.call('startNewGame', Session.get('team_id'), rounds, category, difficulty, function (error, game) {
            Template.showCode.rounds = rounds;
            Template.showCode.category = category;
            Template.showCode.difficulty = difficulty;
            Template.showCode.gamecode = game.gamecode;
            Template.showCode.team = game.teams.length;
            Session.set('teamNumber',game.teams.length);
            Session.set('gamecode',game.gamecode);
            render("showCode", "body");
        });
    },
    
	'click img.backbutton' : function () {
        render("newGame", "body");
    }
});