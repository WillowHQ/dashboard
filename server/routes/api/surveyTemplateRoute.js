'use strict';

// Load the module dependencies
var surveyTemplate = require('../../controllers/api/surveyTemplateController.js');


// Define the routes module' method
module.exports = function(app) {
  app.post('/api/surveyTemplate/create', surveyTemplate.create);

}
