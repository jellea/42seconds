/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/6/12
 * @version 0.1
 *
 * In this file you will find the config settings such as
 * globals regarding standard round settings, standard categories and so forth and so on.
 */

var defaultAnswers = 5;
var defaultRounds = 5;
var defaultCategory = 'all';
var defaultDifficulty = 'medium';
var dev = false;
if(dev) {
	var defaultClock = 10; 
} else {
	var defaultClock = 42;
}
var defaultNumberOfAnswers = 5;