var app;
(function (app) {
    var users;
    (function (users) {
        var FacebookService = (function () {
            function FacebookService($http) {
                this.$http = $http;
                this.http = $http;
            }
            FacebookService.prototype.getPic = function(email){
              this.http.get("/")
            }
            FacebookService.$inject = ['$http'];
            return FacebookService;
        }());
        users.FacebookService = FacebookService;
    })(users = app.users || (app.users = {}));
})(app || (app = {}));
