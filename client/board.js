Template.lobby.events({
  'click button.startgame': function () {
    Meteor.call('start_new_game');
  },
  'click button.joingame': function () {
    Meteor.call('join_game');
  }
});