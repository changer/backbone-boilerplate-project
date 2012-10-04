define([
  'app',
  'backbone'
],

function(app, Backbone) {

  var Menu = Backbone.Module();

  Menu.Model = Backbone.Model.extend({});

  Menu.Collection = Backbone.Collection.extend({});

  Menu.Views.Item = Backbone.View.extend({
    template: 'menu/item',
    tagName: 'li',

    events: {
      click: 'click'
    },

    click: function (e) {
      if($(e.currentTarget).find('a[data-bypass="true"]').length) {
        return true;
      }
      app.router.go(this.model.get('path'));
      return false;
    },

    beforeRender: function() {
      if (this.model.get('active')) {
        this.$el.addClass('active').siblings().removeClass('active');
      }
    }

  });

  Menu.Views.List = Backbone.View.extend({
    tagName: 'ul',
    template: 'menu/list',
    className: 'nav',

    beforeRender: function() {
      this.collection.each(function(menu) {
        this.insertView(new Menu.Views.Item({
          model: menu
        }));
      }, this);
    }
  });

  return Menu;

});
