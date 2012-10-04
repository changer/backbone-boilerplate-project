define([
  'jquery',
  'lodash',
  'backbone',

  'helpers/live'
],

function($, _, Backbone, live) {

  Backbone.Module = function(additionalProps) {
    return _.extend({ Views: {} }, additionalProps);
  };

  // Backbone global settings
  Backbone.Model.prototype.idAttribute = '_id';
  Backbone.View.prototype.serialize = function() {
    var result = {
    };
    if(this.model && this.model.toJSON) {
      result.model = this.model.toJSON();
    }
    if(this.collection && this.collection.toJSON) {
      result.collection = this.collection.toJSON();
    }
    if(this.renderAttributes) {
      result = _.extend(result, this.renderAttributes());
    }
    return result;
  };

  return {
    name: 'My app',
    el: '#main',
    root: '/',
    baseUrl: '/api/',
    paths: {
      layout: 'app/layouts/',
      template: 'app/templates/'
    },
    live: live,
    switchLayout: function(oldLayout, newLayout) {
      var old = $('#main').find('> *').not(newLayout.el),
          clean = function() {
            return [
              oldLayout && oldLayout.remove(),
              old && old.remove()
            ];
          };
      $('html').addClass(newLayout.name);
      if(oldLayout) {
        $('html').removeClass(oldLayout.name);
      }
      clean();
      newLayout.$el.prependTo('#main');
    }
  };

});
