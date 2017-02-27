(function() {
    'use strict';
    var app = angular.module('app');
    var server = "../api";

    app.controller('infoCtr', function($scope, $cookies, userService, $rootScope, GlobalService) {
        window.sc = $scope;
        window.rc = $rootScope;

        $scope.accessToken = $cookies.get('at');
        $scope.profileID = $cookies.get('pid');
        $scope.sex = ["Nam", "Nữ"];
        $scope.country = ["Việt Nam", "Mỹ", "Úc", "Nhật Bản"];
        $scope.relation = ["Cha", "Mẹ", "Anh", "Chị", "Cô", "Dì", "Chú", "Bác", "Cậu"];
        $scope.currentUser = $rootScope.currentUser;

        $scope.basicInfo = {
            DiaChi: {
                QuocGia: "Việt Nam"
            },
            GioiTinh: "",
            NoiSinh: {
                QuocGia: "Việt Nam"
            },
            QuocTich: "Việt Nam",
            NguoiGiamHo: {
                QuanHe: "",
                DiaChi: {
                    QuocGia: "Việt Nam"
                }
            },
            Email: $rootScope.currentUser.Email
        };

        // Get lasted data of user
        $.ajax({
                url: server + '/personal/user/' + $scope.currentUser.Id,
                type: 'GET',
                beforeSend: function function_name(xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + $scope.accessToken); // Set Auth header 
                }
            })
            .done(function(res) {
                console.log("Get info successfully!!!");
                $scope.basicInfo = userService.getBasicInfo(res, $scope.basicInfo);

                $scope.$evalAsync();
            })
            .fail(function() {
                console.log("Get info error!!!");
            });

        // Save current data 
        $scope.saveInfo = function saveInfo() {
            if (!$scope.checkExistValue()) {
                return false;
            }

            $.ajax({
                    url: server + "/personal/update/" + $scope.currentUser.Id,
                    method: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify($scope.basicInfo),
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + $scope.accessToken);
                    }
                })
                .done(function() {
                    console.log("Update successfully");
                    swal({
                        title: $rootScope.lang.success,
                        text: $rootScope.lang.all_save,
                        type: "success",
                        confirmButtonText: "OK",
                        closeOnConfirm: true
                    }, function() {
                        userService.updateStage("Thông tin cá nhân", $scope.profileID, $scope.accessToken);
                        userService.checkState(1, $scope.accessToken, $scope.profileID);
                        userService.goToState(1);
                    });
                })
                .fail(function() {
                    console.log("Update error");
                    swal({
                        title: $rootScope.lang.unsuccess,
                        text: $rootScope.lang.check_internet,
                        type: "error",
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "OK",
                        closeOnConfirm: true
                    });
                });
        }

        $scope.checkExistValue = function checkExistValue() {
            if ($scope.basicInfo.GioiTinh == "" || $scope.basicInfo.NguoiGiamHo.QuanHe == "") {
                swal({
                    title: $rootScope.lang.error,
                    text: $rootScope.lang.miss_info,
                    type: "error",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "OK",
                    closeOnConfirm: true
                });
                return false;
            } else if (!GlobalService.IsValidDate($scope.basicInfo.NgaySinh)) {
                swal({
                    title: $rootScope.lang.error,
                    text: $rootScope.lang.dob_error,
                    type: "error",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "OK",
                    closeOnConfirm: true
                });
                $("#datemask").parent().addClass('has-error');
                return false;
            } else {
                $("#datemask").parent().removeClass('has-error');
                return true;
            }
        }
    });
})();