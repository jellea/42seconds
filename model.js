/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/6/12
 * @version 0.1
 *
 * This file contains models which can be used to make
 * database calls. In this file the structure of the
 * documents that are inside the collections are
 * also defined.
 */

/**
 * {
 *      gamecode:   123                 // 3 digit game code (string)
 *      team:       object              // The team currently playing (object)
 *      teams:      [object, object]    // The teams in the current game (array)
 *      clock:      42                  // The time left on the clock for this round. (int)
 *      rounds:     5                   // The number of rounds to play (int)
 *      category:   all                 // The category being played. (string)
 *      difficulty: medium              // The difficulty to play on (string)
 *      round:      1                   // The current round (int)
 *      scoreConfirmed: false           // Is the score already confirmed by the other party? (bool)
 *      handicap:   0                   // The handicap for the current round (int)
 *      nextRound: false                // Whether the next round already started.
 *      answers:    [object->
 *                  {answer: 'string'},
 *                  object],            // The answers for this current game and round (array)
 *      roundScores: [{"red": 1, "blue":0},{"red": 1, "blue":4}, etc.] // The scores for each round.
 * }
 * @type {Meteor.Collection}
 */
Games = new Meteor.Collection('games');

/**
 * {
 *      _id:            string          // The _id of the document (also the team_id in the session) (string)
 *      gamecode:       123             // 3 digit game code (string)
 *      idle:           false           // Whether the player is idle or not. (bool)
 *      last_keepalive: Date.getTime()  // The last keepalive as Epoch time. (int)
 *      name:           Team 1          // The name of the team, if you create the game you are Team 1, if you joined you're Team 2 (string)
 *      score:          0               // The score of the team so far. (int)
 * }
 * @type {Meteor.Collection}
 */
Teams = new Meteor.Collection('teams');


/**
 * {
 *      access_code : 1234  // The gamecode to the game. (string)
 *      throw : 0-2         // The throw the player made. (int)
 * }
 * @type {Meteor.Collection}
 */
Dice = new Meteor.Collection('dice');

/**
 * {
 *      answer: "Christian Bale",
 *      category: "Acteurs",
 *      language: "nl",
 *      link: "http://www.imdb.com/ri/STARM_100/TOP/102162/name/nm0000288"
 * }
 * @type {Meteor.Collection}
 */
Answers = new Meteor.Collection('answers');