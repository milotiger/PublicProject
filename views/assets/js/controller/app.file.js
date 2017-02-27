(function() {
    'use strict';
    let app = angular.module('app');

    app.controller('fileCtr', function($scope, $rootScope, $cookies, $state, $timeout, AdminService, GlobalService, $http) {
        window.fi = $scope;

        $scope.accessToken = $cookies.get('at');
        $scope.serviceId = $state.params.serviceId;

        let profile_id = $state.params.profileID;

        $scope.files = {};
        $scope.formdata = {};

        $http.get('/api/admin/i20/file-url/' + profile_id)
            .success(function(result) {
                console.log(result);
                $scope.files = result;
            });
        
        $http.get('/api/admin/i20/form-info/' + profile_id)
            .success(function(result) {
                $scope.formdata = result;
            });

        $scope.printPdf = function(elementID) {
            let getMyFrame = document.getElementById(elementID);
            getMyFrame.focus();
            getMyFrame.contentWindow.print();
        }

        $scope.nextAdminStep = function nextAdminStep() {
            AdminService.NextStep($scope.serviceId, 2).then(function(res) {
                $state.go('app.admin.quan-ly-dich-vu.nop-i20', { action: { text: "Hoàn thành", index: 3 } });
            });
        }

        $scope.previewForm = function() {
            $http({
                url : '/api/helper/fill',
                method : 'GET',
                params : { info : $scope.formdata.info, school : $scope.formdata.school }
            }).success(result => {
                $scope.formdata.url = result.data;
                console.log($scope.formdata);
                $('#previewForm').modal('show');
            });
        }
    });
})();