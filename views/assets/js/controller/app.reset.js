(function() {
    'use strict';
    var app = angular.module('app');
    var server = "/api";

    app.directive('validPassword', function() {
        return {
            require: 'ngModel',
            scope: {
                reference: '=validPassword'
            },
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function(viewValue, $scope) {
                    var noMatch = viewValue != scope.reference;

                    ctrl.$setValidity('noMatch', !noMatch);
                    return (noMatch) ? noMatch : !noMatch;
                });

                scope.$watch("reference", function(value) {;
                    ctrl.$setValidity('noMatch', value === ctrl.$viewValue);
                });
            }
        }
    });

    app.controller('resetCtr', function($scope, $http, $cookies, GlobalService) {
        window.sc = $scope;

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
        }

        $scope.submitForm = function submitForm($valid) {
            var token = $cookies.get('rs');
            $.ajax({
                    url: server + "/auth/reset/" + token,
                    method: 'POST',
                    dataType: 'json',
                    data: { 'Password': $scope.newPassword },
                })
                .done(function(res) {
                    console.log(res);
                    swal({
                        title: $rootScope.lang.success,
                        text: $rootScope.lang.pass_change,
                        type: "success",
                        confirmButtonText: "OK",
                        closeOnConfirm: true
                    }, function() {
                        window.location.pathname = "/pages/login.html";
                    });
                })
                .fail(function(res) {
                    swal({
                        title: $rootScope.lang.error,
                        text: $rootScope.lang.check_internet,
                        type: "error",
                        confirmButtonText: "OK",
                        closeOnConfirm: true
                    });
                });
        }
    });
})();