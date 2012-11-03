Template.game.events({
    'click input.dice': function () {
        if(Dice.findOne({'access_code' : Session.get('gameid')})) {
            Dice.update({'access_code' : Session.get('gameid')}, {$set: {'throw': Math.floor(Math.random() * 3)}});
        } else {
            Dice.insert({'access_code' : Session.get('gameid')});
        }
    }
});

Template.game.diceThrow = function () {
    return Dice.findOne({'access_code' : Session.get('gameid')});
}

Session.set('gameid', 100);