Meteor.methods({
    throwDice: function () {
        Dice.insert({'throw' : Math.floor(Math.random() * 3)});
    }
})