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
        var idle_threshold = now - 70 * 1000; // 70 sec of time of being idle is allowed
        var remove_threshold = now - 60 * 60 * 1000; // 1hr

        Teams.update({$lt:{last_keepalive:idle_threshold}},
            {$set:{idle:true}});

        // TODO: Cleanup the teams which are no longer active.
        //Teams.remove({$lt: {last_keepalive: remove_threshold}});
    }, 30 * 1000);
});