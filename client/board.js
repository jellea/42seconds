Template.gameDice.events({
    'click input#dice':function () {
        if (!Session.get('gamecode')) {
            console.log("gamecode not set");
            return;
        }
        if (Dice.findOne({'access_code':Session.get('gamecode')})) {
            Dice.update({'access_code':Session.get('gamecode')}, {$set:{'throw':Math.floor(Math.random() * 3)}});
        } else {
            Dice.insert({'access_code':Session.get('gamecode'), 'throw':Math.floor(Math.random() * 3)});
        }
    }
});

Template.gameDice.diceThrow = function () {
    return Dice.findOne({'access_code':Session.get('gamecode')});
}

var team = function () {
    return Teams.findOne(Session.get('team_id'));
}

//Session.set('currentanswers', answers.find({},{limit:5}).fetch());


Template.gameActiveteam.answers = function() {
    return Session.get('currentanswers')
}

var player = function () {
    return Players.findOne(Session.get('player_id'));
};

var game = function () {
    var me = team();
    return me && me.gamecode && Games.findOne(me.gamecode);
};

Template.lobby.events({
    'click input#newgame':function () {
        Meteor.call('newgame', function (error, result) {
            $("body").html(Meteor.render(Template.newgame));
        });
    },
    'click input#joingame':function () {
        $("body").html(Meteor.render(Template.join));
    }
});

Template.newgame.events({
    'click input#startgame':function () {
        Meteor.call('start_new_game', function (error, game) {
            Template.showcode.team = game.teams.length;
            Session.set('gamecode', game.gamecode);
            Template.showcode.gamecode = game.gamecode;
            var fragment = Meteor.render(Template.showcode);
            $("body").html(fragment);
        });
    },
    'click input#advancedsettings':function () {
        Meteor.call('advancedsettings', function (error, gamecode) {
            $("body").html(Meteor.render(Template.advancedsettings));
        });
    }
});

Template.advancedsettings.events({
    'click input#startgame':function () {
        var rounds = $('input[name="rounds"]').val();
        var category = $('input[name="category"]').val();
        var difficulty = $('input[name="difficulty"]').val();

        Meteor.call('start_new_game', rounds, category, difficulty, function (error, game) {
            Template.showcode.rounds = rounds;
            Template.showcode.rounds = category;
            Template.showcode.rounds = difficulty;
            Template.showcode.gamecode = game.gamecode;
            var game = Games.findOne({'gamecode':game.gamecode});
            Template.showcode.team = game.teams.length;
            var fragment = Meteor.render(Template.showcode);
            $("body").html(fragment);
        });
    }
});

Template.join.events({
    'click input#joingame':function () {
        var gamecode = $("#gamecode").val();
        console.log(gamecode);
        Meteor.call('joined_game', gamecode, function (error, game) {
            if (error) {
                console.log(error);
                return;
            }
	        Session.set('gamecode',gamecode);
            Template.joined.team = game.teams.length;
            $("body").html(Meteor.render(Template.joined));
        });
    }
});

Template.joined.ready = function () {
    var game = Games.findOne({'gamecode' : Session.get('gamecode')});
    if (game) {
        if (game.teams.length >= 2) {
            $("body").html(Meteor.render(Template.gameOpponent));
        }
    }
}

Template.showcode.ready = function () {
    var game = Games.findOne({'gamecode':Session.get('gamecode')});
    if (game) {
        if (game.teams.length >= 2) {
            $("body").html(Meteor.render(Template.gameDice));
        }
    }
}

Meteor.startup(function () {
    // Allocate a new team id.
    //
    // XXX this does not handle hot reload. In the reload case,
    // Session.get('team_id') will return a real id. We should check for
    // a pre-existing team, and if it exists, make sure the server still
    // knows about us.
	Meteor.call('create_team', function(error, team_id) {
        Session.set('team_id', team_id);
    });

    // subscribe to all the teams and the game i'm in
    Meteor.autosubscribe(function () {
        Meteor.subscribe('teams');

        if (Session.get('team_id')) {
            var me = team();
            if (me && me.gamecode) {
                Meteor.subscribe('games', me.gamecode);
                Session.set('gamecode', me.gamecode);
            }
        }
    });

    // send keepalives so the server can tell when we go away.
    //
    // XXX this is not a great idiom. meteor server does not yet have a
    // way to expose connection status to user code. Once it does, this
    // code can go away.
    Meteor.setInterval(function () {
        if (Meteor.status().connected)
            Meteor.call('keepalive', Session.get('team_id'));
    }, 20 * 1000);
});
