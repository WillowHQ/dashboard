/// <reference path="../_all.ts" />
var app;
(function (app) {
    var dashboard;
    (function (dashboard) {
        var ReminderController = (function () {
            function ReminderController($mdDialog, userService, selected) {
                this.$mdDialog = $mdDialog;
                this.userService = userService;
                this.selected = selected;
                this.response = "";
                this.days = [0, 1, 2, 3, 4, 5, 6];
                // Used for the rendering of the checkboxes
                this.dayNames = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
                // Used to look up the name of a property in the daysOfTheWeek object by array index
                this.daysOfTheWeekNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                // Default values for the add reminder modal
                this.daysOfTheWeek = {
                  sunday: false,
                  monday: false,
                  tuesday: false,
                  wednesday: false,
                  thursday: false,
                  friday: false,
                  saturday: false
                };
                this.selectedDays = [];
                this.author = this.userService.get();
                if (this.author.role == "coach") {
                    this.author = this.author.id;
                    this.assignee = this.userService.selectedUser;
                    this.assignee = this.assignee._id;
                }
                else if (this.author.role == "user") {
                    this.author = this.author.id;
                    this.assignee = this.author;
                }
                if (selected) {
                  console.log(selected);
                    this._id = selected._id;
                        this.daysOfTheWeek = selected.daysOfTheWeek;
                        this.reminder = selected.title;
                        this.responses = selected.responses;
                        this.time = new Date(selected.timeOfDay);
                }
            }
            // selectedDays reminder
            ReminderController.prototype.toggle = function (index) {
              var dayName = this.daysOfTheWeekNames[index];
              this.daysOfTheWeek[dayName] = !this.daysOfTheWeek[dayName];
            };

            ReminderController.prototype.isChecked = function (index) {
              var dayName = this.daysOfTheWeekNames[index];
              return this.daysOfTheWeek[dayName];
            };

            ReminderController.prototype.toggleAll = function () {
              // If all of the checkboxes are toggled on...
              if (this.daysOfTheWeek.sunday    &&
                  this.daysOfTheWeek.monday    &&
                  this.daysOfTheWeek.tuesday   &&
                  this.daysOfTheWeek.wednesday &&
                  this.daysOfTheWeek.thursday  &&
                  this.daysOfTheWeek.friday    &&
                  this.daysOfTheWeek.saturday) {
                // Toggle all of them off
                this.daysOfTheWeek.sunday = false;
                this.daysOfTheWeek.monday = false;
                this.daysOfTheWeek.tuesday = false;
                this.daysOfTheWeek.wednesday = false;
                this.daysOfTheWeek.thursday = false;
                this.daysOfTheWeek.friday = false;
                this.daysOfTheWeek.saturday = false;
              } else {
                // Otherwise, toggle all of them on
                this.daysOfTheWeek.sunday = true;
                this.daysOfTheWeek.monday = true;
                this.daysOfTheWeek.tuesday = true;
                this.daysOfTheWeek.wednesday = true;
                this.daysOfTheWeek.thursday = true;
                this.daysOfTheWeek.friday = true;
                this.daysOfTheWeek.saturday = true;
              }
            };

            ReminderController.prototype.isAllChecked = function () {
                return this.daysOfTheWeek.sunday    &&
                       this.daysOfTheWeek.monday    &&
                       this.daysOfTheWeek.tuesday   &&
                       this.daysOfTheWeek.wednesday &&
                       this.daysOfTheWeek.thursday  &&
                       this.daysOfTheWeek.friday    &&
                       this.daysOfTheWeek.saturday;
            };

            ReminderController.prototype.isIndeterminate = function () {
              // If all are true or all are false, isIndeterminate returns false
              // Otherwise, isIndeterminate returns true
              // While I could just invert the boolean returned by the expression, I feel this more strongly conveys my intent
              if    ((this.daysOfTheWeek.sunday    &&
                      this.daysOfTheWeek.monday    &&
                      this.daysOfTheWeek.tuesday   &&
                      this.daysOfTheWeek.wednesday &&
                      this.daysOfTheWeek.thursday  &&
                      this.daysOfTheWeek.friday    &&
                      this.daysOfTheWeek.saturday) ||
                    (!this.daysOfTheWeek.sunday    &&
                     !this.daysOfTheWeek.monday    &&
                     !this.daysOfTheWeek.tuesday   &&
                     !this.daysOfTheWeek.wednesday &&
                     !this.daysOfTheWeek.thursday  &&
                     !this.daysOfTheWeek.friday    &&
                     !this.daysOfTheWeek.saturday)) {
                       return false
                     } else {
                       return true;
                     }
            };

            ReminderController.prototype.select = function () {
            };
            ReminderController.prototype.close = function () {
                this.$mdDialog.cancel();
            };
            ReminderController.prototype.save = function () {
                //console.log("r" + this.selected);
                //console.log("hello select: " +this.selected.responses);
                console.log(this.time);
                var dates = {
                    monday: false,
                    tuesday: false,
                    wednesday: false,
                    thursday: false,
                    friday: false,
                    saturday: false,
                    sunday: false
                };

                var days = [];
                var hour = this.time.getHours();
                var minute = this.time.getMinutes();


                if (this.daysOfTheWeek.sunday) {
                    dates.sunday = true;
                    days.splice(this.days.length,0,0);
                }
                if (this.daysOfTheWeek.monday) {
                    dates.monday = true;
                    days.splice(this.days.length,0,1);
                }
                if (this.daysOfTheWeek.tuesday) {
                    dates.tuesday = true;
                    days.splice(this.days.length,0,2);
                }
                if (this.daysOfTheWeek.wednesday) {
                    dates.wednesday = true;
                    days.splice(this.days.length,0,3);
                }
                if (this.daysOfTheWeek.thursday) {
                    dates.thursday = true;
                    days.splice(this.days.length,0,4);
                }
                if (this.daysOfTheWeek.friday) {
                    dates.friday = true;
                    days.splice(this.days.length,0,5);
                }
                if (this.daysOfTheWeek.saturday) {
                    dates.saturday = true;
                    days.splice(this.days.length,0,6);
                }
                var reminder = {
                    _id: this._id,
                    title: this.reminder,
                    days: days,

                    // Will this be set to server time or user's local time?
                    //toLocaleTimeString(),
                    timeOfDay: this.time,
                    hour: hour,
                    minute: minute,
                    selectedDates: this.selectedDays,
                    daysOfTheWeek: this.daysOfTheWeek,
                    author: this.author,
                    assignee: this.assignee,
                    responses: this.responses

                };

                console.log('check time');
                console.log(reminder.timeOfDay);
                console.log('check assingee');
                console.log(reminder);
                //console.log(reminder);
                this.$mdDialog.hide(reminder);
            };
            ReminderController.$inject = ['$mdDialog', 'userService', 'selected'];
            return ReminderController;
        }());
        dashboard.ReminderController = ReminderController;
    })(dashboard = app.dashboard || (app.dashboard = {}));
})(app || (app = {}));
//# sourceMappingURL=reminderController.js.map
