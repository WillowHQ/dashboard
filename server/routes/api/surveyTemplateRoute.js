'use strict';

// Load the module dependencies
var surveyTemplate = require('../../controllers/api/surveyTemplateController.js');

module.exports = function(app) {
  app.post('/api/surveyTemplate/create', surveyTemplate.create);
  //11:42am june 23
  //app.post('/api/surveyTemplate/preview', surveyTemplate.preview);
  //app.post('/api/surveyTemplate/schedule', surveyTemplate.schedule);
}
