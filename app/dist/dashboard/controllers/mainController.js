/// <reference path="../_all.ts" />
var app;
(function (app) {
    var dashboard;
    (function (dashboard) {
        var userSelected;
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

                //this.socket = io.connect('http://localhost:3001');



                //this.questions = [1, 2, 3, 4, 5];



                //Survey Stuff
                this.first = true;
                this.second = false;
                this.third = false;
                this.four = false;
                this.fifth = false;

                var self = this;
                this.user = this.userService.get();
                if (this.user.role == "user") {
                    self.selected = this.user;
                }
                else if (this.user.role == "coach") {
                    this.clients = this.user.clients;
                    self.selected = this.clients[0];
                }
                self.userService.selectedUser = self.selected;
                userSelected = self.userService.selectedUser;
                scope = $scope;
                this._ = window['_'];

            }
            //console.log(JSON.stringify(this));
            // convertToUsers(slack: any[]) {
            //   console.log('convertToUsers: ' + this.slack);
            //   this.userService.
            // }

            //create a different controller
            MainController.prototype.createSurvey = function($event){
              console.log("here");

            };



            MainController.prototype.setFormScope = function (scope) {
                this.formScope = scope;
            };


            MainController.prototype.anotherQuestion = function($event){
              var _this = this;
              var self = this;
              if(this.first){
                this.first = false;
                this.second = true;
                self.openToast("Next Question");
              }
              else if(this.second){
                this.second = false;
                this.third = true;
                self.openToast("Next Question");
              }
              else if(this.third){
                this.third = false;
                this.fourth = true;
                self.openToast("Next Question");
              }
              else if(this.fourth){
                this.fourth = false;
                this.fifth = true;
                self.openToast("Next Question");
              }

            }

            MainController.prototype.saveSurvey = function($event){

            }

















            //not used
            MainController.prototype.buildSurvey = function($event){
              var _this = this;
              var self = this;
              console.log("Here");
              var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'));
              this.$mdDialog.show({
                  templateUrl: './dist/view/dashboard/surveyBuilder/surveyBuilderModal.html',
                  parent: angular.element(document.body),
                  targetEvent: $event,
                  controller: dashboard.SurveyBuilderController,
                  controllerAs: "ctrl",
                  clickOutsideToClose: true,
                  fullscreen: useFullScreen,
                  locals: {
                    selected: null
                  }
              }).then(function (survey) {
                console.log("this is where the survey would be sent to a single person for the time being");


              });
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
                          self.openToast("User added");
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
              }).then(function (add) {
                if (add) {
                  console.log('You wish to add a new user.');
                  _this.addUser($event);
                } else {
                  console.log('You wish to upload a list of existing users.');
                  _this.uploadUsers($event);
                }
              }, function () {
                console.log('You cancelled the dialog.');
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
                    // Post request, and push onto users local list of reminders
                    // this.$http.post('uri').then((response) => response.data)
                    // after promise is succesful add to
                    // reminder.assigne.reminders.push()

                    _this.$http.post('/api/reminder/create', reminder).then(function successCallback(response) {
                        self.selected.reminders.push(response.data);
                        console.log(response.data);
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
                    // Post request, and push onto users local list of reminders
                    // this.$http.post('uri').then((response) => response.data)
                    // after promise is succesful add to
                    // reminder.assigne.reminders.push()
                    _this.$http.post('/api/reminder/' + reminder._id, reminder).then(function successCallback(reminder) {
                        //  self.selected.reminders.push(response.data);
                        if (self.updateReminder(reminder.data)) {
                            if (reminder.data.parent.id) {
                                var id = reminder.data.parent.id.slice(1, 25);
                                self.updateReminderInSurvey(id, reminder.data);
                            }
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
                        _this.$http.post('/api/reminder/remove/' + reminder._id, reminder)
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

            MainController.prototype.updateReminder = function (reminder) {
                console.log(this.selected.reminders);
                for (var i = 0; i < this.selected.reminders.length; i++) {
                    if (reminder._id == this.selected.reminders[i]._id) {
                        this.selected.reminders[i] = reminder;
                        return true;
                    }
                }
                return false;
            };
            MainController.prototype.deleteReminder = function (reminder) {
                var foundIndex = this.selected.reminders.indexOf(reminder);
                this.selected.reminders.splice(foundIndex, 1);
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
                var note = this.selected.notes.indexOf(note);
                this.selected.notes.splice(foundIndex, 1);
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
              var _this = this;
              console.log('Begin submit');
              console.log('this.selected: ' + JSON.stringify(this.selected));
              this.$http.post('/api/message/sendfb/', {'body': message, 'sentBy': this.selected.coaches[0], 'sentTo': this.selected.id}).then(function (response) {
                console.log('response.data is ' + JSON.stringify(response.data));
                console.log(_this.selected.messages);
                _this.selected.messages.push(response.data);
                console.log('self.selected is: ' + JSON.stringify(_this.selected.messages));
              });
            };

            // socket.io code ahead
            socket.on('message', function (message) {
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
              var _this = this;
              var self = this;
              console.log(note);
              var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'));
              this.$mdDialog.show({
                  templateUrl: './dist/view/dashboard/notes/tab-notes-form-edit.html',
                  parent: angular.element(document.body),
                  targetEvent: $event,
                  controller: dashboard.NoteController,
                  controllerAs: "ctrl",
                  clickOutsideToClose: true,
                  fullscreen: useFullScreen

                }).then(function (note) {
                    console.log("Herer ethsi sa");
                  });


                      // Post request, and push onto users local list of reminders
                      // this.$http.post('uri').then((response) => response.data)
                      // after promise is succesful add to
                  //     // reminder.assigne.reminders.push()
                  //     _this.$http.post('/api/reminder/' + reminder._id, reminder).then(function successCallback(reminder) {
                  //         //  self.selected.reminders.push(response.data);
                  //         if (self.updateReminder(reminder.data)) {
                  //             if (reminder.data.parent.id) {
                  //                 var id = reminder.data.parent.id.slice(1, 25);
                  //                 self.updateReminderInSurvey(id, reminder.data);
                  //             }
                  //             self.openToast("Reminder Edited");
                  //         }
                  //         else {
                  //             self.openToast("Reminder Not Found!");
                  //         }
                  //     });
                  // }, function () {
                  //     console.log('You cancelled the dialog.');
                  // });
                  //.then(function (reminder) {
                  // Post request, and push onto users local list of reminders
                  // this.$http.post('uri').then((response) => response.data)
                  // after promise is succesful add to
              /*    // reminder.assigne.reminders.push()
                  _this.$http.post('/api/reminder/' + reminder._id, reminder).then(function successCallback(reminder) {
                        //  self.selected.reminders.push(response.data);
                      if (self.updateReminder(reminder.data)) {
                          if (reminder.data.parent.id) {
                              var id = reminder.data.parent.id.slice(1, 25);
                              self.updateReminderInSurvey(id, reminder.data);
                          }
                          self.openToast("Reminder Edited");
                      }
                      else {
                          self.openToast("Reminder Not Found!");
                      }
                  });
              }, function () {
                  console.log('You cancelled the dialog.');
              });
              */
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
                    console.log(survey);
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
            MainController.prototype.toggleList = function () {
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
            MainController.prototype.hasReal = function (user) {
              //  console.log(user);
              //  console.log(user.slack);
                if (user.slack.real_name) {
                    return true;
                }
                else {
                    return false;
                }
            };
            MainController.prototype.isCoach = function (user) {
                if (user.role == "coach") {
                    return true;
                }
                else {
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
