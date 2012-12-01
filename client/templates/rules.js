/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/6/12
 * @version 0.1
 *
 * This file is here to put the event handlers, helpers and methods in
 * which belong to the rules template.
 *
 * This templates serves the purpose of explaining the rules to the players.
 */

/**
 * Events for the rules page
 */
Template.rules.events = ({
    /**
     * Event: Click on the 'I get the rules' button
     */
    'click input#closeRules': function () {
        render("lobby", "body");
    },
    /**
     * Event: Click on the div.rule element
     */
    'click :button': function (event) {
        /**
         * Change the little balls
         */
        $(":button.active").removeClass('active');
        $(event.currentTarget).addClass('active');

        /**
         * Change the rule
         */
        $('div.active').removeClass('active');
        $('div.rule'+ event.currentTarget['value']).addClass('active');

    },
    'click img.backbutton':function () {
        render("lobby", "body");
    }
});