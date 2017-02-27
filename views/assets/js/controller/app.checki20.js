(function() {
    'use strict';
    var app = angular.module('app');

    app.controller('checkCtr', function($scope, $rootScope, $cookies, $state, AdminService, GlobalService, userService) {
        window.ck = $scope;

        $scope.accessToken = $cookies.get('at');
        $scope.profileId = $state.params.profileId;
        $scope.userId = $state.params.userId;
        $scope.serviceId = $state.params.serviceId;
        $scope.index = 0;

        $scope.basicInfo = {
            UserId: $scope.userId,
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
            }
        };

        $scope.profile = {
            UserId: $scope.currentUser.Id,
            HocBa: {
                ThongTinTruong: {
                    DiaChi: {
                        QuocGia: "Việt Nam"
                    }
                }
            },
            BangTiengAnh: {
                Valid: true
            }
        };

        $scope.sex = ["Nam", "Nữ"];
        $scope.country = ["Việt Nam", "Mỹ", "Úc", "Nhật Bản"];
        $scope.relation = ["Cha", "Mẹ", "Anh", "Chị", "Cô", "Dì", "Chú", "Bác", "Cậu"];
        $scope.nations = ["Việt Nam", "Mỹ", "Anh", "Nhật Bản", "Hàn Quốc", "Pháp"];
        $scope.hoclucs = ["Giỏi", "Khá", "Trung Bình", "Yếu", "Kém"];
        $scope.hanhkiems = ["Tốt", "Khá", "Trung Bình", "Yếu", "Kém"];
        $scope.xeploais = ["Giỏi", "Khá", "Trung Bình", "Yếu"];
        $scope.loaibangs = ["IELTS", "TOEFL", "TOEIC", "CEFR"];

        activates();

        /////////////

        function activates() {
            AdminService.GetProfile($scope.profileId).then(function(res) {
                $scope.profile = userService.getUserProfile(res, $scope.profile, $scope.accessToken);
                $scope.graduationYear = userService.getYear();

                AdminService.SetEmbedFile($scope.profile);
            }, function(err) {
                GlobalService.SweetAlert($rootScope.lang.error, $rootScope.lang.file_not_found, "error", "#DD6B55");
            });
            AdminService.GetUserInfo($scope.userId).then(function(res) {
                $scope.basicInfo = userService.getBasicInfo(res, $scope.basicInfo);
            }, function(err) {

            });

            $scope.$evalAsync();
        }

        $scope.nextStep = function nextStep() {
            if ($scope.index === 0) {
                var check = $("#check0").parent().attr("aria-checked");
                if (check === "true") {
                    $scope.basicInfo.isCheck = true;
                    AdminService.UpdateUserInfo($scope.basicInfo).then(function(res) {
                        $scope.nextIndex($scope.index);
                    });
                } else {
                    GlobalService.SweetAlert($rootScope.lang.error, $rootScope.lang.is_checked, "warning", "#DD6B55");
                }
            } else if ($scope.index === 1) {
                var check = $("#check1").parent().attr("aria-checked");
                if (check === "true") {
                    $scope.uploadData = userService.checkDataUpload(0, $scope.profile);
                    if (!userService.checkAllRequired(0, $scope.uploadData.value, $scope.faculty)) {
                        return false;
                    }
                    AdminService.UpdateProfile($scope.profileId, $scope.uploadData);

                    AdminService.CheckProfileStep($scope.profileId, "HocBa", true).then(function(res) {
                        $scope.nextIndex($scope.index);
                    });
                } else {
                    GlobalService.SweetAlert($rootScope.lang.error, $rootScope.lang.is_checked, "warning", "#DD6B55");
                }
            } else if ($scope.index === 2) {
                var check = $("#check2").parent().attr("aria-checked");
                if (check === "true") {
                    $scope.uploadData = userService.checkDataUpload(1, $scope.profile);
                    if (!userService.checkAllRequired(1, $scope.uploadData.value, $scope.faculty)) {
                        return false;
                    }
                    AdminService.UpdateProfile($scope.profileId, $scope.uploadData);

                    AdminService.CheckProfileStep($scope.profileId, "BangTotNghiep", true).then(function(res) {
                        $scope.nextIndex($scope.index);
                    });
                } else {
                    GlobalService.SweetAlert($rootScope.lang.error, $rootScope.lang.is_checked, "warning", "#DD6B55");
                }
            } else if ($scope.index === 3) {
                var check = $("#check2").parent().attr("aria-checked");
                if (check === "true") {
                    $scope.uploadData = userService.checkDataUpload(2, $scope.profile);
                    if (!userService.checkAllRequired(2, $scope.uploadData.value, $scope.faculty)) {
                        return false;
                    }
                    AdminService.UpdateProfile($scope.profileId, $scope.uploadData);

                    AdminService.CheckProfileStep($scope.profileId, "BangTiengAnh", true).then(function(res) {
                        $scope.nextIndex($scope.index);
                    });
                } else {
                    GlobalService.SweetAlert($rootScope.lang.error, $rootScope.lang.is_checked, "warning", "#DD6B55");
                }
            }
        }

        $scope.nextIndex = function nextIndex(index) {
            if (index < $scope.profile.Step) {
                $scope.index++;
                GlobalService.SweetAlert($rootScope.lang.success, $rootScope.lang.next, "success", "#8CD4F5");
            }
            if (index === 2 && $scope.profile.BangTiengAnh.Valid == false) {
                $scope.index++;
            }
            $scope.$evalAsync();
        }

        $scope.nextAdminStep = function nextAdminStep() {
            AdminService.NextStep($scope.serviceId, 1).then(function(res) {
                $state.go('app.admin.quan-ly-dich-vu.xu-ly-i20', { action: { text: "Xử lý", index: 2 } });
            });
        }
    });
})();