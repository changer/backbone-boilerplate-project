define([
  'app',
  'backbone'
], function (app, Backbone) {

  var Home = Backbone.Module();

  Home.Collection = Backbone.Collection.extend({
    url: function () {
      return '/assets/items.json';
    }
  });

  Home.Views.Home = Backbone.View.extend({
    template: 'home',
    events: {
      click: 'click'
    },
    click: function() {
      new Home.Collection().on('reset', function(collection) {
        var view = new Home.Views.Items({
          collection: collection
        });
        return this.setViews({ '.items': view }) && view.render();
      }, this).fetch();
    }
  });

  Home.Views.Items = Backbone.View.extend({
    tagName: 'ul',
    beforeRender: function() {
      this.insertView(new Home.Views.Item({
        model: new Backbone.Model({ name: 'test' })
      }));
      this.collection.each(function(item) {
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
