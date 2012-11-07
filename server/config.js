/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/6/12
 * @version 0.1
 *
 * In this file you will find the config settings such as
 * globals regarding standard round settings, standard categories and so forth and so on.
 */

if(location.href.indexOf('dev')>0) {
	var defaultClock = 10; 
	
	var defaultRounds = 5;
	var defaultCategory = 'all';
	var defaultDifficulty = 'medium';
	var defaultNumberOfAnswers = 5;
} else {
	var defaultClock = 42;
	
	var defaultRounds = 5;
	var defaultCategory = 'all';
	var defaultDifficulty = 'medium';
	var defaultNumberOfAnswers = 5;
}