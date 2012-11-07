/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 06-11-2012
 * @version 0.1
 *
 * This file contains the startup methods and routines which Meteor has to go through
 * in order to startup good.
 *
 * Things like setting up a database should be done in this file.
 * Events and other template specific methods should be placed in their respective file.
 */
Meteor.startup(function () {
	window.addEventListener('load', detectOrientationMode, false);
	window.addEventListener('orientationchange', handleOrientation, false);
	
	function isMobile() {
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
			return true;	
		} else {
			return false;
		}
	}
	
	function detectOrientationMode() {
	  setTimeout(function() { window.scrollTo(0, 1); }, 10);
	  //this is where our detection starts
	  if(isMobile()) {
		var viewportWidth = window.innerWidth;
		if (viewportWidth > 320 && viewportWidth < 600) {
		    // Zomg, landscape!!
		    $('#wrapper').hide();
		    $('#wrapper.landscape').show();
		    $('body').css('width','600');
		} else {
		    // Portrait, all is good in the world of 42!
		}
	  }
	}
	
	function handleOrientation() {
	  setTimeout(function() { window.scrollTo(0, 1); }, 10);
	  //this is where our detection starts
	  if(isMobile() {
		var viewportWidth = window.innerWidth;
		if (viewportWidth > 320 && viewportWidth < 600) {
		    // Zomg, landscape!!
		    $('#wrapper').hide();
		    $('#wrapper.landscape').show();
		    $('body').css('width','600');
		} else {
		    // Portrait, all is good in the world of 42!
		    $('#wrapper').show();
		    $('#wrapper.landscape').hide();
		    $('body').css('width','320');
		}
	  }
	}
    /*
     * Allocate a new team id. This will be the id which determines the score and respective their turn.
     * @param {String} error    The error if it is set.
     * @param {String} team_id  The _id of the team object just created.
     */
    Meteor.call('createTeam', function(error, team_id) {
        Session.set('team_id', team_id);
    });

    /**
     * Set a keepalive so the server knows whether the client is online or not and can act accordingly.
     */
    Meteor.setInterval(function () {
        if (Meteor.status().connected)
            Meteor.call('keepAlive', Session.get('team_id'));
    }, 20 * 1000); // KeepAlive Every 20 seconds
});
