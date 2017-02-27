(function() {
    'use strict';
    var app = angular.module('app');

    app.controller('loginCtr', function($scope, $http, $cookies, $rootScope, GlobalService) {
        window.sc = $scope;
        window.location.hash = "";

        window.http = $http;

        $scope.loginUser = {};

        activates();

        ////////////////

        function activates() {
            var lang = $cookies.get('l');

            if (lang == null) {
                $http.get("/api/helper/get-language/vi").then(function(res) {
                    $rootScope.lang = res.data;
                });
            } else {
                $http.get("/api/helper/get-language/" + lang).then(function(res) {
                    $rootScope.lang = res.data;
                });
            }

            $scope.$evalAsync();
        }

        $scope.submitForm = function submitForm($valid) {
            if ($valid) {
                $scope.promise = GlobalService.Login($scope.loginUser)
                    .then(function(res) {
                        var now = new Date();
                        now.setDate(now.getDate() + 7);
                        $cookies.put('at', res.token, { expires: now, path: '/' });

                        window.location.pathname = "/home.html";
                    }, function(res) {
                        GlobalService.SweetAlert($rootScope.lang.unsuccess, $rootScope.lang.account_error, "error", "#DD6B55");
                    });
            } else {
                return false;
            }
        }

        $scope.forgotPassword = function forgotPassword() {
            $scope.promise = GlobalService.ForgotPassword($scope.useremail)
                .then(function(res) {
                    console.log(res);
                    if (!res.error) {
                        GlobalService.SweetAlert($rootScope.lang.success, $rootScope.lang.check_email, "success", "#8CD4F5");

                        var expires = new Date();
                        expires.setHours(expires.getHours() + 1);
                        $cookies.put('rs', res.token, { expires: expires, path: '/' });
                    } else {
                        GlobalService.SweetAlert($rootScope.lang.unsuccess, $rootScope.lang.email_error, "error", "#DD6B55");
                    }
                }, function(res) {
                    GlobalService.SweetAlert($rootScope.lang.success, $rootScope.lang.check_internet, "error", "#DD6B55");
                });
        }

        $('#startSubmit').on('keyup', function(e) {
            if (e.keyCode === 13) {
                $scope.submitForm(true);
            }
        });
    });
})();