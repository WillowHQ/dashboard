var app;
(function (app) {
    var dashboard;
    (function (dashboard) {
        var SurveySelectorController = (function () {
            function SurveySelectorController($mdDialog, userService, $http) {
                this.$mdDialog = $mdDialog;
                this.userService = userService;
                this.$http = $http;
                this.days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
                this.selectedDays = [];
                this.author = this.userService.get();
                if (this.author.role == "coach") {
                    this.author = this.author.id;
                    //this.assignee = this.userService.selectedUser;
                    //this.assignee = this.assignee._id;
                }
                else if (this.author.role == "user") {
                    this.author = this.author.id;
                    this.assignee = this.author;
                }


            }
            /*
            SurveySelectorController.prototype.editSurvey = function (survey) {
                console.log('here');
            };
            */
            SurveySelectorController.prototype.toggle = function (item, list) {
                var idx = list.indexOf(item);
                if (idx > -1)
                    list.splice(idx, 1);
                else
                    list.push(item);
            };
            ;
            SurveySelectorController.prototype.exists = function (item, list) {
                return list.indexOf(item) > -1;
            };
            ;
            SurveySelectorController.prototype.toggleAll = function () {
                if (this.selectedDays.length === this.days.length) {
                    this.selectedDays = [];
                }
                else if (this.selectedDays.length === 0 || this.selectedDays.length > 0) {
                    this.selectedDays = this.days.slice(0);
                }
            };
            ;
            SurveySelectorController.prototype.isChecked = function () {
                return this.selectedDays.length === this.days.length;
            };
            ;
            SurveySelectorController.prototype.isIndeterminate = function () {
                return (this.selectedDays.length !== 0 &&
                    this.selectedDays.length !== this.days.length);
            };



            SurveySelectorController.prototype.cancel = function () {
                this.$mdDialog.cancel();
            };



            SurveySelectorController.prototype.save = function () {
              /*
                var instanceSurvey {
                  title:
                  questions:
                  surveyResponse:

                }
                */
                var surveyInfo = {
                  selectedDays: this.selectedDays,
                  time: this.time,
                  repeat: this.repeat
                };
                console.log(JSON.stringify(surveyInfo));

                this.$mdDialog.hide(surveyInfo);
            };






            SurveySelectorController.$inject = ['$mdDialog', 'userService', '$http'];
            return SurveySelectorController;
        }());
        dashboard.SurveySelectorController = SurveySelectorController;
    })(dashboard = app.dashboard || (app.dashboard = {}));
})(app || (app = {}));
//# sourceMappingURL=SurveySelectorController.js.map
