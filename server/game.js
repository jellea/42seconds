////////// Server only logic //////////
function team() {
  return Teams.findOne(Session.get('team_id'));
}

var game = function () {
  var me = team();
  return me && me.gamecode && Games.findOne(me.gamecode);
};

Meteor.methods({
  start_new_game: function (evt) {
	var clock = 42;
function createGamecode() {
    var gamecode = '';
	for(i=0;i<3;i++) {
		if(i==0) {
			 // don't allow 0 as first digit
			random = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
		} else {
			random = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
		}
		gamecode += ''+random;
	}
	found = Games.findOne({'gamecode':gamecode});
	if(found) {
		return createGameCode();
	}
	return gamecode;
}
	gamecode = createGamecode();

    // create a new game with the current team in it
    Games.insert({team: team(), clock: clock, gamecode: gamecode});
    
    // move everyone who is ready in the lobby to the game
    Teams.update({gamecode: null, idle: false, team_id: Session.get('team_id')},
                   {$set: {gamecode: gamecode}},
                   {multi: true});
                   
    // Save a record of who is in the game, so when they leave we can
    // still show them.
    var p = Teams.find({gamecode: gamecode},
                         {fields: {_id: true, name: true}}).fetch();
    Games.update({gamecode: gamecode}, {$set: {teams: p}});
	
    // wind down the game clock
    var interval = Meteor.setInterval(function () {
      clock -= 1;
      Games.update({gamecode: gamecode}, {$set: {clock: clock}});

      // end of game
      if (clock === 0) {
        // stop the clock
        Meteor.clearInterval(interval);
        // declare zero or more winners
        var scores = {};

        /*
        var high_score = _.max(scores);
        var winners = [];
        _.each(scores, function (score, team_id) {
          if (score === high_score)
            winners.push(team_id);
        });
        Games.update({gamecode:gamecode}, {$set: {winners: winners}});
        */
      }
    }, 1000);
    
    Session.set('gamecode',gamecode);

    return gamecode;
  }, keepalive: function (team_id) {
    Teams.update({_id: team_id},
                  {$set: {last_keepalive: (new Date()).getTime(),
                          idle: false}});
  },

  joined_game: function (gamecode) {
    // move everyone who is ready in the lobby to the game
    Teams.update({gamecode: null, idle: false, team_id: Session.get('team_id')},
                   {$set: {gamecode: gamecode}},
                   {multi: true});
    // Save a record of who is in the game, so when they leave we can
    // still show them.
    var p = Teams.find({gamecode: gamecode},
                         {fields: {_id: true, name: true}}).fetch();
    Games.update({gamecode:gamecode}, {$set: {teams: p}});
    
    return 'joined';
  }
});

Meteor.setInterval(function () {
  var now = (new Date()).getTime();
  var idle_threshold = now - 70*1000; // 70 sec
  var remove_threshold = now - 60*60*1000; // 1hr

  Teams.update({$lt: {last_keepalive: idle_threshold}},
                 {$set: {idle: true}});

  // XXX need to deal with people coming back!
  // Teams.remove({$lt: {last_keepalive: remove_threshold}});

}, 30*1000);
