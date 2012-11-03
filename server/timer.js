Meteor.setInterval(function () {
  var now = (new Date()).getTime();
  var idle_threshold = now - 42*1000; // 70 sec
  //var remove_threshold = now - 60*60*1000; // 1hr

  //Players.update({$lt: {last_keepalive: idle_threshold}},
                 //{$set: {idle: true}});

  // XXX need to deal with people coming back!
  // Players.remove({$lt: {last_keepalive: remove_threshold}});

}, 30*1000);
