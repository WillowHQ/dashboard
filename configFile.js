(function () { 
 return angular.module("dashboard.config", [])
.constant("local", {"EnvironmentConfig":{"api":"http://localhost/"}})
.constant("production", {"EnvironmentConfig":{"api":"https://api.production.com/"}});

})();
