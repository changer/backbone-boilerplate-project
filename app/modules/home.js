define([
  'app',
  'backbone'
], function (app, Backbone) {

  var Home = Backbone.Module();

  Home.Views.Home = Backbone.View.extend({
    template: 'home'
  });

  Home.Views.About = Backbone.View.extend({
    template: 'about'
  });

  Home.Model = Backbone.Model.extend({ });

});
