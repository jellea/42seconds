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
        Spark.finalize($("body")[0]);
        $("body").html(Meteor.render(Template.lobby));
    },
    /**
     * Event: Click on the div.rule element
     */
    'click div.rule': function () {
        if ($('div.rule.active').next().is('div')) {
            $('div.rule.active').removeClass('active').next().addClass('active');
            $('ul.page-indicator input.active').removeClass('active').parent().next().find('input').addClass('active');
        } else {
            $('div.rule.active').removeClass('active');
            $('ul.page-indicator input.active').removeClass('active');
            $('div.rule').eq(0).addClass('active');
            $('ul.page-indicator input').eq(0).addClass('active');
        }
    }
});