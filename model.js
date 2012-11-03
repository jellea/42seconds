
Games = new Meteor.Collection('games');
// { 
//	access_code: 000,  
//	devices: [id, id,...], 
//	anwsers_played: [id, id,...] 
// }

Teams = new Meteor.Collection('teams');
// { game: game_id, device: device_id, score: 0 }

Devices = new Meteor.Collection('devices');
// { game: game_id }

anwsers = new Meteor.Collection('anwsers');
// {
//	anwser: 'string in here', 
//	language: 'en',
//	played: 0, 
//	anwserd_correct: 0 
// }

Dice = new Meteor.Collection('dice');
// {
//     access_code : 1234
//     throw : 0-2
// }

var TEAM_CHOICES = [
	'RED', 'GREEN', 'ORANGE', 'BLUE'
]

Players = new Meteor.Collection('players');

Meteor.methods({
	
});
/*
new_game = function (max_rounds) {
	var teams = [];
	var rounds = 0;
	var max_rounds = max_rounds;
	var turns = 0;
	var anwsers_played = [];
	
	team1 = new_team();
	team1.game = self;
	teams.push(team1);
	
	var active_team_index = 0;
	
	function join() {
		team2 = new_team();
		this.teams.push(team2);
		return team2;
	}
	
	function leave (team) {
		new_teams = []
		for (var i=0; i < this.teams.length; i++) {
			if (this.teams[i] !== team) {
				new_teams.push(team);
			}
		}
		this.teams = new_teams;
		return this.teams;
	}
	
	function next_team() {
		if (typeof this.teams[this.active_team_index + 1] != 'undefined') {
			this.active_team_index = this.active_team_index + 1;
		} else {
			this.active_team_index = 0;
		}
		this.turns++;
		if (this.turns == this.teams.lenght) {
			this.rounds++;
			this.turns = 0;
		}
		return this.teams[active_team_index];
	}
	
	function is_finished() {
		if (rounds >= max_rounds) {
			return true;
		}
		return false;
	}
	
	function get_anwsers() {
		return anwsers.find({'id': { $nin: this.played_anwsers }}).sort({played: -1}).limit(7);
	}
	
	
	
}

new_team = function () {
	var game;
	var device;
	
	function add_score(points) {
		this.score += points;
		this.game.next_team();
		return this.score;
	}
	
	return {
		game: null,
		score: 0
	}
}
*/