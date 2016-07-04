'use strict';

var mongoose = require('mongoose');
var SurveyTemplate = require('../../models/surveyTemplate.js');

exports.create = function (req, res) {
  var surveyTemplate = new SurveyTemplate(req.body);

  surveyTemplate.save(function (err, surveyTemplate) {
    if (!err) {
      res.json(surveyTemplate);
    } else {
      res.send(err);
    }
  })
};

exports.read = function (req, res) {
  SurveyTemplate.findById(req.params.template_id, function (err, surveyTemplate) {
    if (!err) {
      res.json(surveyTemplate);
    } else {
      res.send(err);
    }
  });
};

exports.update = function (req, res) {
  SurveyTemplate.findByIdAndUpdate(
    req.params.template_id,
    req.body,
    {new: true},
    function (err, surveyTemplate) {
      if (!err) {
        res.json(surveyTemplate);
      } else {
        res.send(err);
      }
  })
};

exports.delete = function (req, res) {
  SurveyTemplate.findByIdAndRemove(req.params.template_id, function (err, surveyTemplate) {
    if (!err) {
      res.json(surveyTemplate);
    } else {
      res.send(err);
    }
  });
};

exports.listAll = function (req, res) {
  SurveyTemplate.find(function (err, surveyTemplate) {
    if (!err) {
      res.json(surveyTemplate);
    } else {
      res.send(err);
    }
  });
};


exports.create = function(req, res) {
  console.log();
  console.log('CREATING SURVEY');
  console.log(req.body);
  console.log();

  var surveyTemplate = new SurveyTemplate(req.body);
  surveyTemplate.save(function(err, surveyTemplate) {
    if(!err) {
      console.log("this worked");
          User.findByIdAndUpdate(
            surveyTemplate.author,
            // $addToSet works like $push but prevents duplicates
            {$addToSet: {"surveyTemplates": surveyTemplate}},
            {safe: true, new: true},
            function(err, user) {
              if(err) {
                console.log(err);
              }
              else {
                console.log(surveyTemplate);
                console.log('Printing user...');
                console.log(user);
              }
            }
          );
    } else {
      console.log(err);
    }
  });


  console.log();
  console.log('SURVEY CREATED aJJJJJJJJJJJJJ');
  console.log();
  res.send(surveyTemplate);
}

exports.preview = function (req, res) {
  //TODO: fix preview to use bot code
  console.log();
  console.log('Inside preview');
  var surveyTemplate = new SurveyTemplate(req.body);
  User.findById(surveyTemplate.author, function (err, user) {
    console.log(user.phoneNumber);
    twilio.sendMessage({
      to: user.phoneNumber,
      from: config.phoneNumbers.reminders,
      body: 'Hi! Here\'s a survey your coach wanted me to send you.'
    }, function (err, responseData) {
      if (!err) {
        console.log(JSON.stringify(responseData));
        // TODO: possibly replace with _.find()
        var index = 0;
        for (var key in surveyTemplate.questions) {
          console.log('The key is: ' + key);
          console.log(surveyTemplate.questions[key]);
          console.log('Sending question: ' + JSON.stringify(surveyTemplate.questions[key].question));
          twilio.sendMessage({
            to: user.phoneNumber,
            from: config.phoneNumbers.reminders,
            body: surveyTemplate.questions[key].question
          }, function (err, responseData) {
            if (!err) {
              console.log(JSON.stringify(responseData));
            } else {
              console.log(err);
            }
          });
          index++;
        }
      }
    });
  });
  console.log(surveyTemplate);
  res.send(surveyTemplate);
}

//
//
// exports.sendSurveys = function () {
//   var now = new Date();
//   var hoursNow = now.getHours();
//   var minutesNow = now.getMinutes();
//   var dayNow = now.getDay();
//
//   console.log('Sending surveys...');
//   /*console.log();
//   console.log('Listing all bots...');
//   bot.list(function (err, res) {
//     if (!err) console.log(res);
//   });*/
//
//   SurveyTemplate.find({days: dayNow})
//     .where('hour').equals(hoursNow)
//     .where('minute').equals(minutesNow)
//     .exec(function (err, surveys) {
//       if (surveys) {
//         console.log('Printing all surveys for this time.');
//         console.log(surveys);
//         for (var i = 0; i < surveys.length; i++) {
//           var survey = surveys[i];
//
//           if (!survey.repeat) {
//             SurveyTemplate.findById(
//               survey._id,
//               {
//                 daysOfTheWeek: {
//                   monday: false,
//                   tuesday: false,
//                   wednesday: false,
//                   thursday: false,
//                   friday: false,
//                   saturday: false,
//                   sunday: false
//                 },
//                 days: []
//               },
//               {new: true},
//               function (err, survey) {
//                 if (!err) {
//                   console.log('Survey updated');
//                   console.log(survey);
//                 } else {
//                   console.log('Error updating survey');
//                   console.log(err);
//                 }
//             });
//           }
//
//           // Find author's clients
//           User.findById(survey.author, function (err, coach) {
//             console.log('The coach\'s clients are:');
//             console.log(coach.clients);
//             console.log('survey.selectedUsers is:');
//             console.log(survey.selectedUsers);
//             for (var j = 0; j < coach.clients.length; j++) {
//               var clientId = coach.clients[j];
//               console.log('The cliendId is:');
//               console.log(JSON.stringify(clientId));
//               var surveyObject = survey.toObject();
//               var coachObject = coach.toObject();
//               console.log();
//               console.log(surveyObject.selectedUsers);
//               console.log();
//               console.log(coachObject.clients[j]);
//               console.log();
//               var shouldSend = false;
//               shouldSend = _.find(surveyObject.selectedUsers, function (item) {
//                 return _.isEqual(item, coachObject.clients[j]);
//               });
//               if (shouldSend) {
//                 User.findById(clientId, function (err, _client) {
//                     var client = _client.toObject();
//                     console.log(client);
//                     console.log();
//                     console.log();
//                     console.log('The client id is: ' + client._id)
//                     console.log();
//                     console.log();
//                     // Initiate conversation with bot
//                     bot.talk({extra: true, trace: true, client_name: client._id, input: 'XINIT ' + survey._id + client._id}, function (err, response) {
//                     if (!err) {
//                       console.log(response);
//                       client.pandoraSessionId = response.sessionid;
//                       console.log('The bot said: ' + response.responses.join(' '));
//                       // Split the bot's response and send two texts to the user, to provide neater UX
//                       var splitResponse = response.responses.join(' ').split('\n');
//                       console.log(splitResponse);
//                       twilio.sendMessage({
//                         to: client.phoneNumber,
//                         from: config.phoneNumbers.reminders,
//                         body: splitResponse[0]
//                       }, function (err, responseData) {
//                         if (!err) {
//                           console.log(JSON.stringify(responseData));
//                           twilio.sendMessage({
//                             to: client.phoneNumber,
//                             from: config.phoneNumbers.reminders,
//                             body: splitResponse[1]
//                           }, function (err, responseData) {
//                             if (!err) {
//                               console.log(JSON.stringify(responseData));
//                             } else {
//                               console.log(err);
//                             }
//                           })
//                         } else {
//                           console.log(err);
//                         }
//                       });
//                       _client.set(client);
//                       _client.save(function (err, client) {
//                         if (!err) {
//                           console.log();
//                           console.log('Client has been assigned a sessionid:')
//                           console.log(client);
//                           console.log();
//                         } else {
//                           console.log('An error occurred');
//                           console.log(err);
//                         }
//                       });
//                     }
//                   });
//                 });
//               }
//             }
//           });
//         }
//       }
//   });
//   //If survey isn't supposed to repeat set all days to false
//   //TODO: for every survey to be sent at this time, start the bot talking to the client
//   /*var talkParams = {
//     input: 'init'
//   };
//   bot.talk(talkParams, function (err, res) {
//     if (!err) {
//       console.log(res);
//       bot.talk({input: 'yes'}, function (err, res) {
//         if (!err) console.log(res);
//       });
//     }
//   });*/
// }
//
// // Every minute all day every day
// var rule = new schedule.RecurrenceRule();
// rule.dayOfWeek = [new schedule.Range(0, 6)];
// var job = schedule.scheduleJob(rule, function() {
//   exports.sendSurveys();
// });
