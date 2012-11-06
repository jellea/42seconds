/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/6/12
 * @version 0.1
 *
 * The main server side methods and logic.
 */

/**
 * Meteor methods the client can call as follows:
 * Meteor.call('nameOfFunction', arg1, arg2, etc.., callback)
 */
Meteor.methods({

    /**
     * Create a team
     * @return {String} _id of the team which the user stores in the session variable 'team_id'
     */
    createTeam: function () {
        return Teams.insert({'name':'Team','score':0});
    },

    /**
     * Returns the string 'newGame' to let the client know what game type to pick (quick match)
     * @return {String}
     */
    newGame:function () {
        return 'newGame';
    },

    advancedSettings:function () {
        return 'advancedSettings';
    },

    rules:function () {
        return 'rules';
    },

    startNewGame:function (team_id, rounds, category, difficulty) {
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

        loadAnswers(gamecode);

        Games.update({'gamecode':gamecode}, {$set:{'teams':p}});

        return Games.findOne({'gamecode':gamecode});
    },

    keepAlive: function (team_id) {
        Teams.update({_id:team_id},
            {$set:{last_keepalive:(new Date()).getTime(),
                idle:false}});
    },

    joinedGame:function (gamecode,team_id) {
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
                //loadAnswers(gamecode);
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