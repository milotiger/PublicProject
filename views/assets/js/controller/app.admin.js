(function() {
    'use strict';
    var app = angular.module('app');

    app.controller('adminCtr', function($scope, $rootScope, $cookies, $state, $timeout, AdminService, GlobalService) {
        window.ac = $scope;

        $scope.accessToken = $cookies.get('at');
        $scope.listFreeService = [];
        $scope.roles = ['Khách hàng', 'Nhân viên', 'Agency', 'Quản trị'];
        $scope.targetStaff = '';
        $scope.indexStaff = 0;
        $scope.staff = {};
        $scope.listFollowService = [];
        $scope.listServices = [];
        $scope.listStaff = [];
        $scope.currentStaff = 0;
        $scope.currentId = 0;
        $scope.action = $state.params.action;


        activates();

        /////////////

        function activates() {
            if (!$scope.action && $state.includes('app.admin.quan-ly-dich-vu')) {
                $state.go('app.admin.quan-ly-dich-vu.kiem-tra-hoso', { action: { text: "Kiểm tra", index: 1 } });
            } else if ($scope.action != undefined) {
                $('.nav-tab-' + $scope.action.index).addClass('active');
            }
            // Get services and all staffs in company.
            if ($state.includes('app.admin.ho-so-moi')) {
                $scope.listFreeService = AdminService.GetServices($scope.accessToken, "free");
            }
            if ($state.includes('app.admin.ho-so-da-chuyen')) {
                $scope.listFollowService = AdminService.GetServices($scope.accessToken, "assigned");
            }
            if ($state.includes('app.admin.quan-ly-dich-vu')) {
                $scope.promise = AdminService.GetService($rootScope.currentUser.Id).then(function(res) {
                    $scope.listServices = GlobalService.GetTimeStamp(res);
                });
            }
            if ($state.includes('app.admin.quan-ly-dich-vu.i20-detail')) {
                $scope.userName = $state.params.userName;
                $scope.serviceSelected = $state.params.serviceId;
            }

            $scope.listStaff = AdminService.GetAllStaff($scope.accessToken);

            $scope.promise = $timeout(function() {
                $scope.$evalAsync();
            }, 1800);
        }

        $scope.selectService = function selectService(index) {
            $scope.currentId = index;
            $scope.$evalAsync();
        }

        $scope.updateStaff = function(index) {
            $('#modalUpdateStaff').modal('show');
            $scope.indexStaff = index;
            $scope.targetStaff = $scope.listStaff[index]._id;
        }

        $scope.saveStaff = function() {
            $(`.staff-${$scope.indexStaff}`).html($scope.staff.LoaiTaiKhoan);
            switch ($scope.staff.LoaiTaiKhoan) {
                case 'Khách hàng':
                    $scope.staff.LoaiTaiKhoan = 0;
                    break;
                case 'Nhân viên':
                    $scope.staff.LoaiTaiKhoan = 1;
                    break;
                case 'Agency':
                    $scope.staff.LoaiTaiKhoan = 2;
                    break;
                case 'Quản trị':
                    $scope.staff.LoaiTaiKhoan = 3;
                    break;
            }
            AdminService.updateStaff($scope.accessToken, $scope.targetStaff, $scope.staff);
            $('#modalUpdateStaff').modal('toggle');
        }

        $scope.assignStaff = function assignStaff() {
            console.log($scope.listFreeService[$scope.currentId]._id);
            console.log($scope.listStaff[$scope.currentStaff]._id);
            $.ajax({
                type: "POST",
                url: "../api/admin/services/assign/" + $scope.listFreeService[$scope.currentId]._id,
                data: {
                    AgencyId: $scope.listStaff[$scope.currentStaff]._id
                },
                dataType: "json",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + $scope.accessToken);
                },
                success: function(response) {
                    GlobalService.SweetAlert($rootScope.lang.success, $rootScope.lang.to_agency, "success", "#8cd4f5");
                    $scope.updateTable($scope.currentId);
                },
                error: function(response) {
                    GlobalService.SweetAlert($rootScope.lang.unsuccess, $rootScope.lang.not_to_agency, "error", "#DD6B55");
                }
            });
        }

        $scope.updateTable = function updateTable(index) {
            $scope.listFreeService.splice(index, 1);
            $scope.$evalAsync();
        }

        $scope.changeTab = function changeTab(index) {
            switch (index) {
                case 1:
                    $state.go('app.admin.quan-ly-dich-vu.kiem-tra-hoso', { action: { text: "Kiểm tra", index: 1 } });
                    // $scope.action.text = "Kiểm tra";
                    // $scope.action.index = 1;
                    break;
                case 2:
                    $state.go('app.admin.quan-ly-dich-vu.xu-ly-i20', { action: { text: "Xử lý", index: 2 } });
                    // $scope.action.text = "Xử lý";
                    // $scope.action.index = 2;
                    break;
                case 3:
                    $state.go('app.admin.quan-ly-dich-vu.nop-i20', { action: { text: "Hoàn thành", index: 3 } });
                    // $scope.action.text = "Hoàn thành";
                    // $scope.action.index = 3;
                    break;
                case 4:
                    $state.go('app.admin.quan-ly-dich-vu.kiem-tra-i20', { action: { text: "Kiểm tra", index: 4 } });
                    // $scope.action.text = "Kiểm tra";
                    // $scope.action.index = 4;
                    break;
                case 5:
                    $state.go('app.admin.quan-ly-dich-vu.gui-i20', { action: { text: "Xác nhận đã nhận", index: 5 } });
                    // $scope.action.text = "Xác nhận đã nhận";
                    // $scope.action.index = 5;
                    break;
                case 6:
                    $state.go('app.admin.quan-ly-dich-vu.ket-thuc', { action: { text: "Xem lại", index: 6 } });
                    // $scope.action.text = "Xem lại";
                    // $scope.action.index = 6;
                    break;
            }
        }

        $scope.goToService = function goToService(profileId, serviceId, userId, userName) {
            switch ($scope.action.index) {
                case 1:
                    $scope.checkProfile(profileId, serviceId, userId);
                    break;
                case 2:
                    $scope.checkFile(profileId, serviceId);
                    break;
                case 3:
                    $scope.nextAdminStep(serviceId, 3);
                    break;
                case 4:
                    $scope.uploadI20(profileId, serviceId, userName);
                    break;
                case 5:
                    $scope.nextAdminStep(serviceId, 5);
                    break;
                case 6:
                    // $scope.reviewAll(serviceId);
                    break;
            }
        }

        $scope.checkProfile = function checkProfile(profileId, serviceId, userId) {
            $state.go('app.admin.quan-ly-dich-vu.check-i20', { profileId: profileId, userId: userId, serviceId: serviceId });
        }

        $scope.checkFile = function checkFile(profileId, serviceId) {
            $state.go('app.admin.quan-ly-dich-vu.xu-ly-detail', { profileID: profileId, serviceId: serviceId });
        }

        $scope.uploadI20 = function(profileId, serviceId, userName) {
            $state.go('app.admin.quan-ly-dich-vu.i20-detail', { profileID: profileId, serviceId: serviceId, userName: userName });
        };
        $scope.nextAdminStep = function nextAdminStep(serviceId, currentStep) {
            if (serviceId == -1) {
                serviceId = $scope.serviceSelected;
            }
            AdminService.NextStep(serviceId, currentStep).then(function(res) {
                $scope.changeTab(currentStep + 1);
            });
        }
    });
})();