(function() {
    'use strict';

    var app = angular.module('app');
    var server = "../api";

    app.factory('AdminService', function AdminService($state, $resource, GlobalService) {
        var HelpResource = $resource("/api/admin/services/agency/:agencyId", { agencyId: '@agencyId' }, {
            NextStep: {
                method: "PUT",
                url: "/api/admin/services/admin-step/:serviceId",
                params: { serviceId: '@serviceId' }
            }
        });

        var ProfileResource = $resource("/api/profile/user-profile/:profileId", { profileId: '@profileId' }, {
            GetUserInfo: {
                method: "GET",
                url: "/api/personal/user/:userId",
                params: { userId: '@userId' }
            },
            UpdateUserInfo: {
                method: "POST",
                url: "/api/personal/update/:userId",
                params: { userId: '@userId' }
            },
            CheckStep: {
                method: "POST",
                url: "/api/admin/i20/check/:profileId",
                params: { profileId: '@profileId' }
            },
            UpdateProfile: {
                method: "POST",
                url: "/api/profile/:stepName/:profileId",
                params: { stepName: '@stepName', profileId: '@profileId' }
            }
        });

        var service = {
            GetServices: getServices,
            GetAllStaff: getAllStaff,
            updateStaff: updateStaff,
            GetService: getService,
            NextStep: nextStep,
            GetProfile: getProfile,
            GetUserInfo: getUserInfo,
            UpdateUserInfo: updateUserInfo,
            CheckProfileStep: checkProfileStep,
            SetEmbedFile: setEmbedFile,
            UpdateProfile: updateProfile
        };

        return service;

        ////////////////
        function getServices(token, type) {
            var data = [];
            $.ajax({
                type: "GET",
                url: server + "/admin/services/query/" + type,
                dataType: "json",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                },
                success: function(response) {
                    console.log("Get services successfully!!!");
                    response = GlobalService.GetTimeStamp(response);
                    for (var i = 0; i < response.length; i++) {
                        data.push(response[i]);
                    }
                },
                error: function(response) {
                    console.log("Get services error!!!");
                }
            });
            return data;
        }

        function getAllStaff(token) {
            var data = [];
            $.ajax({
                type: "GET",
                url: server + "/admin/account/all-accounts",
                dataType: "json",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                },
                success: function(response) {
                    console.log("Get staff successfully!!!");
                    for (var i = 0; i < response.length; i++) {
                        switch (response[i].LoaiTaiKhoan) {
                            case 0:
                                response[i].ChucVu = "Khách hàng";
                                break;
                            case 1:
                                response[i].ChucVu = "Nhân viên";
                                break;
                            case 2:
                                response[i].ChucVu = "Agency";
                                break;
                            case 3:
                                response[i].ChucVu = "Quản trị";
                                break;
                        }
                        data.push(response[i]);
                    }
                },
                error: function(response) {
                    console.log("Get staff error!!!");
                }
            });

            return data;
        }

        function updateStaff(token, userID, data) {
            $.ajax({
                type: "PUT",
                url: server + "/admin/account/role/" + userID,
                dataType: "json",
                data: data,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                },
                success: function(response) {
                    console.log("update staff successfully!!!");
                },
                error: function(response) {
                    console.log("Get staff error!!!");
                }
            });
        }

        function getService(id) {
            return HelpResource.query({ agencyId: id }).$promise;
        }

        function nextStep(id, value) {
            var step = {
                AdminStep: value
            };

            return HelpResource.NextStep({ serviceId: id }, step).$promise;
        }

        function getProfile(profileId) {
            return ProfileResource.get({ profileId: profileId }).$promise;
        }

        function getUserInfo(userId) {
            return ProfileResource.GetUserInfo({ userId: userId }).$promise;
        }

        function updateUserInfo(user) {
            return ProfileResource.UpdateUserInfo({ userId: user.UserId }, user).$promise;
        }

        function checkProfileStep(profileId, step, value) {
            var item = {
                profile_item: step,
                value: value
            }
            return ProfileResource.CheckStep({ profileId: profileId }, item).$promise;
        }

        function setEmbedFile(data) {
            if (data.HoChieu !== undefined) {
                var embed = '<embed src="' + data.HoChieu.FileUrl + '" width="100%" height="600px" type="application/pdf" />';
                $('#passport').append(embed);
            }
            if (data.HocBa !== undefined) {
                var embed = '<embed src="' + data.HocBa.FileUrl + '" width="100%" height="600px" type="application/pdf" />';
                $('#profile').append(embed);
            }
            if (data.BangTotNghiep !== undefined) {
                var embed = '<embed src="' + data.BangTotNghiep.FileUrl + '" width="100%" height="600px" type="application/pdf" />';
                $('#graduation').append(embed);
            }
            if (data.BangTiengAnh !== undefined && data.BangTiengAnh.FileUrl != undefined) {
                var embed = '<embed src="' + data.BangTiengAnh.FileUrl + '" width="100%" height="600px" type="application/pdf" />';
                $('#english').append(embed);
            }
        }

        function updateProfile(profileId, data) {
            return ProfileResource.UpdateProfile({ stepName: data.name, profileId: profileId }, data.value).$promise;
        }
    });
})();