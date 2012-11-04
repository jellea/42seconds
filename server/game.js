////////// Server only logic //////////

var defaultRounds = 5;
var defaultCategory = 'all';
var defaultDifficulty = 'medium';
var defaultClock = 42;

function createGamecode() {
    var gamecode = '';
    var random;
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
        return Teams.insert({'name':'Team','score':0});
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
        var clock;
        if(typeof rounds=='undefined') {
            rounds = defaultRounds;
        }
        if(typeof category=='undefined') {
            category = defaultCategory;
        }
        if(typeof difficulty=='undefined') {
            difficulty = defaultDifficulty;
        }
        if(typeof clock=='undefined') {
            clock = defaultClock;
        }

        var gamecode = createGamecode();
        
        var team = Teams.findOne({_id:team_id});
        // create a new game with the current team in it
        Games.insert({'team':team, 'clock':clock, 'rounds': rounds, 'category': category, 'difficulty': difficulty, 'gamecode':gamecode, 'round':1, 'scoreConfirmed':false});

        // Save a record of who is in the game, so when they leave we can
        // still show them.
        Teams.update({_id: team_id}, {$set:{'gamecode':gamecode, 'name': 'Team 1','score':0}});
        
        var p = Teams.find({'gamecode':gamecode},
            {fields:{_id:true, name:true}}).fetch();
            
        /*var answers = [
            {"answer": "Josje Huisman", "category": "Acteurs", "link": "http://www.imdb.com/ri/STARM_100/TOP/102162/name/nm1500155", "language": "nl"},
            {"answer": "Johnny Depp", "category": "Acteurs", "link": "http://www.imdb.com/ri/STARM_100/TOP/102162/name/nm0000136", "language": "nl"},
            {"answer": "Kristen Stewart", "category": "Acteurs", "link": "http://www.imdb.com/ri/STARM_100/TOP/102162/name/nm0829576", "language": "nl"},
            {"answer": "Robert Pattinson", "category": "Acteurs", "link": "http://www.imdb.com/ri/STARM_100/TOP/102162/name/nm1500155", "language": "nl"}
        ];*/
        var answers = new Array();
        var fs = __meteor_bootstrap__.require('fs');   
        var data = fs.readFileSync('answers/answers.txt');
        data = data.toString().split("\n");
        console.log('data');
        console.log(data);
        for(i=0;i<7;i++) {
        	random = Math.floor(Math.random() * (data.length - 0 + 1)) + 0;
        	var word = data[random];
        	answers.push({"answer":word});
        }
        console.log(answers);
        
        Games.update({'gamecode':gamecode}, {$set:{'teams':p,'answers':answers}});

        return Games.findOne({'gamecode':gamecode});
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
        return Games.findOne({'gamecode':gamecode});
    },

    startClock: function(gamecode) {
        // Set the clock to the default clock
        Games.update({gamecode:gamecode}, {$set:{clock:defaultClock}});
        var clock = defaultClock;
        var winner;

        // wind down the game clock
        var interval = Meteor.setInterval(function () {
            clock -= 1;
            Games.update({gamecode:gamecode}, {$set:{clock:clock}});

            if((clock % 5)==0) {
                // check every 5 seconds for an idle player
                var teams = Teams.find({'gamecode':gamecode},{fields:{_id:true, name:true, score:true}}).fetch();
		        for(i=0;i<teams.length;i++) {
		            if(teams[i].idle) {
		            	if(i==0) {
		            		winner = teams[1];
		            	} else if(i==1) {
		            	    winner = teams[0];
		            	}
		                // Team IDLE! == forfeit
		                Games.update({'gamecode':gamecode},{$set:{'forfeited':true,'winner':winner}});
		            }
		        }
            }
            // end of game
            if (clock === 0) {
                Games.update({gamecode:gamecode}, {$set:{clock:0}});
                // stop the clock
                Meteor.clearInterval(interval);
		        var game = Games.findOne({'gamecode':gamecode});
		        team = game.team;
                var teams = Teams.find({'gamecode':gamecode},{fields:{_id:true, name:true, score:true}}).fetch();
                for(i=0;i<teams.length;i++) {
                    if(teams[i]._id!=team._id) {
                        // set the other team as current team for the new game
                        Games.update({gamecode:gamecode}, {$set:{'team':team}});
                    }
                }
                if(game.round>=game.rounds) {
                	// game ENDS!
                    // declare zero or more winners
                    var teams = Teams.find({'gamecode':gamecode},{fields:{_id:true, name:true, score:true}}).fetch();
                    var highest = 0;
                    var winner = 'tie';
                    for(i=0;i<teams.length;i++) {
                        if(teams[i].score>highest) {
                            winner = teams[i].name;
                        } else if(teams[i].score==highest) {
                            winner = 'tie';
                        }
                    }
                    Games.update({'gamecode':gamecode},{$set: {'winner':winner}});
                }
            }
        }, 1000);
    },
    
    scoreboard: function(gamecode) {
        // reset scoreConfirmed, winner & handicap
        Games.update({'gamecode':gamecode},{$set:{'winner':null,'handicap':null,'scoreConfirmed':false}});
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
