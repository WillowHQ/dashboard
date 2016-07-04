/// <reference path="../_all.ts" />
var app;
var userSelected;
(function (app) {
    var dashboard;
    (function (dashboard) {
        var userCoach;
        var scope;
        var MainController = (function () {
            function MainController($scope, userService, $mdSidenav, $mdBottomSheet, $mdToast, $mdDialog, $mdMedia, $http) {
                this.userService = userService;
                this.$mdSidenav = $mdSidenav;
                this.$mdBottomSheet = $mdBottomSheet;
                this.$mdToast = $mdToast;
                this.$mdDialog = $mdDialog;
                this.$mdMedia = $mdMedia;
                this.$http = $http;
                this.searchText = '';
                this.tabIndex = 0;
                this.selected = null;
                this.newNote = new dashboard.Note('', null);
                this.newReminder = new dashboard.Reminder('', null);


                //this.socket = io.connect('http://107.170.21.178:3001');

                //Survey stuff
                this.questions1 = [{type: "Yes/No"},{type:"Scale from 1 to 5"},{type:"Written Answer"}];
                this.counter = 0;
                this.questionAmount = [0];
                this.selectSurveyUser = [];
                this.question = [];

                //pipelineStage array
                this.pipelineOptions = [{type: "lead"}, {type: "trail"}, {type: "active-client"}, {type: "previous-client"},{type: "archived"},{type: "NA"} ];

                //rostr stuff for selecting columns

                // this.rostr.columns =
                // [
                //   {"headerTitle" : "image", "display": false},
                //   "userName": false,
                //   "pipelineStage": false,
                //   "lastMessage": false,
                //   "lastReminder": false,
                //   "lastResponse": false,#448AFF
                //   "surveyTitle": false,
                //   "surveyStatus": false
                // ]

                var self = this;
                this.user = this.userService.get();
                userCoach = this.user;
                if (this.user.role == "user") {
                    self.selected = this.user;
                }
                else if (this.user.role == "coach") {
                    this.clients = this.user.clients;
                    //self.selected = this.clients[0];
                }
                self.userService.selectedUser = self.selected;
                userSelected = self.userService.selectedUser;
                userSelected = self.selected;
                scope = $scope;
                this._ = window['_'];

            }
            //console.log(JSON.stringify(this));
            // convertToUsers(slack: any[]) {
            //   console.log('convertToUsers: ' + this.slack);
            //   this.userService.
            // }

            //create a different controller

            MainController.prototype.setFormScope = function (scope) {
                this.formScope = scope;
            };


            MainController.prototype.anotherQuestion = function(questionNum){
              var _this = this;
              var self = this;
              this.questionAmount.push(++this.counter);
              self.openToast("Next Question");
              };

              MainController.prototype.saveSurvey = function($event){
                console.log('Inside saveSurvey');

                // Used to save the current value of 'this' for use inside callbacks further down
                var _this = this;
                var self = this;
                console.log(this.questions);

                // Set all of the responses to an empty array.
                for (var key in this.questions) {
                  this.questions[key].responses = [];
                }

                /*
                 * This loop serves two purposes: transform the questions object
                 * into a questions array, and transform some of the properties
                 * into the correct form for the backend.
                 */
                var questions = [];
                for (var key in this.questions) {
                  // Rename the 'questionHeader' property to 'header'
                  if (this.questions[key].hasOwnProperty('questionHeader')) {
                    this.questions[key].header = this.questions[key].questionHeader;
                    delete this.questions[key].questionHeader;
                  }

                  // Turn the 'type' property into the correct form for the backend
                  if (this.questions[key].type == 'Yes/No') this.questions[key].type = 'YESNO';
                  if (this.questions[key].type == 'Written Answer') this.questions[key].type = 'WRITTEN';
                  if (this.questions[key].type == 'Scale from 1 to 5') this.questions[key].type = 'SCALE';

                  // Add the current question to the questions array
                  questions.push(this.questions[key]);
                }

                // Get the data into a form the backend likes
                /*
                 * This loop serves two purposes: transform the questions object
                 * into a questions array, and transform some of the properties
                 * into the correct form for the backend.
                 */
                var questions = [];
                for (var key in this.questions) {
                  // Rename the 'questionHeader' property to 'header'
                  if (this.questions[key].hasOwnProperty('questionHeader')) {
                    this.questions[key].header = this.questions[key].questionHeader;
                    delete this.questions[key].questionHeader;
                  }

                  // Turn the 'type' property into the correct form for the backend
                  if (this.questions[key].type == 'Yes/No') this.questions[key].type = 'YESNO';
                  if (this.questions[key].type == 'Written Answer') this.questions[key].type = 'WRITTEN';
                  if (this.questions[key].type == 'Scale from 1 to 5') this.questions[key].type = 'SCALE';

                  // Add the current question to the questions array
                  questions.push(this.questions[key]);
                }

                var surveyTemplate = {
                  title: this.surveyTitle,
                  questions : questions,
                  author : this.user._id
                };

                /*
                 * Surveys are stored as a 'template' in the coach.
                 * A survey template is a survey that hasn't been assigned to a
                 * client and that has empty days, hour, and minute fields.
                 */

                 // Post the survey to the server
                _this.$http.post('/api/users/' + this.user._id + '/surveys/', surveyTemplate).then(function successCallback(response) {
                  console.log(response.data);
                  console.log(this.user);

                  // Store the survey on the client
                  self.user.surveys.push(surveyTemplate);

                //TODO add a post here to add a survey to a coach



                  console.log("reseting save!");

                  console.log("HEWGFRBHI");

                });

                // Reset the values of the form
                console.log(this.questions);
                this.questions = null;
                this.surveyTitle = null;
                this.counter = 0;
                this.questionAmount = null;
                this.questionAmount = [
                  0
                ];

                self.openToast("Survey Created");

              };

              MainController.prototype.cancelSurvey = function($event){
                var _this = this;
                var self = this;
                console.log("Cancel!");
                console.log(this.questions);
                this.questions = null;
                this.surveyTitle = null;
                this.counter = 0;
                this.questionAmount = null;
                this.questionAmount = [
                  0
                ];

                self.openToast("Cancel Survey");


              };

              MainController.prototype.toggle = function (item, list) {
                  var idx = list.indexOf(item);
                  if (idx > -1)
                      list.splice(idx, 1);
                  else
                      list.push(item);
              };
              ;
              MainController.prototype.exists = function (item, list) {
                  return list.indexOf(item) > -1;
              };
              ;
              MainController.prototype.toggleAll = function () {
                  if (this.selectSurveyUser.length === this.user.clients.length) {
                    this.selectSurveyUser = [];
                  }
                  else if (this.selectSurveyUser.length === 0 || this.selectSurveyUser.length > 0) {
                    this.selectSurveyUser = this.user.clients.slice(0);
                  }
              };
              ;
              MainController.prototype.isChecked = function () {
                  return this.selectSurveyUser.length === this.user.clients.length;
              };
              ;
              MainController.prototype.isIndeterminate = function () {
                  return (this.selectSurveyUser.length  !== 0 &&
                      this.selectSurveyUser.length  !== this.user.clients.length);
              };
              ;

              MainController.prototype.sendOutSurvey = function ($event) {
                console.log("here");
                var _this = this;
                var self = this;
                console.log("Here");
                var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'));
                this.$mdDialog.show({
                    templateUrl: './dist/view/dashboard/surveys/selectorModal.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    controller: dashboard.SurveySelectorController,
                    controllerAs: "ctrl",
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen,
                    locals: {
                      selected: null
                    }
                }).then(function (surveyInfo) {
                  console.log("this is where the survey would be sent to a single person for the time being");
                  console.log();
                  console.log('The times to receive this survey is: ');
                  console.log(surveyInfo);
                  console.log('this.selectedSurvey is: ');
                  console.log(_this.selectedSurvey);
                  _this.selectedSurvey.daysOfTheWeek = {};
                  _this.selectedSurvey.selectedDays = surveyInfo.selectedDays;
                  _this.selectedSurvey.days = [];
                  if (_this._.contains(_this.selectedSurvey.selectedDays, 'Sun')) {
                    _this.selectedSurvey.daysOfTheWeek.sunday = true;
                    _this.selectedSurvey.days.push(0);
                  }
                  if (_this._.contains(_this.selectedSurvey.selectedDays, 'Mon')) {
                    _this.selectedSurvey.daysOfTheWeek.monday = true;
                    _this.selectedSurvey.days.push(1);
                  }
                  if (_this._.contains(_this.selectedSurvey.selectedDays, 'Tues')) {
                    _this.selectedSurvey.daysOfTheWeek.tuesday = true;
                    _this.selectedSurvey.days.push(2);
                  }
                  if (_this._.contains(_this.selectedSurvey.selectedDays, 'Wed')) {
                    _this.selectedSurvey.daysOfTheWeek.wednesday = true;
                    _this.selectedSurvey.days.push(3);
                  }
                  if (_this._.contains(_this.selectedSurvey.selectedDays, 'Thurs')) {
                    _this.selectedSurvey.daysOfTheWeek.thursday = true;
                    _this.selectedSurvey.days.push(4);
                  }
                  if (_this._.contains(_this.selectedSurvey.selectedDays, 'Fri')) {
                    _this.selectedSurvey.daysOfTheWeek.friday = true;
                    _this.selectedSurvey.days.push(5);
                  }
                  if (_this._.contains(_this.selectedSurvey.selectedDays, 'Sat')) {
                    _this.selectedSurvey.daysOfTheWeek.saturday = true;
                    _this.selectedSurvey.days.push(6);
                  }
                  _this.selectedSurvey.timeOfDay = surveyInfo.time;
                  _this.selectedSurvey.hour = _this.selectedSurvey.timeOfDay.getHours();
                  _this.selectedSurvey.minute = _this.selectedSurvey.timeOfDay.getMinutes();
                  _this.selectedSurvey.repeat = surveyInfo.repeat;
                  _this.selectedSurvey.selectedUsers = [];
                  for (var i = 0; i < _this.selectSurveyUser.length; i++) {
                    _this.selectedSurvey.selectedUsers.push(_this.selectSurveyUser[i]._id);
                  }
                  console.log();
                  console.log(_this.selectedSurvey.selectedUsers);
                  console.log();
                  console.log(self.selectedSurvey);

                  // Only thing that needs changing is the time and the 'repeat' property, so:
                  var updatedSurvey = {
                    repeat: self.selectedSurvey.repeat,
                    days: self.selectedSurvey.days,
                    hour: self.selectedSurvey.timeOfDay.getHours(),
                    minute: self.selectedSurvey.timeOfDay.getMinutes()
                  };

                  //this is making me nervous
                  for (var i = 0; i < _this.selectedSurvey.selectedUsers.length; i++) {

                    var surveyUserAssign = {
                      repeat: updatedSurvey.repeat,
                      days: updatedSurvey.days,
                      hour: updatedSurvey.hour,
                      minute: updatedSurvey.minute,
                      userId: _this.selectedSurvey.selectedUsers[i],
                      surveyTemplateId: _this.selectedSurvey._id,
                      type: "survey"
                    }
                    // POST the selectedSurvey to the user

                    console.log("survey if " + surveyUserAssign.surveyTemplateId);
                    console.log("user id" + surveyUserAssign.userId);

                    //first make a object that can be turned into a object on the back end

                    self.$http.post('/api/assignment/create' , surveyUserAssign).then(function (response){
                      console.log("this sungun worked" + response.data);
                    });
                  }});








              };

              MainController.prototype.previewSurvey = function ($event) {
                console.log("here");
                var _this = this;
                var self = this;
                console.log("Here");
                console.log(this.selectedSurvey);
                var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'));
                /*this.$mdDialog.show({
                    templateUrl: './dist/view/dashboard/surveys/previewModal.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    controller: dashboard.MainController,
                    controllerAs: "vm",
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen,
                    locals: {
                      selected: null
                    }
                });*/
                this.$http.post('/api/surveyTemplate/preview', this.selectedSurvey).then(function (response) {
                  console.log('Previewing survey');
                  console.log(response.data);
                });
                console.log("here2");

              };










            MainController.prototype.addBio = function ($event) {

              var _this = this;
              var self = this;
              var bio = {
                body: this.selected.bio,
                author: this.user.id,
                assignee: this.selected.id
              }


              console.log(this.user);
              console.log(bio);
              _this.$http.post('/api/bio/create/' + bio.assignee, bio).then(function successCallback(response) {
              console.log(response.data);
              console.log(this.selected);


              });

              self.openToast("Bio Updated");

            };

            MainController.prototype.addPhoneNumber = function ($event) {
              var _this = this;
              var self = this;
              var phoneNumber = {
                number: this.selected.phoneNumber
              };
              _this.$http.post('/api/phonenumber/create/' + this.selected.id, phoneNumber).then(function (response) {

              });
              self.openToast('Phone Number Updated');
            };
            MainController.prototype.addPipelineStage = function ($event) {


              console.log(this.selected.pipelineStage);
              var _this = this;
              var self = this;
              var pipelineStage = {
                body: this.selected.pipelineStage,
                author: this.user.id,
                assignee: this.selected.id
              }


              console.log(this.user);
              console.log(pipelineStage);
              _this.$http.post('/api/pipelineStage/create/' + pipelineStage.assignee, pipelineStage).then(function successCallback(response) {
              console.log(response.data);
              console.log(this.selected);


              });

              self.openToast("Pipeline Stage Updated");

            };


            MainController.prototype.addUser = function ($event) {
                var _this = this;
                var self = this;

                var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'));
                this.$mdDialog.show({
                    templateUrl: './dist/view/dashboard/user/newUserDialog.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    controller: dashboard.AddUserDialogController,
                    controllerAs: "ctrl",
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                }).then(function (user) {
                    // Call user service
                    //console.log('this is user' + JSON.stringify(user));



                    _this.$http.post('/api/user/create', user).then(function successCallback(response) {
                      //console.log('The user\'s id is: ' + response.data.id);
                    //  console.log('The user\'s _id is: ' + response.data._id);
                      //this.user.clients.push(response.data.id);

                      if (response.data.id) {
                        console.log("done");
                        _this.$http.post('/api/coach/newuser/' + this.user.id + '?' + response.data.id,  user).then(function successCallback(client){
                          console.log("done2");
                          self.user.clients.push(response.data);
                          console.log("User created:")
                          console.log(response.data);
                          self.openToast("User added And Email Sent!");
                          _this.$http.post('api/facebook/email/', user).then(function successCallback(response) {
                            console.log("email done!");
                            //console.log(response);
                          });
                        });
                      } else {
                        self.openToast('User not added. ' + response.data.errors.password.message);
                      }

                    });
                }, function () {
                    console.log('You cancelled the dialog.');
                });
            };

            MainController.prototype.addOrUploadUser = function ($event) {
              var _this = this;
              var self = this;

              var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'));
              this.$mdDialog.show({
                templateUrl: './dist/view/dashboard/user/newOrUploadUserDialog.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                controller: dashboard.AddOrUploadUserDialogController,
                controllerAs: "ctrl",
                clickOutsideToClose: true,
                fullscreen: useFullScreen
              }).then(function (option) {
                if (option.add) {
                  console.log('You wish to add a new user.');
                  _this.addUser($event);
                } else if (option.upload) {
                  console.log('You wish to upload a list of existing users.');
                  _this.uploadUsers($event);
                } else {
                  console.log('You wish to add a user through facebook.');
                  _this.addUserThroughFacebook($event);
                }
              }, function () {
                console.log('You cancelled the dialog.');
              });
            };

            MainController.prototype.addUserThroughFacebook = function ($event) {
              var _this = this;
              var self = this;
              console.log('Begin addUserThroughFacebook');
              console.log(_this.user);
              FB.ui({
                method: 'apprequests',
                message: 'Welcome to FitPath!'
              }, function (_response) {
                console.log(_response);
                // Loop through all ids in _response.to
                // This code is vomit-inducing. Blame Facebook.
                for (var i = 0; i < _response.to.length; i++) {
                  _this.$http.get('/api/facebook/getprofile/' + _response.to[i] + '/' + _this.user.providerData.accessToken).then(function (response) {
                    console.log(response);
                    var user = response.data;
                    user.coaches = _this.user._id;
                    _this.$http.post('/api/user/create', user).then(function (__response) {
                        _this.$http.post('/api/coach/newuser/' + this.user.id + '?' + __response.data.id, user).then(function (client) {
                          console.log("Here fb");
                          self.user.clients.push(__response.data);
                        });
                    });
                  });
                }
              });
            };

            MainController.prototype.uploadUsers = function ($event) {
              var _this = this;
              var self = this;
              var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'));
              this.$mdDialog.show({
                templateUrl: './dist/view/dashboard/user/uploadUsersDialog.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                controller: dashboard.UploadUserDialogController,
                controllerAs: 'ctrl',
                clickOutsideToClose: true,
                fullscreen: useFullScreen
              }).then(function (userList) {
                // Post to parser
                _this.$http.post('/api/user/parse-csv', {textToParse: userList}).then(function (response) {
                  // Post to backend
                  var avatars = [
                    'ashley.png', 'james.png', 'jenn.png', 'jo.png', 'john.png', 'julie.png', 'mamajess.png', 'sharon.png'
                  ];
                  for (var i = 0; i < response.data.length; i++) {
                    var user = {
                      firstName: response.data[i][0],
                      lastName: response.data[i][1],
                      bio: response.data[i][2],
                      username: response.data[i][3],
                      password: response.data[i][4],
                      slack_id: response.data[i][5],
                      slack: {
                        email: response.data[i][6],
                        id: response.data[i][7],
                        name: response.data[i][8],
                        real_name: response.data[i][9],
                        img: '/assets/img/' + avatars[Math.floor(Math.random() * 7)]
                      },
                      coaches: _this.user._id,
                      imgUrl: '/assets/img' + avatars[Math.floor(Math.random() * 7)],
                      phoneNumber: response.data[i][10]
                    };
                    _this.$http.post('/api/user/create', user).then(function (response) {
                      _this.$http.post('/api/coach/newuser/' + this.user.id + '?' + response.data.id, user).then(function (client) {
                        self.user.clients.push(response.data);
                      });
                    });
                  }
                });
              }, function () {
                console.log('You cancelled the dialog.');
              });
            };


            MainController.prototype.addReminder = function ($event) {
                console.log("Hey, Im a reminder");
                var _this = this;
                var self = this;
                var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'));
                this.$mdDialog.show({
                    templateUrl: './dist/view/dashboard/reminders/modal.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    controller: dashboard.ReminderController,
                    controllerAs: "ctrl",
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen,
                    locals: {
                        selected: null
                    }
                }).then(function (reminder) {
                    console.log(reminder);


                    var reminderSent = {
                      body: reminder.title,
                      author : this.user._id,
                      assignee : reminder.assignee

                      // title:reminder.title.slice(0,7),
                      // questions:[{
                      //   type: "WRITTEN",
                      //   header: reminder.title.slice(0,7),
                      //   question: reminder.title
                      // }],
                    };
                    console.log(reminderSent);
                    console.log('here');
                    _this.$http.post('/api/reminder/create', reminderSent).then(function successCallback(responseReminder) {
                        console.log(responseReminder.data);

                        var surveyUserAssign = {
                          repeat: true,
                          days: reminder.days,
                          hour: reminder.hour,
                          minute: reminder.minute,
                          userId: reminder.assignee,
                          reminderId:responseReminder.data._id,
                          type: "reminder"
                        }
                        // POST the selectedSurvey to the user

                        console.log("survey if " + surveyUserAssign.reminderId);
                        console.log("user id" + surveyUserAssign.userId);
                        self.selected.reminders.push(responseReminder.data);
                        //first make a object that can be turned into a object on the back end
                        self.$http.post('/api/user/reminder/add', responseReminder.data).then(function(responseUser){
                          console.log(responseUser);

                          // self.$http.post('/api/assignment/create' , surveyUserAssign).then(function (responseAssignment){
                          //   console.log("this sungun worked" + response.data);
                          //
                          //   //self.selected.assignments.push(response.data);
                          //
                          // });

                        });


                        //reminders now need adding to the front-end md-cards



                    });

                    self.openToast("Reminder added");
                }, function () {
                    console.log('You cancelled the dialog.');
                });
            };

            MainController.prototype.addNote = function ($event) {

              var _this = this;
              var self = this;
              console.log(this.user);
              var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'));
              this.$mdDialog.show({
                  templateUrl: './dist/view/dashboard/notes/noteModal.html',
                  parent: angular.element(document.body),
                  targetEvent: $event,
                  controller: dashboard.NoteController,
                  controllerAs: "ctrl",
                  clickOutsideToClose: true,
                  fullscreen: useFullScreen,
                  locals: {
                      selected: null
                  }
              }).then(function (note) {
                  console.log(note);


                  _this.$http.post('/api/note/create', note).then(function successCallback(response) {
                      console.log(response);
                      self.selected.notes.push(response.data);
                  });

                  self.openToast("Note added");
              }, function () {
                  console.log('You cancelled the dialog.');

              });
            };





            MainController.prototype.editReminder = function ($event, reminder) {
                var _this = this;
                console.log('main controller edit reminder');
                console.log(reminder);
                var self = this;
                var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'));
                this.$mdDialog.show({
                    templateUrl: './dist/view/dashboard/reminders/modal.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    controller: dashboard.ReminderController,
                    controllerAs: "ctrl",
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen,
                    locals: {
                        selected: reminder
                    }
                }).then(function (reminder) {
                    console.log(reminder);
                    console.log(userSelected);

                    // Put request, and push onto users local list of reminders
                    // this.$http.post('uri').then((response) => response.data)
                    // after promise is succesful add to
                    // reminder.assigne.reminders.push()
                    _reminder = reminder;
                    _this.$http.put('/api/users/' + self.selected._id + '/surveys/' +  reminder._id, reminder).then(function successCallback(reminder) {
                        console.log('returned junk: ' + JSON.stringify(reminder.data));
                        for (var i = 0; i < reminder.data.surveys.length; i++) {
                          if (reminder.data.surveys[i]._id == _reminder._id) {
                            _reminder.questions = reminder.data.surveys[i].questions;
                          }
                        }
                        //  self.selected.reminders.push(response.data);
                        if (self.updateReminder(_reminder)) {
                            /*if (reminder.data.parent.id) {
                                var id = reminder.data.parent.id.slice(1, 25);
                                self.updateReminderInSurvey(id, reminder.data);
                            }*/
                            self.openToast("Reminder Edited");
                        }
                        else {
                            self.openToast("Reminder Not Found!");
                        }
                    });
                }, function () {
                    console.log('You cancelled the dialog.');
                });
            };
            MainController.prototype.removeReminder = function ($event, reminder) {
                var _this = this;
                var confirm = this.$mdDialog.confirm()
                    .textContent('Are you sure you want to remove this reminder?')
                    .ariaLabel('Remove')
                    .targetEvent($event)
                    .ok('Yes')
                    .cancel('No');
                var self = this;
                this.$mdDialog.show(confirm).then(function (result) {
                    console.log(reminder);
                    if (result) {
                        console.log('removing reminder id: ' + reminder._id);
                        _this.$http.delete('/api/users/' + self.selected._id + '/surveys/' + reminder._id, reminder)
                            .then(function successCallback(success) {
                            if (success) {
                                console.log(success);
                                self.deleteReminder(reminder);
                            }
                            else {
                            }
                        });
                    }
                    else {
                    }
                    self.openToast("Reminder Removed.");
                });
            };

            MainController.prototype.updateUser = function (user) {
              console.log('Inside updateUser');
              if (userSelected._id == user._id) {
                console.log('Should be updating user');
                userSelected = user;
                userSelected.surveys = user.surveys;
              }
              console.log(userSelected);
              console.log(self.selected);
              console.log(this.selected);
              scope.$apply();
            };

            MainController.prototype.updateReminder = function (reminder) {
                console.log('Inside updateReminder');
                console.log(userSelected.reminders);
                console.log(reminder);
                for (var i = 0; i < userSelected.reminders.length; i++) {
                    if (reminder._id == userSelected.reminders[i]._id) {
                        userSelected.reminders[i] = reminder;
                        console.log(userSelected.reminders);
                        console.log('Look ma, an update!');
                        return true;
                        scope.$apply();
                    }
                }
                return false;
            };
            MainController.prototype.deleteReminder = function (reminder) {
                this.selected.reminders = _.without(this.selected.reminders, reminder);
                /*var foundIndex = this.selected.reminders.indexOf(reminder);
                this.selected.reminders.splice(foundIndex, 1);*/
            };
            MainController.prototype.slackList = function () {
                // var test = this.userService.slack().then((members: any) => {
                //   console.log('here');
                //   console.log(members);
                // });
            };
            MainController.prototype.testButton = function (email, slack) {
                console.log('test-button');
                var test = this.userService.create(email, slack)
                    .then(function (result) {
                    console.log(result);
                }, function (err) {
                    console.log(err);
                });
            };
            // removeReminder(reminder) {
            //   var foundIndex = this.selected.reminders.indexOf(reminder);
            //   this.selected.reminders.splice(foundIndex, 1);
            //   this.openToast("Reminder removed");
            // }
            MainController.prototype.clearReminders = function ($event) {
                var confirm = this.$mdDialog.confirm()
                    .title('Are you sure you want to delete all reminders?')
                    .textContent('All reminders will be deleted, you can\'t undo this action.')
                    .ariaLabel('Delete all reminders')
                    .targetEvent($event)
                    .ok('Yes')
                    .cancel('No');
                var self = this;
                this.$mdDialog.show(confirm).then(function () {
                    self.selected.reminders = [];
                    self.openToast("Cleared reminders");
                });
            };







            MainController.prototype.removeNote = function ($event, note) {

              var _this = this;
              var confirm = this.$mdDialog.confirm()
                  .textContent('Are you sure you want to remove this note?')
                  .ariaLabel('Remove')
                  .targetEvent($event)
                  .ok('Yes')
                  .cancel('No');
              var self = this;
              this.$mdDialog.show(confirm).then(function (result) {
              console.log(note);
              console.log(result);
              if (result) {
                _this.$http.post('/api/note/remove/' + note._id, note)
                  .then(function successCallback(success) {
                    if (success) {
                      console.log(success);
                      self.deleteNote(note);
                    }
                    else {
                    }
                  });
              }
              else {
              }
              self.openToast("Note Removed.");

              });

            };

            MainController.prototype.deleteNote = function (note) {
              this.selected.notes = _.without(this.selected.notes, note);

            };

            MainController.prototype.sendMessage = function (message) {
              var _this = this;
              console.log('Begin submit');
              console.log('this.selected: ' + JSON.stringify(this.selected));
              this.$http.post('/api/message/sendsms/', {'body': message, 'sentBy': this.selected.coaches[0], 'sentTo': this.selected.id}).then(function (response) {
                console.log('response.data is ' + JSON.stringify(response.data));
                //console.log('_this.selected.messages is: ' + JSON.stringify(_this.selected.messages));
                console.log(_this.selected.messages); // Why is this undefined?
                _this.selected.messages.push(response.data);
                console.log('self.selected is:' + JSON.stringify(_this.selected.messages));
              });
            };

            MainController.prototype.sendFB = function (message) {
              /*var _this = this;
              console.log('Begin submit');
              console.log('this.selected: ' + JSON.stringify(this.selected));
              this.$http.post('/api/message/sendfb/', {'body': message, 'sentBy': this.selected.coaches[0], 'sentTo': this.selected.id}).then(function (response) {
                console.log('response.data is ' + JSON.stringify(response.data));
                console.log(_this.selected.messages);
                _this.selected.messages.push(response.data);
                console.log('self.selected is: ' + JSON.stringify(_this.selected.messages));
              });*/
            };

            // socket.io code ahead
            /*responseSocket.on('response', function (response) {
              console.log('Server sent a reminder response');
              MainController.prototype.updateReminder(response);
            });*/

            responseSocket.on('response', function (response) {
              console.log('Server sent a survey response');
              MainController.prototype.updateReminder(response);
            });

            messageSocket.on('message', function (message) {
              console.log('Server sent a message');
              MainController.prototype.receiveMessage(message);
            });/*function (message) {
              console.log(this.selected);
              console.log('Message received from server');
              console.log(message);
              if (this.selected) {
                console.log(this.selected._id);
                if (this.selected._id == message.sentBy) {
                  console.log('Message pushed.');
                  this.selected.messages.push(message);
                }
              }
            });*/

            MainController.prototype.receiveMessage = function (message) {
              console.log('userSelected is: ' + JSON.stringify(userSelected));
              console.log('Message received from server');
              console.log(message);
              //if (this.selected) {
                if (userSelected._id === message.sentBy) {
                  console.log('Message pushed.');
                  userSelected.messages.push(message);
                  scope.$apply();
                }
              //}
            };

            MainController.prototype.editNote = function($event, note){
              console.log("TETETT");
              var _this = this;
              var self = this;
              console.log(note);
              var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'));
              this.$mdDialog.show({
                  templateUrl: './dist/view/dashboard/notes/noteModal.html',
                  parent: angular.element(document.body),
                  targetEvent: $event,
                  controller: dashboard.NoteController,
                  controllerAs: "ctrl",
                  clickOutsideToClose: true,
                  fullscreen: useFullScreen,
                  locals:{
                      selected: note
                  }
                }).then(function (note) {
                  console.log('updating note: ' + note.body);

                  _this.$http.post('/api/note/update/' + note._id, note).then(function successCallback(note) {
                      console.log('returned junk: ' + JSON.stringify(note.data._id));
                      //  self.selected.reminders.push(response.data);
                      if (self.updateNote(note.data)) {
                          /*if (reminder.data.parent.id) {
                              var id = reminder.data.parent.id.slice(1, 25);
                              self.updateReminderInSurvey(id, reminder.data);
                          }*/
                          self.openToast("Note Edited");
                      }
                      else {
                          self.openToast("Note Not Found!");
                      }
                  });
                },function () {
                    console.log('You cancelled the dialog.');
                });
            };
            MainController.prototype.updateNote = function(note){
              console.log('Inside note');
              console.log(userSelected.notes);
              console.log(note);
              for (var i = 0; i < userSelected.notes.length; i++) {
                  if (note._id == userSelected.notes[i]._id) {
                      userSelected.notes[i] = note;
                      console.log(userSelected.notes);
                      console.log('Look ma, an update!');

                      return true;
                  }
              }
              return false;



            };




            MainController.prototype.clearNotes = function ($event) {
                var confirm = this.$mdDialog.confirm()
                    .title('Are you sure you want to delete all notes?')
                    .textContent('All notes will be deleted, you can\'t undo this action.')
                    .ariaLabel('Delete all notes')
                    .targetEvent($event)
                    .ok('Yes')
                    .cancel('No');
                var self = this;
                this.$mdDialog.show(confirm).then(function () {
                    self.selected.notes = [];
                    self.openToast("Cleared notes");
                });
            };

            /*
            MainController.prototype.addSurvey = function ($event) {
                var _this = this;
                var self = this;
                console.log('addSurvey()');
                var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'));
                this.$mdDialog.show({
                    templateUrl: './dist/view/dashboard/survey/modal.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    controller: dashboard.SurveyController,
                    controllerAs: "vm",
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen,
                    locals: {
                        selected: null
                    }
                }).then(function (survey) {
                    // Post request, and push onto users local list of reminders
                    // this.$http.post('uri').then((response) => response.data)
                    // after promise is succesful add to
                    // reminder.assigne.reminders.push()
HI Shane!                    console.log(survey);
                    _this.$http.post('/api/survey', survey).then(function successCallback(survey) {
                        self.selected.surveys.push(survey.data);
                        console.log(survey.data);
                        for (var i = 0; i < survey.data.goals.length; i++) {
                            self.selected.reminders.push(survey.data.goals[i].reminder);
                        }
                    });
                    self.openToast("Survey added");
                }, function () {
                    console.log('You cancelled the dialog.');
                });
            };
            */

            MainController.prototype.editSurvey = function ($event, survey) {
                var _this = this;
                var self = this;
                var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'));
                this.$mdDialog.show({
                    templateUrl: './dist/view/dashboard/surveys/modal.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    controller: dashboard.SurveyController,
                    controllerAs: "vm",
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen,
                    locals: {
                        selected: survey
                    },
                }).then(function (survey) {
                    _this.$http.post('/api/survey/' + survey._id, survey).then(function successCallback(survey) {
                        //  self.selected.reminders.push(response.data);
                        console.log('survey edited');
                        console.log(survey);
                        if (self.updateSurvey(survey.data)) {
                            self.openToast("Survey Edited");
                        }
                        else {
                            self.openToast("Survey Not Found!");
                        }
                    });
                    console.log(survey);
                }, function () {
                    console.log('You cancelled the dialog.');
                });
            };
            MainController.prototype.removeSurvey = function ($event, survey) {
                var _this = this;
                var self = this;
                var confirm = this.$mdDialog.confirm()
                    .textContent('Are you sure you want to remove this reminder?')
                    .ariaLabel('Remove')
                    .targetEvent($event)
                    .ok('Yes')
                    .cancel('No');
                this.$mdDialog.show(confirm).then(function (result) {
                    console.log(survey);
                    if (result) {
                        console.log(result);
                        _this.$http.post('/api/survey/remove/' + survey._id, survey)
                            .then(function successCallback(success) {
                            if (success) {
                                console.log('success');
                                console.log(success);
                                console.log('survey');
                                console.log(survey);
                                self.deleteSurvey(survey);
                            }
                            else {
                            }
                        });
                    }
                    else {
                    }
                    self.openToast("Reminder Removed.");
                });
            };
            MainController.prototype.updateSurvey = function (survey) {
                // Update Survey's Reminders
                for (var i = 0; i < survey.goals.length; i++) {
                    this.updateReminder(survey.goals[i].reminder);
                }
                // Find Matching Id's, Replace whole object
                for (var i = 0; i < this.selected.surveys.length; i++) {
                    if (survey._id == this.selected.surveys[i]._id) {
                        this.selected.surveys[i] = survey;
                        return true;
                    }
                }
                return false;
            };
            MainController.prototype.updateReminderInSurvey = function (surveyId, reminder) {
                for (var i = 0; i < this.selected.surveys.length; i++) {
                    if (surveyId == this.selected.surveys[i]._id) {
                        // Update Reminder
                        for (var k = 0; k < this.selected.surveys[i].goals.length; k++) {
                            if (this.selected.surveys[i].goals[k].reminder._id == reminder._id) {
                                this.selected.surveys[i].goals[k].reminder = reminder;
                            }
                        }
                    }
                }
            };
            MainController.prototype.deleteSurvey = function (survey) {
                var index;
                console.log(survey);
                for (var i = 0; i < survey.goals.length; i++) {
                    index = this.selected.reminders.indexOf(survey.goals[i].reminder);
                    this.selected.reminders.splice(index, 1);
                }
                index = this.selected.surveys.indexOf(survey);
                console.log(index);
                this.selected.surveys.splice(index, 1);
            };
            MainController.prototype.openToast = function (message) {
                this.$mdToast.show(this.$mdToast.simple()
                    .textContent(message)
                    .position('top right')
                    .hideDelay(5000));
            };



            MainController.prototype.tester = function () {
              console.log("hey im here");
              this.$mdSidenav('left').toggle();
            };




            MainController.prototype.toggleList = function () {
                console.log("hey im here");
                this.$mdSidenav('left').toggle();
            };




            MainController.prototype.selectUser = function (user) {
                this.selected = user;
                this.userService.selectedUser = this.selected;
                userSelected = user;
                var sidebar = this.$mdSidenav('left');
                if (sidebar.isOpen()) {
                    sidebar.close();
                }
                this.tabIndex = 0;
            };

            MainController.prototype.isCoach = function (user) {

                if(user) {
                  if(user.role){
                    if (user && user.role && user.role == "coach") {
                        return true;
                    }
                }


                return false;
              }
            };

            MainController.prototype.popUp = function(){
              console.log("IT WORKED!")
            }











            MainController.prototype.showContactOptions = function ($event) {
                this.$mdBottomSheet.show({
                    parent: angular.element(document.getElementById('wrapper')),
                    templateUrl: './dist/view/dashboard/contactSheet.html',
                    controller: dashboard.DashboardController,
                    controllerAs: "cp",
                    bindToController: true,
                    targetEvent: $event
                }).then(function (clickedItem) {
                    clickedItem && console.log(clickedItem.name + ' clicked!');
                });
            };
            MainController.$inject = ['$scope', 'userService', '$mdSidenav', '$mdBottomSheet',
                '$mdToast', '$mdDialog', '$mdMedia', '$http'];
            return MainController;
        }());
        dashboard.MainController = MainController;
    })(dashboard = app.dashboard || (app.dashboard = {}));
})(app || (app = {}));
//# sourceMappingURL=mainController.js.map
