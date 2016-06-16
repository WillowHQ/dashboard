'use strict';

// Load the module dependencies
var surveyTemplate = require('../../controllers/api/surveyTemplateController.js');

module.exports = function(app) {

  // Creates a new route with the prefix /api/surveytemplates
  var surveyTemplatesRoute = app.route('/api/surveytemplates');

  surveyTemplatesRoute.post(surveyTemplate.create);
  surveyTemplatesRoute.get(surveyTemplate.listAll);

  // Creates a new route for an individual survey template
  var surveyTemplateRoute = app.route('/api/surveytemplates/:template_id');

  surveyTemplateRoute.get(surveyTemplate.read);
  surveyTemplateRoute.put(surveyTemplate.update);
  surveyTemplateRoute.delete(surveyTemplate.delete);

  //app.post('/api/surveyTemplate/preview', surveyTemplate.preview);
  //app.post('/api/surveyTemplate/schedule', surveyTemplate.schedule);

}
