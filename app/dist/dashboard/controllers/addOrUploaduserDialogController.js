/// <reference path="../all.ts" />
var app;
(function (app) {
  var dashboard;
  (function (dashboard) {
    var AddOrUploadUserDialogController = (function () {
      function AddOrUploadUserDialogController($mdDialog, userService) {
        this.$mdDialog = $mdDialog;
        this.userService = userService;
        this.user = this.userService.get();
        console.log(this.user);

        this.avatars = [
          'svg-1', 'svg-2', 'svg-3', 'svg-4'
        ];
      }
      AddOrUploadUserDialogController.prototype.cancel = function () {
        this.$mdDialog.cancel();
      };
      AddOrUploadUserDialogController.prototype.save = function () {
        var add = this.add;
        this.$mdDialog.hide(add);
      };
      AddOrUploadUserDialogController.prototype.add = function ($event) {
        console.log('You wish to add a new client');
        dashboard.MainController.addUser($event);
        // TODO: figure out how to route to another controller
      };
      AddOrUploadUserDialogController.prototype.upload = function () {
        // TODO: figure out how to route to another controller
      };
      AddOrUploadUserDialogController.$inject = ['$mdDialog', 'userService'];

      return AddOrUploadUserDialogController;
    }());
    dashboard.AddOrUploadUserDialogController = AddOrUploadUserDialogController;
  })(dashboard = app.dashboard || (app.dashboard = {}));
})(app || (app = {}));
