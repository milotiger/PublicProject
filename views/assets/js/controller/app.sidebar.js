(function() {
    'use strict';
    var app = angular.module('app');
    var server = "../api";

    app.controller('sidebarCtr', function($scope, $rootScope, $cookies, $timeout, $state, GlobalService, userService) {
        window.sb = $scope;

        $scope.isOpen = true;
        $scope.isUserOpen = true;
        $scope.role = 0;
        $scope.step = 0;

        activates();

        /////////////

        function activates() {
            $scope.accessToken = $cookies.get('at');
            GlobalService.CheckLogin()
                .then(function(res) {
                    $scope.current = res.data;

                    $scope.profileId = $cookies.get('pid');

                    if ($state.includes('app.i20-college')) {
                        $timeout(function() {
                            $scope.getCurrentStep($scope.profileId);
                        }, 200);
                    }

                    $scope.role = $scope.current.LoaiTaiKhoan;

                    // if ($scope.role > 0 && !$state.includes('app.i20-college') && !$state.includes('app.admin.check-i20-college')) {
                    //     $state.go('app.admin.quan-ly-dich-vu.kiem-tra-hoso', { action: { text: "Kiểm tra", index: 1 } });
                    // }

                    console.log("Get current user sidebar!!!");
                })
                .catch(function(err) {

                });
        }

        $scope.getCurrentStep = function getCurrentStep(id) {
            $.ajax({
                    url: server + "/profile/step/" + id,
                    method: 'GET',
                    dataType: 'json',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + $scope.accessToken);
                    }
                })
                .done(function(res) {
                    console.log("Get step successfully!!!");
                    $scope.step = res.step;

                    userService.setValidStep($scope.step);
                    userService.goToState($scope.step);
                    $scope.$evalAsync();
                })
                .fail(function(res) {
                    console.log("Get step error!!!");
                    swal({
                        title: "Lỗi",
                        text: res.responseJSON.message,
                        type: "error",
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "OK",
                        closeOnConfirm: true
                    });
                });
        }

        $scope.changeActive = function changeActive(id) {
            if (id === 0) {
                $scope.isOpen = !$scope.isOpen;
            }
            if (id === -1) {
                $scope.isUserOpen = !$scope.isUserOpen;
            }
        }

        $scope.logout = function logout() {
            $rootScope.currentUser = {};
            $timeout(function() {
                window.location.pathname = "/pages/login.html";
            }, 200);
        }

        $scope.checkStep = function checkStep(index) {
            userService.checkStep(index);
        }

        $scope.setLang = function setLang(lang) {
            var now = new Date();
            now.setDate(now.getDate() + 7);
            $cookies.put('l', lang, { expires: now, path: '/' });

            GlobalService.GetLang(lang).then(function(res) {
                $rootScope.lang = res;
            });
        }
    });
})();