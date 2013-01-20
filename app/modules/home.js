define([
  'app',
  'backbone'
], function (app, Backbone) {

  var Home = Backbone.Module();

  Home.Views.Home = Backbone.View.extend({
    template: 'home',
    beforeRender: function() {
      var items = [ {name: 'a'}, {name: 'b'}, {name: 'c'}, {name: 'd'}, {name: 'e'} ];
      _(items).each(function(item) {
        this.insertView(new Home.Views.Item({
          model: item
        }));
      }, this);
    }
  });

  Home.Views.Item = Backbone.View.extend({
    template: 'item'
  });

  Home.Views.About = Backbone.View.extend({
    template: 'about'
  });

  Home.Model = Backbone.Model.extend({ });

  return Home;

});
