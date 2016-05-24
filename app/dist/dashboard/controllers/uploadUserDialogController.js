/// <reference path="../all.ts" />
var app;
(function (app) {
  var dashboard;
  (function (dashboard) {
    var UploadUserDialogController = (function () {
      function UploadUserDialogController($mdDialog, userService) {
        this.$mdDialog = $mdDialog;
        this.userService = userService;
        this.user = this.userService.get();
      }
      UploadUserDialogController.prototype.cancel = function () {
        console.log('Cancelling dialog');
        this.$mdDialog.cancel();
      };
      UploadUserDialogController.prototype.save = function () {
        var userList = this.userList;
        this.$mdDialog.hide(userList);
      };
      UploadUserDialogController.$inject = ['$mdDialog', 'userService'];

      return UploadUserDialogController;
    }());
    dashboard.UploadUserDialogController = UploadUserDialogController;
  })(dashboard = app.dashboard || (app.dashboard = {}));
})(app || (app = {}));
