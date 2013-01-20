define([
  'boilerplate/initialize',
  'app',
  'router'
], function(initialize, app, Router) {

  app = _.extend(app, {
    booted: true
  });
  app = initialize(app);
  app.start(Router);

});
