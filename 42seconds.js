Answers = new Meteor.Collection("answers");
        
if (Meteor.isClient) {
    Template.hello.greeting = function () {
      return "Welcome to 42seconds.";
};

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
  
  Template.lobby.welcome = function () {
  
  	return "Welcome to the lobby";
  }
  
  Template.lobby.retrieveAnswerCount = function() {
 		Meteor.subscribe('answers');
  		console.log(Answers.find());

		return 0;
	}
  
}

  
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    var fs = __meteor_bootstrap__.require('fs');  
    answers = fs.readFileSync('answers/answers.json');

    Meteor.publish('answers', function () {
		return Answers.find();
	});
  });
}
