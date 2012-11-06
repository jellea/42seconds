/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/6/12
 * @version 0.1
 */

/**
 * This file is here to put the event handlers, helpers and methods in
 * which belong to the gameScoreCheck template.
 *
 * This template serves as a page for the other team to add answers that weren't checked off
 * or were guessed wrong in the 42 seconds that the user could play. This screen is presented to the non-playing
 * team, the other team has to wait for them to confirm the score.
 */

/**
 * The answers which were asked in the game.
 * @return {Array}  The answers
 */
Template.gameScoreCheck.answers = function () {
    var game = Games.findOne({'gamecode':Session.get('gamecode')});
    if (game) {
        return game.answers;
    }
};

/**
 * Events for the gameScoreCheck template
 */
Template.gameScoreCheck.events({
    /**
     * Event: Click on the 'done!' button
     * Confirms the answers.
     */
    'click input.nextround': function () {
        console.log("Scores confirmed");
        var game = Games.findOne({'gamecode' : Session.get('gamecode')});
        var answers = new Array();
        for(var i=0; i<game.answers.length; i++) {
            if(game.answers[i].checkedOff) {
                answers.push(game.answers[i]);
            }
        }
        var handicap = Dice.findOne({ 'access_code': Session.get('gamecode')}).throw;
        var score = (answers.length - handicap) < 0 ? 0 : answers.length - handicap;
        Teams.update(Session.get('team_id'), {'$set': {'score' : score}});
        Games.update({'gamecode': Session.get('gamecode')}, {'$set': {'scoreConfirmed' : true}});
        Spark.finalize($("body")[0]);
        $("body").html(Meteor.render(Template.gameResults));
    },
    /**
     * Event: Click on the checkbox before an answer
     * Checks or unchecks the answer.
     */
    'click input.checkbox': function () {
        console.log("Input ok click");
        var game = Games.findOne({'gamecode' : Session.get('gamecode')});
        var answers = game.answers;
        for(i=0;i<answers.length;i++) {
            if(answers[i].answer === this.answer && answers[i].checkedOff) {
                answers[i].checkedOff = false;
                continue;
            }
            if(answers[i].answer == this.answer) {
                answers[i].checkedOff = true;
                continue;
            }
            if(!answers[i].answer == this.answer && !answers[i].checkedOff) {
                answers[i].checkedOff = false;
                continue;
            }
        }
        // Update the game with the new set of answers.
        Games.update({'gamecode':Session.get('gamecode')},{$set:{'answers':answers}});
    }
});