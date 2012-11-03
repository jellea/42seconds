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
		return Answers.find().count();
	}
  
}

  
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    var fs = __meteor_bootstrap__.require('fs');  
    answers = fs.readFileSync('answers/answers.txt');
    answers = answers.toString().split("\n");
    for(var i=0;i<answers.length;i++) {
	    answer = answers[i];
	    found = Answers.find({'answer':answer}).count();
		if(found===0) {
    		Answers.insert({'answer':answer});
		}
    }
	
    Meteor.publish('answers', function () {
		return Answers.find();
	});
  });
}
