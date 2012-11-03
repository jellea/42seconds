
Games = new Meteor.Collection('games');
// { 
//	access_code: 000,  
//	devices: [id, id,...], 
//	awnsers_played: [id, id,...] 
// }

Teams = new Meteor.Collection('teams');
// { color: TEAM_CHOICES[0], game: game_id, device: device_id }

Devices = new Meteor.Collection('devices');
// { game: game_id }

Awnsers = new Meteor.Collection('awnsers');
// { 
//	awnser: 'string in here', 
//	language: 'en',
//	url: 'bit.ly/73dha', 
//	played: 0, 
//	awnserd_correct: 0 
// }

var TEAM_CHOICES = [
	'RED', 'GREEN', 'ORANGE', 'BLUE'
]