////////// Server only logic //////////

var defaultRounds = 5;
var defaultCategory = 'all';
var defaultDifficulty = 'medium';
var defaultClock = 42;

function createGamecode() {
    var gamecode = '';
    for (i = 0; i < 3; i++) {
        if (i == 0) {
            // don't allow 0 as first digit
            random = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
        } else {
            random = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
        }
        gamecode += '' + random;
    }
    var found = Games.findOne({'gamecode':gamecode});
    if (found) {
        return createGamecode();
    }
    return gamecode;
}

Meteor.methods({

	create_team: function () {
        var team_id = Teams.insert({'name':'Team','score':0});
        return team_id;
	},
	
    newgame:function () {
        return 'newgame';
    },

    advancedsettings:function () {
        return 'advancedsettings';
    },
    
    rules:function () {
    	return 'rules';
    },

    start_new_game:function (team_id, rounds, category, difficulty) {
    	if(typeof rounds=='undefined') {
    		var rounds = defaultRounds;
    	}
    	if(typeof category=='undefined') {
    		var category = defaultCategory;
    	}
    	if(typeof difficulty=='undefined') {
    		var difficulty = defaultDifficulty;
    	}
    	if(typeof clock=='undefined') {
        	var clock = defaultClock;
        }

        var gamecode = createGamecode();
		
        var team = Teams.findOne({_id:team_id});
        // create a new game with the current team in it
        Games.insert({'team':team, 'clock':clock, 'rounds': rounds, 'category': category, 'difficulty': difficulty, 'gamecode':gamecode, 'round':0});

        // Save a record of who is in the game, so when they leave we can
        // still show them.
		Teams.update({_id: team_id}, {$set:{'gamecode':gamecode, 'name': 'Team 1','score':0}});
        
        var p = Teams.find({'gamecode':gamecode},
            {fields:{_id:true, name:true}}).fetch();

        Games.update({'gamecode':gamecode}, {$set:{teams:p}});

        var game = Games.findOne({'gamecode':gamecode});

        return game;
        
    }, 
    
    keepalive: function (team_id) {
        Teams.update({_id:team_id},
            {$set:{last_keepalive:(new Date()).getTime(),
                idle:false}});
    },

    joined_game:function (gamecode,team_id) {
        var game = Games.findOne({'gamecode':gamecode});
        var teamNumber = (game.teams.length*1)+1;
        Teams.update({_id:team_id},
            {$set:{'gamecode':gamecode,'name':'Team '+teamNumber}},
            {multi:true});
        // Save a record of who is in the game, so when they leave we can
        // still show them.
        var p = Teams.find({'gamecode':gamecode},
            {fields:{_id:true, name:true, score:true}}).fetch();
        Games.update({'gamecode':gamecode}, {$set:{teams:p}});
        var game = Games.findOne({'gamecode':gamecode});

        return game;
    },

    startClock: function(gamecode) {
        // Set the clock to the default clock
        Games.update({gamecode:gamecode}, {$set:{clock:defaultClock}});
        var clock = defaultClock;

        // wind down the game clock
        var interval = Meteor.setInterval(function () {
            clock -= 1;
            Games.update({gamecode:gamecode}, {$set:{clock:clock}});

            // end of game
            if (clock === 0) {
                // stop the clock
                Meteor.clearInterval(interval);
                // declare zero or more winners
				var game = Games.findOne({'gamecode':gamecode});
				var teams = game.teams;
				var highest = 0;
				var winner = 'tie';
				for(i=0;i<teams.length;i++) {
					if(teams[i].score>highest) {
						console.log(teams[i].score);
						winner = teams[i].name;
					}
				}
				Games.update({'gamecode':gamecode},{$set: {'winner':winner}});
            }
        }, 1000);
    }
});

Meteor.setInterval(function () {
    var now = (new Date()).getTime();
    var idle_threshold = now - 70 * 1000; // 70 sec
    var remove_threshold = now - 60 * 60 * 1000; // 1hr

    Teams.update({$lt:{last_keepalive:idle_threshold}},
        {$set:{idle:true}});

    // XXX need to deal with people coming back!
    // Teams.remove({$lt: {last_keepalive: remove_threshold}});

}, 30 * 1000);
