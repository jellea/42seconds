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
        $("body").html(Meteor.render(Template.gameActiveteam));
        Meteor.call('startClock', Session.get('gamecode'), function () {
                console.log("Game started!");
        });
    }, 1500);           
}

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

Template.gameDice.diceThrow = function () {
    return Dice.findOne({'access_code':Session.get('gamecode')});
};

Template.gameDice.roundnumber = function () {
    var game = Games.findOne({'gamecode' : Session.get('gamecode')});
    if(game) {
        return game.round;
    }
}

/*var team = function () {
    return Teams.findOne(Session.get('team_id'));
}*/

//Session.set('currentanswers', answers.find({},{limit:5}).fetch());

Template.scoreboard.scores = function() {
    var teams = Teams.find({'gamecode':gamecode},{fields:{_id:true, name:true, score:true}}).fetch();
    return scores;
}

Template.scoreboard.winner = function () {
    var game = Games.findOne({'gamecode' : Session.get('gamecode')});
    if(game) {
        return game.winner;
    }
}

Template.gameActiveteam.roundnumber = function () {
    var game = Games.findOne({'gamecode' : Session.get('gamecode')});
    if(game) {
        return game.round;
    }
}

Template.gameActiveteam.answers = function () {
    var game = Games.findOne({'gamecode' : Session.get('gamecode')});
    if(game) {
        return game.answers;
    }
}

Template.gameActiveteam.handicap = function () {
    var game = Games.findOne({'gamecode' : Session.get('gamecode')});
    if(game) {
        return game.handicap;
    }
}

Template.gameActiveteam.ready = function () {
    var game = Games.findOne({'gamecode' : Session.get('gamecode')});
    if(game) {
        if(game.clock === 0) {
            $("body").html(Meteor.render(Template.gameScorecheckWait));
        }
    }
}

Template.gameActiveteam.score = function () {
    var team = Teams.findOne(Session.get('team_id'));
    if(team) {
        return team.score;
    }
}

Template.gameActiveteam.events({
    'click input': function () {
        $("input[id='" + this.answer + "']").parent().css('text-decoration','line-through');
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
        Games.update({'gamecode':Session.get('gamecode')},{$set:{'answers':answers}});
    }
});

Template.gameOpponent.checkedOff = function() {
    var game = Games.findOne({'gamecode' : Session.get('gamecode')});
    var answers = new Array();
    for(var i=0; i<game.answers.length; i++) {
        if(game.answers[i].checkedOff) {
            answers.push(game.answers[i]);
        }
    }
    return answers;
}

Template.gameOpponent.roundnumber = function () {
    var game = Games.findOne({'gamecode' : Session.get('gamecode')});
    if(game) {
        return game.round;
    }
}

Template.gameOpponent.handicap = function () {
    var game = Games.findOne({'gamecode' : Session.get('gamecode')});
    if(game) {
        return game.handicap;
    }
}

Template.gameOpponent.ready = function () {
    var game = Games.findOne({'gamecode' : Session.get('gamecode')});
    if(game) {
        if(game.clock === 0) {
            $("body").html(Meteor.render(Template.gameScorecheck));
        }
        
        if(game.handicap != null && !$('div.countdown.run')) {
        	// run the CSS timer animation
            $('.pointer').addClass('run');
            $('div.countdown').addClass('run');
        }
    }
}

Template.gameOpponent.score = function () {
    var team = Teams.findOne(Session.get('team_id'));
    if(team) {
        return team.score;
    }
}

Template.lobby.events({
    'click input#newgame':function () {
        Meteor.call('newgame', function (error, result) {
            $("body").html(Meteor.render(Template.newgame));
        });
    },
    'click input#joingame':function () {
        $("body").html(Meteor.render(Template.join));
    },
    'click a#ruleslink':function () {
        $("body").html(Meteor.render(Template.rules));  
        return false;
    }
});

Template.newgame.events({
    'click input#startgame':function () {
        Meteor.call('start_new_game', Session.get('team_id'), function (error, game) {
            Template.showcode.team = game.teams.length;
            Session.set('teamNumber',game.teams.length);
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
        var rounds = $('input[name="rounds"]:checked').val();
        var category = $('input[name="category"]:checked').val();
        var difficulty = $('input[name="difficulty"]:checked').val();

        Meteor.call('start_new_game', Session.get('team_id'), rounds, category, difficulty, function (error, game) {
            Template.showcode.rounds = rounds;
            Template.showcode.category = category;
            Template.showcode.difficulty = difficulty;
            Template.showcode.gamecode = game.gamecode;
            Template.showcode.team = game.teams.length;
            Session.set('teamNumber',game.teams.length);
            var fragment = Meteor.render(Template.showcode);
            $("body").html(fragment);
        });
    }
});

Template.join.events({
    'click input#joingame':function () {
        var gamecode = $("#gamecode").val();
	        Session.set('gamecode',gamecode);
        Meteor.call('joined_game', gamecode, Session.get('team_id'), function (error, game) {
            if (error) {
                console.log(error);
                return;
            }
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

Template.rules.events = ({
	'click input#closeRules': function () {
        $("body").html(Meteor.render(Template.lobby));
	}
});

Template.showcode.ready = function () {
    var game = Games.findOne({'gamecode':Session.get('gamecode')});
    if (game) {
        if (game.teams.length >= 2) {
            $("body").html(Meteor.render(Template.gameDice));
        }
    }
}


Template.gameScorecheckWait.wait = function () {
    Meteor.subscribe()
    var game = Games.find({'gamecode' : Session.get('gamecode')});
    if(game) {
        if(game.scoreConfirmed === true) {
            $("body").html(Meteor.render(Template.gameResults));
        } else {
            console.log("Waiting for score confirmation.");
            return false;
        }
    }
};

Template.gameScorecheck.answers = function () {
    var game = Games.findOne({'gamecode' : Session.get('gamecode')});
    if(game) {
        return game.answers;
    }
}

Template.gameScorecheck.events({
    'click input.nextround': function () {
        console.log("Scores confirmed");
        var game = Games.findOne({'gamecode' : Session.get('gamecode')});
        var answers = new Array();
        for(var i=0; i<game.answers.length; i++) {
            if(game.answers[i].checkedOff) {
                answers.push(game.answers[i]);
            }
        }
        Teams.update({'team_id': Session.get('team_id')}, {'$set': {'score' : answers.length}});
        Games.update({'gamecode': Session.get('gamecode')}, {'$set': {'scoreConfirmed' : true}});
        $("body").html(Meteor.render(Template.gameResults));
    },
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
        Games.update({'gamecode':Session.get('gamecode')},{$set:{'answers':answers}});

    }
});

Template.gameResults.answers = function () {
	
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
    /*Meteor.autosubscribe(function () {
        Meteor.subscribe('teams');

        if (Session.get('team_id')) {
            var me = team();
            if (me && me.gamecode) {
                Meteor.subscribe('games', me.gamecode);
                Session.set('gamecode', me.gamecode);
            }
        }
    });*/

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
