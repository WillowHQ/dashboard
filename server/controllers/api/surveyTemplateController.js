'use strict'
var mongoose = require('mongoose');
var SurveyTemplate = require('../../models/surveyTemplate.js');
var User = require('../../models/user.js');
var _ = require('underscore');
var moment = require('moment');
var Promise = require('bluebird');
var request = require('request');
var twilio = require('twilio')('ACf83693e222a7ade08080159c4871c9e3', '20b36bd42a33cd249e0079a6a1e8e0dd');
var twiml = require('twilio');
var config = require('../../config/env/development.js');
var schedule = require('node-schedule');
var Pandorabot = require('pb-node');
var builder = require('xmlbuilder');
var fs = require('fs');

var botOptions = {
  url: 'https://aiaas.pandorabots.com',
  app_id: '1409612709792',
  user_key: '83a7e3b5fa60385bd676a05cb4951e98',
  botname: 'willow'
};

var bot = new Pandorabot(botOptions);

exports.create = function(req, res) {

  var surveyTemplate = new SurveyTemplate(req.body);
  console.log();
  console.log('Printing survey template');
  console.log(surveyTemplate);
  User.find({}, function (err, users) {
    _.each(users, function (user) {
      var xml = builder.create('aiml').att('version', '2.0');
      /*// Defines pattern used internally to get answers to questions
      xml.ele('category')
        .ele('pattern', 'XGET *')
        .up()
        .ele('template')
          .ele('get')
            .ele('name')
              .ele('star');
          // Defines pattern used internally to normalize coach's questions
          xml.ele('category')
        .ele('pattern', 'XNORM *')
        .up()
        .ele('template')
          .ele('star');*/
        // Defines pattern to begin this survey
      console.log();
      console.log();
      console.log('USERUSERUSERUSER');
      console.log(user);
      console.log();
      console.log();
      xml.ele('category')
        .ele('pattern', 'XINIT ' + surveyTemplate._id + user._id)
        .up()
        .ele('template', 'Hi! Here\'s a survey your coach wanted me to send you.\n' + surveyTemplate.questions[0].question);
      // Find out how the bot normalizes the first question
      var normalizedQuestion;
      bot.talk({extra: true, trace: true, input: 'XNORM ' + surveyTemplate.questions[0].question}, function (err, res) {
        normalizedQuestion = res.responses.join(' ');

        User.findByIdAndUpdate(
          user._id,
          {pandoraBotSaid: normalizedQuestion},
          {new: true},
          function(err, user) {
            console.log('User updated');
            console.log(user);
        });

        //TODO: fix if IE support becomes an issue
        var total = Object.keys(surveyTemplate.questions).length - 1;
        var count = 0;
        var xmlString = '';
        for (var key = 0; key < surveyTemplate.questions.length; key++)/*in surveyTemplate.questions)*/ {
          (function (question) {
            // access question by doing surveyTemplate.questions[key].question
            // first question has already been asked, no need to ask twice
            if (key != 0) {
              // find out how the bot normalizes the question
              bot.talk({extra: true, trace: true, input: 'XNORM ' + question}, function (err, res) {
                console.log('Adding question');
                console.log(res);
                if (!err) {
                  xml.ele('category')
                    .ele('pattern', user._id + ' *')
                    .up()
                    .ele('that', normalizedQuestion)
                    .up()
                    .ele('template', question)
                      .ele('think')
                        .ele('set')
                          .att('name', surveyTemplate._id + user._id + count)
                          .ele('star');
                  normalizedQuestion = res.responses.join(' ');
                }
                count++;
                console.log('count is: ' + count);
                console.log('total is: ' + total);
                if (count > total - 1) {
                  console.log('Should work');
                  (function() {
                    xml.ele('category')
                      .ele('pattern', user._id + ' *')
                      .up()
                      .ele('that', normalizedQuestion)
                      .up()
                      // Bot signals end of conversation by sending id of survey and user id
                      .ele('template', 'Thanks for answering my questions! Enjoy the rest of your day. ' + surveyTemplate._id + user._id)
                        .ele('think')
                          .ele('set')
                            .att('name', surveyTemplate._id + user._id + count)
                            .ele('star');
                          xmlString = xml.end({pretty: true});
                        console.log();
                    console.log(xmlString);
                    fs.writeFile('botfiles/' + surveyTemplate._id + user._id + '.aiml', xmlString, function (err) {
                      if (err) {
                        console.log(err);
                      }
                      console.log('The file was saved.');
                      bot.upload('botfiles/' + surveyTemplate._id + user._id + '.aiml', function (err, res) {
                        if (!err) {
                          console.log(res);
                          bot.compile(function (err, res) {
                            if (!err) {
                              console.log('Bot ready to use.');
                              console.log(res);
                            }
                          });
                        }
                      });
                    });
                  }());
                }
              });
            }
          })(surveyTemplate.questions[key].question);
        }
      });
      //console.log(surveyTemplate.questions);
      surveyTemplate.save(function(err, surveyTemplate) {
        if(!err) {
          User.findByIdAndUpdate(
            surveyTemplate.author,
            {$push: {"surveyTemplates": surveyTemplate}},
            {safe: true, new: true},
            function(err, user) {
              if(err) {
                console.log(err);
              }
              else {
                console.log();
                console.log('Printing user...');
                console.log(user);
              }
            }
          );
        }
      });
    })
  });
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

exports.schedule = function (req, res) {
  console.log('Scheduling survey');
  console.log(req.body);
  // Save updated surveyTemplate
  SurveyTemplate.findByIdAndUpdate(req.body._id, req.body, {new: true}, function (err, surveyTemplate) {
    if (!err) {
      console.log('Survey updated successfully');
      console.log(surveyTemplate);
    } else {
      console.log('An error occured');
      console.log(err);
    }
  });
  res.send(req.body);
}

exports.sendSurveys = function () {
  var now = new Date();
  var hoursNow = now.getHours();
  var minutesNow = now.getMinutes();
  var dayNow = now.getDay();

  console.log('Sending surveys...');
  /*console.log();
  console.log('Listing all bots...');
  bot.list(function (err, res) {
    if (!err) console.log(res);
  });*/

  SurveyTemplate.find({days: dayNow})
    .where('hour').equals(hoursNow)
    .where('minute').equals(minutesNow)
    .exec(function (err, surveys) {
      if (surveys) {
        console.log('Printing all surveys for this time.');
        console.log(surveys);
        for (var i = 0; i < surveys.length; i++) {
          var survey = surveys[i];

          if (!survey.repeat) {
            SurveyTemplate.findById(
              survey._id,
              {
                daysOfTheWeek: {
                  monday: false,
                  tuesday: false,
                  wednesday: false,
                  thursday: false,
                  friday: false,
                  saturday: false,
                  sunday: false
                },
                days: []
              },
              {new: true},
              function (err, survey) {
                if (!err) {
                  console.log('Survey updated');
                  console.log(survey);
                } else {
                  console.log('Error updating survey');
                  console.log(err);
                }
            });
          }

          // Find author's clients
          User.findById(survey.author, function (err, coach) {
            console.log('The coach\'s clients are:');
            console.log(coach.clients);
            console.log('survey.selectedUsers is:');
            console.log(survey.selectedUsers);
            for (var j = 0; j < coach.clients.length; j++) {
              var clientId = coach.clients[j];
              console.log('The cliendId is:');
              console.log(JSON.stringify(clientId));
              var surveyObject = survey.toObject();
              var coachObject = coach.toObject();
              console.log();
              console.log(surveyObject.selectedUsers);
              console.log();
              console.log(coachObject.clients[j]);
              console.log();
              var shouldSend = false;
              shouldSend = _.find(surveyObject.selectedUsers, function (item) {
                return _.isEqual(item, coachObject.clients[j]);
              });
              if (shouldSend) {
                User.findById(clientId, function (err, _client) {
                    var client = _client.toObject();
                    console.log(client);
                    console.log();
                    console.log();
                    console.log('The client id is: ' + client._id)
                    console.log();
                    console.log();
                    // Initiate conversation with bot
                    bot.talk({extra: true, trace: true, client_name: client._id, input: 'XINIT ' + survey._id + client._id}, function (err, response) {
                    if (!err) {
                      console.log(response);
                      client.pandoraSessionId = response.sessionid;
                      console.log('The bot said: ' + response.responses.join(' '));
                      // Split the bot's response and send two texts to the user, to provide neater UX
                      var splitResponse = response.responses.join(' ').split('\n');
                      console.log(splitResponse);
                      twilio.sendMessage({
                        to: client.phoneNumber,
                        from: config.phoneNumbers.reminders,
                        body: splitResponse[0]
                      }, function (err, responseData) {
                        if (!err) {
                          console.log(JSON.stringify(responseData));
                          twilio.sendMessage({
                            to: client.phoneNumber,
                            from: config.phoneNumbers.reminders,
                            body: splitResponse[1]
                          }, function (err, responseData) {
                            if (!err) {
                              console.log(JSON.stringify(responseData));
                            } else {
                              console.log(err);
                            }
                          })
                        } else {
                          console.log(err);
                        }
                      });
                      _client.set(client);
                      _client.save(function (err, client) {
                        if (!err) {
                          console.log();
                          console.log('Client has been assigned a sessionid:')
                          console.log(client);
                          console.log();
                        } else {
                          console.log('An error occurred');
                          console.log(err);
                        }
                      });
                    }
                  });
                });
              }
            }
          });
        }
      }
  });
  //If survey isn't supposed to repeat set all days to false
  //TODO: for every survey to be sent at this time, start the bot talking to the client
  /*var talkParams = {
    input: 'init'
  };
  bot.talk(talkParams, function (err, res) {
    if (!err) {
      console.log(res);
      bot.talk({input: 'yes'}, function (err, res) {
        if (!err) console.log(res);
      });
    }
  });*/
}

// Every minute all day every day
var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [new schedule.Range(0, 6)];
var job = schedule.scheduleJob(rule, function() {
  exports.sendSurveys();
});
