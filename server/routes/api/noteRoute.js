'use strict';

// Load the module dependencies
var note = require('../../controllers/api/noteController.js');


// Define the routes module' method
module.exports = function(app) {
  app.post('/api/note/create', note.create);
  app.post('/api/note/remove/:id', note.delete);
  app.post('/api/note/update/:id', note.update);

  //app.get('/api/notes', note.list);
}
