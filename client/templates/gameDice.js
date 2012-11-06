/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/6/12
 * @version 0.1
 */

/**
 * This file is here to put the event handlers, helpers and methods in
 * which belong to the gameDice template.
 *
 * This template serves as the page where the user throws the dice to see what his handicap is.
 */

/**
 * This function sets the handicap of the player
 * @param {Number} handicap  The handicap (int of 0-2)
 */
var set_handicap = function(handicap) {
    if (!Session.get('gamecode')) {
        console.log("gamecode not set");
        return;
    }
    if (Dice.findOne({'access_code':Session.get('gamecode')})) {

        Dice.update({'access_code':Session.get('gamecode')}, {$set:{'throw':handicap}});
        Games.update({'gamecode' : Session.get('gamecode')}, {'$set':{'handicap':handicap}});
    } else {
        Dice.insert({'access_code':Session.get('gamecode'), 'throw':handicap});
        Games.update({'gamecode' : Session.get('gamecode')}, {'$set':{'handicap':handicap}});
    }
    Meteor.setTimeout(function() {
        $("body").html(Meteor.render(Template.gameActiveTeam));
        Meteor.call('startClock', Session.get('gamecode'), function () {
            console.log("Game started!");
        });
    }, 1500);}

Template.gameDice.events({
    'click input#dice':function () {
        $('input#dice').attr('disabled', 'disabled');
        var number_of_dices = $('#dices').children().length;
        var max_animations = 50;
        var lastindex = max_animations;
        var handicap = 0;
        for(var i = 0; i < max_animations; i++) {
            Meteor.setTimeout(function() {
                handicap = (handicap + Math.floor(Math.random() * (number_of_dices - 1)) + 1) % number_of_dices;
                $('#dices div:visible').hide();
                $($('#dices').children().get(handicap)).show();
                lastindex--;
                if(lastindex == 0) {
                    set_handicap(handicap);
                }
            }, i * 50);
        }
    }
});

/**
 * Gets the result of the dice throw.
 * @return {Object} The dice roll object
 */
Template.gameDice.diceThrow = function () {
    return Dice.findOne({'access_code':Session.get('gamecode')});
};

/**
 * Gets the number of this round.
 * @return {Number} The number of the round
 */
Template.gameDice.roundnumber = function () {
    var game = Games.findOne({'gamecode' : Session.get('gamecode')});
    if(game) {
        return game.round;
    }
}