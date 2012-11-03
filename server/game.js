////////// Server only logic //////////
function player() {
  return Players.findOne(Session.get('player_id'));
}

var game = function () {
  var me = player();
  return me && me.game_id && Games.findOne(me.game_id);
};

Meteor.methods({
  start_new_game: function (evt) {
	var clock = 42;
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

    // create a new game with the current player in it
    var game_id = Games.insert({player: player(), clock: clock, gamecode: gamecode});

    // move everyone who is ready in the lobby to the game
    Players.update({game_id: null, idle: false, player_id: Session.get('player_id')},
                   {$set: {game_id: game_id}},
                   {multi: true});
    // Save a record of who is in the game, so when they leave we can
    // still show them.
    var p = Players.find({game_id: game_id},
                         {fields: {_id: true, name: true}}).fetch();
    Games.update({_id: game_id}, {$set: {players: p}});
	
    // wind down the game clock
    var interval = Meteor.setInterval(function () {
      clock -= 1;
      Games.update(game_id, {$set: {clock: clock}});

      // end of game
      if (clock === 0) {
        // stop the clock
        Meteor.clearInterval(interval);
        // declare zero or more winners
        var scores = {};

        /*
        var high_score = _.max(scores);
        var winners = [];
        _.each(scores, function (score, player_id) {
          if (score === high_score)
            winners.push(player_id);
        });
        Games.update(game_id, {$set: {winners: winners}});
        */
      }
    }, 1000);

    return gamecode;
  }, keepalive: function (player_id) {
    Players.update({_id: player_id},
                  {$set: {last_keepalive: (new Date()).getTime(),
                          idle: false}});
  },

  join_game: function (evt) {
	console.log('join_game');
  }
});

Meteor.setInterval(function () {
  var now = (new Date()).getTime();
  var idle_threshold = now - 70*1000; // 70 sec
  var remove_threshold = now - 60*60*1000; // 1hr

  Players.update({$lt: {last_keepalive: idle_threshold}},
                 {$set: {idle: true}});

  // XXX need to deal with people coming back!
  // Players.remove({$lt: {last_keepalive: remove_threshold}});

}, 30*1000);
