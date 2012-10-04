define([
  'jquery',
  'bootstrap',
  'timeago'
],

function($) {

  // Global stuff
  $('body').tooltip({
    selector: '[rel=tooltip]'
  });

  // For after render
  return function(el) {
    $(el).find('.timeago').timeago();
  };
});
