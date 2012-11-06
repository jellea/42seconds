/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/6/12
 * @version 0.1
 *
 * This file contains helpers which can be used client side
 * for anything you need them to do!
 */

/**
 * This is a dirty hack which solves the problem of
 * null reference on Sparks with zombie templates.
 * This method will take a template and where to render
 * it and perform the render.
 * The issue can be found here:
 * https://github.com/meteor/meteor/issues/392
 * @param {Object} tmpl         The template to load
 * @param {String} container    The containter to put it in
 * @param options               Not implemented yet
 */
function render(tmpl, container, options) {
    container = container || '#main_container';
    var template = Meteor.render(function () {
        return Template[tmpl]();
    });
    Spark.finalize($(container)[0]);
    $(container).html(template);
}