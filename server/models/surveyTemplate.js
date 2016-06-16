'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var surveyTemplateSchema =  new Schema({
  title: {type: String, required: true},
  questions: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'SurveyQuestion',
    // Makes sure that the questions array has at least one item
    validate: [
      function (questionsArray) {
        return questionsArray.length >= 1;
      }, 'Path `{PATH}` must have at least one item.'
    ]
  }
});

var SurveyTemplate = mongoose.model('SurveyTemplate', surveyTemplateSchema);
module.exports = SurveyTemplate;

/*author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
selectedUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
daysOfTheWeek: {
monday: {type: Boolean},
tuesday: {type: Boolean},
wednesday: {type: Boolean},
thursday: {type: Boolean},
friday: {type: Boolean},
saturday: {type: Boolean},
sunday: {type: Boolean}
},
repeat: Boolean,
timeOfDay: {type: Date, default: Date.now},
days: [{type: Number, min: 0, max: 6}],
hour: {type: Number, min: 0, max: 23},
minute: {type: Number, min: 0, max: 59}
*/
