(function() {
    'use strict';
    var app = angular.module('app');
    var server = "../api";

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

    app.controller('registerCtr', function($scope, $rootScope, $http, $cookies, GlobalService) {
        window.sc = $scope;
        $scope.newUser = {};

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
            if ($valid) {
                $scope.newUser.LoaiTaiKhoan = parseInt($('input[name="kind"]:checked').val());

                $scope.promise = GlobalService.Register($scope.newUser).then(function(res) {
                    swal({
                        title: $rootScope.lang.sign_up_success,
                        text: $rootScope.lang.check_email,
                        type: "success",
                        confirmButtonText: "OK",
                        closeOnConfirm: true
                    }, function() {
                        window.location.pathname = "/pages/login.html";
                    });
                }, function(res) {
                    GlobalService.SweetAlert("Lỗi", res.data.message, "warning", "#DD6B55");
                });
            } else {
                console.log($valid);
            }
        }
    });
})();