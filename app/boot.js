define([
  'jquery',
  'lodash',
  'backbone',
  'boilerplate/initialize',
  'app',
  'router'
], function($, _, Backbone, initialize, app, Router) {

  app = _.extend(app, {
    booted: true
  });
  app = initialize(app);
  app.start(Router);

});
