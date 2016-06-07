var app;
(function (app) {
    var dashboard;
    (function (dashboard) {
        var NoteController = (function () {
            function NoteController($mdDialog, userService, selected) {
                this.$mdDialog = $mdDialog;
                this.userService = userService;
                this.selected = selected;
                this.author = this.userService.get();
                this.assignee = this.userService.selectedUser;
                if(selected){
                  this._id = selected._id;
                  this.note = selected.body;
                }


            }

            NoteController.prototype.cancel = function () {
              this.$mdDialog.cancel();
            };

            NoteController.prototype.save = function () {
              console.log("Getting somewhere");

              var note = {
                _id: this._id,
                body: this.note,
                author: this.author.id,
                assignee: this.assignee.id
              }
              console.log(note);
              this.$mdDialog.hide(note);
            };

            NoteController.$inject = ['$mdDialog', 'userService', 'selected'];
            return NoteController;
        }());
        dashboard.NoteController = NoteController;
    })(dashboard = app.dashboard || (app.dashboard = {}));
})(app || (app = {}));
