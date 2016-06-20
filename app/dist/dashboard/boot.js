/// <reference path="_all.ts" />
var app;
(function (app) {
    var dashboard;
    (function (dashboard) {
        angular
            .module('dashboard', ['ngMaterial', 'ngMdIcons', 'ngMessages', 'ngRoute', 
            'users', 'md.data.table'])
            .controller('MainController', ['$scope', 'userService', '$mdSidenav', '$mdBottomSheet', '$mdToast', '$mdDialog', '$mdMedia', '$http', dashboard.MainController])
            .config(function ($mdThemingProvider, $mdIconProvider, $routeProvider, $locationProvider) {
            $mdIconProvider
                .defaultIconSet("./assets/svg/avatars.svg", 128)
                .icon("menu", "./assets/svg/menu.svg", 24)
                .icon("google_plus", "./assets/svg/google_plus.svg", 512)
                .icon("hangouts", "./assets/svg/hangouts.svg", 512)
                .icon("twitter", "./assets/svg/twitter.svg", 512)
                .icon("phone", "./assets/svg/phone.svg", 512)
                .icon("slack", "./assests/svg/slack.svg", 512)
                .icon("close", "./assests/svg/close.svg", 512);
            $mdThemingProvider.definePalette('fitpath', {
                '50': '176785',
                '100': '176785',
                '200': '176785',
                '300': '176785',
                '400': '176785',
                '500': '176785',
                '600': '176785',
                '700': '176785',
                '800': '176785',
                '900': '176785',
                'A100': '176785',
                'A200': '176785',
                'A400': '176785',
                'A700': '176785'
            });
            $mdThemingProvider.theme('default')
                .primaryPalette('blue')
                .accentPalette('red');
            $routeProvider
                .when("/", {
                templateUrl: "/dist/view/dashboard/index.html",
                controller: "MainController as vm"
            }).when("/table", {

                templateUrl: "/dist/view/dashboard/table.html",
                controller: "ClientOverviewController as vm"
            }).when("/surveys",{
                templateUrl: "/dist/view/dashboard/survey.html",
                controller: "MainController as vm"
            }).when("/surveys",{
                templateUrl: "/dist/view/dashboard/survey.html",
                controller: "MainController as vm"
            });
            $locationProvider.hashPrefix('!');
        });
    })(dashboard = app.dashboard || (app.dashboard = {}));
})(app || (app = {}));
//# sourceMappingURL=boot.js.map
