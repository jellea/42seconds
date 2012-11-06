/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/6/12
 * @version 0.1
 *
 * This file contains the logic which is needed on startup
 * such as setting timers and loading stuff.
 */

/**
 * Startup functions which will be executed when the server
 * has compiled and loaded all the files necessary.
 */
Meteor.startup(function () {
    // Set the idle timeout checker to 30 seconds
    Meteor.setInterval(function () {
        var now = (new Date()).getTime();
        var idle_threshold = now - 10 * 1000; // 70 sec of time of being idle is allowed
        var remove_threshold = now - 20 * 1000; // 1hr

        Teams.update({$lt:{last_keepalive:idle_threshold}},
            {$set:{idle:true}});

        // TODO: Cleanup the teams which are no longer active.
        Teams.remove({$lt: {last_keepalive: remove_threshold}});
    }, 30 * 1000);

    // Set the idle checker for games to 60 seconds.
    Meteor.setInterval(function () {
        // Get all the games
        var games = Games.find().fetch();

        // Check if the array is filled, else return.
        if(!games.length) {
            return;
        }
        // Iterate over the games and check if they can be removed.
        for(var game in games) {
            // Get the both teams.
            var teamOne = Teams.findOne(game.teams[0]._id);
            var teamTwo = Teams.findOne(game.teams[1]._id);

            // Check if they're idle.
            if(teamOne.idle && teamTwo.idle) {
                // Remove the game
                Games.remove(game._id);
            }
        }
    }, 60 * 1000);
});