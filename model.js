
Games = new Meteor.Collection('games');
// { 
//	access_code: 000,  
//	devices: [id, id,...], 
//	answers_played: [id, id,...] 
// }

Teams = new Meteor.Collection('teams');
// { game: game_id, device: device_id, score: 0 }

Devices = new Meteor.Collection('devices');
// { game: game_id }

answers = new Meteor.Collection('answers');
// {
//	answer: 'string in here', 
//	language: 'en',
//	played: 0, 
//	answerd_correct: 0 
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
