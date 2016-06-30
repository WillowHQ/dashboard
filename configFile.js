(function () { 
 return angular.module("dashboard.config", [])
.constant("local", {"EnvironmentConfig":{"api":"http://107.170.21.178/"}})
.constant("production", {"EnvironmentConfig":{"api":"https://api.production.com/"}});

})();
