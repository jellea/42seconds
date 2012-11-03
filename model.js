
Games = new Meteor.Collection('games');
// { 
//	access_code: 000,  
//	devices: [id, id,...], 
//	awnsers_played: [id, id,...] 
// }

Teams = new Meteor.Collection('teams');
// { game: game_id, device: device_id }

Devices = new Meteor.Collection('devices');
// { game: game_id }

Awnsers = new Meteor.Collection('awnsers');
// {
//	awnser: 'string in here', 
//	language: 'en',
//	played: 0, 
//	awnserd_correct: 0 
// }

Meteor.methods({
	
});

new_game = function () {
	var teams = []
	
	team1 = new_team();
	team1.game = self;
	team1.device
	teams.push(new_team) 
}

new_team = function () {
	var game;
	var device;
	
	return {
		game: null,
		device: null,
	}
}
