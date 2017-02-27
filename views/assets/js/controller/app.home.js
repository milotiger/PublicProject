(function() {
    'use strict';
    var app = angular.module('app');
    var server = "../api";

    app.controller('homeCtr', function($scope, $rootScope, $cookies, $timeout, $state, GlobalService) {
        window.home = $scope;

        $scope.services = [];
        $scope.accessToken = $cookies.get('at');
        $scope.newService = {};

        $.ajax({
                url: server + "/service",
                method: 'GET',
                dataType: 'json',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + $scope.accessToken);
                }
            })
            .done(function(res) {
                $scope.currentUser = $rootScope.currentUser;
                $scope.services = res;

                $scope.services = GlobalService.GetTimeStamp($scope.services);

                $timeout(function() {
                    $scope.$evalAsync();
                }, 200);
            })
            .fail(function() {
                console.log("Get service error!!!");
            });

        $scope.goToService = function goToService(index, step) {
            var timeout = new Date();
            timeout.setDate(timeout.getDate() + 1);
            $cookies.put('pid', index, { expires: timeout, path: '/' });
            $cookies.put('adminStep', step, { expires: timeout, path: '/' });
            $timeout(function() {
                $state.go('app.i20-college');
            }, 200);
        }

        $scope.goToNewService = function goToNewService() {
            $state.go('app.create');
        }

        $scope.createService = function createService(index) {
            $scope.newService = {
                userID: $scope.currentUser.Id,
                serviceType: index,
                serviceName: "I20-College",
                stage: "Nhập hồ sơ"
            }

            $.ajax({
                    url: server + "/service",
                    method: 'POST',
                    dataType: 'json',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + $scope.accessToken);
                    },
                    data: $scope.newService,
                })
                .done(function(res) {
                    if (res.error === "notactive") {
                        swal({
                            title: $rootScope.lang.not_verified,
                            text: $rootScope.lang.check_email,
                            type: "error",
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "OK",
                            closeOnConfirm: true
                        });
                    } else {
                        var timeout = new Date();
                        timeout.setDate(timeout.getDate() + 1);
                        $cookies.put('pid', res.profileID, { expires: timeout, path: '/' });
                        $timeout(function() {
                            $state.go('app.i20-college');
                        }, 200);
                    }
                })
                .fail(function(res) {
                    console.log("Create service error!!!");
                });
        }
    });
})();