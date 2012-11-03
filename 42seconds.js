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
  		answers = Meteor.subscribe('answers');
  		console.log(answers);
  		return answers;
	}
  
}

  
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    var fs = __meteor_bootstrap__.require('fs');  
    answers = fs.readFileSync('answers/answers.json');
    var Answers = new Meteor.Collection("answers");
    Meteor.publish('answers', function () {
		returns Answers.find();
	});
  });
}
