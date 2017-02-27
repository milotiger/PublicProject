(function() {
    'use strict';
    var app = angular.module('app');
    var server = "../api";

    app.controller('serviceCtr', function($scope, $cookies, $http, $state, $rootScope, GlobalService) {
        window.sv = $scope;
        window.rcp = $rootScope;

        $scope.accessToken = $cookies.get('at');
        $scope.schoolType = ["Đại Học", "Cao Đẳng"];

        $scope.index = -1;
        $scope.isWait = false;
        $scope.passwordValue = "";
        $scope.count = 0;

        activates();

        ///////////////

        function activates() {
            if ($state.includes('app.admin.truong')) {
                GlobalService.Schools().then(function(res) {
                    $scope.schools = res;
                });
            }
            if ($state.includes('app.admin.le-phi')) {
                GlobalService.GetFee().then(function(res) {
                    $scope.fees = res;
                });
            }
            if ($state.includes('app.admin.thong-tin-thanh-toan')) {
                GlobalService.GetPaypalInfo().then(function(res) {
                    $scope.acc = res;
                });
            }
            if ($state.includes('app.admin.bieu-mau')) {
                GlobalService.GetForm().then(function(res) {
                    $scope.form = res;

                    if (!$scope.form.ChungMinhTaiChinh) {
                        $('.progress-bar.finshare').text(0 + '%');
                        $('.progress-bar.finshare').width(0 + '%');
                    } else {
                        $('.progress-bar.finshare').text(100 + '%');
                        $('.progress-bar.finshare').width(100 + '%');
                    }
                    if (!$scope.form.KhamSucKhoe) {
                        $('.progress-bar.healthshare').text(0 + '%');
                        $('.progress-bar.healthshare').width(0 + '%');
                    } else {
                        $('.progress-bar.healthshare').text(100 + '%');
                        $('.progress-bar.healthshare').width(100 + '%');
                    }
                });
            }
            $scope.selected = {};
            $scope.feeSelected = {};
            $scope.feeUpdate = {};
        }

        function resetAddForm() {
            $(`.progress-bar`).text('0%');
            $(`.progress-bar`).width('0%');
            $(`#uploadFileform`).val('');
            $(`#uploadFilefinance`).val('');
            $(`#uploadFilehealth`).val('');
        }

        $scope.selectedSchool = function selectedSchool(index) {
            $scope.index = index;
            if (index != -1) {
                $scope.selected = $scope.schools[index];

                if (!$scope.selected.BieuMau) {
                    $('.progress-bar.form').text(0 + '%');
                    $('.progress-bar.form').width(0 + '%');
                } else {
                    $('.progress-bar.form').text(100 + '%');
                    $('.progress-bar.form').width(100 + '%');
                }
                if (!$scope.selected.ChungMinhTaiChinh) {
                    $('.progress-bar.finance').text(0 + '%');
                    $('.progress-bar.finance').width(0 + '%');
                } else {
                    $('.progress-bar.finance').text(100 + '%');
                    $('.progress-bar.finance').width(100 + '%');
                }
                if (!$scope.selected.MauKhamSucKhoe) {
                    $('.progress-bar.health').text(0 + '%');
                    $('.progress-bar.health').width(0 + '%');
                } else {
                    $('.progress-bar.health').text(100 + '%');
                    $('.progress-bar.health').width(100 + '%');
                }
            } else {
                resetAddForm();
                $scope.selected = {
                    BieuMau: "",
                    ChungMinhTaiChinh: "",
                    MauKhamSucKhoe: ""
                }
            }

            $scope.$evalAsync();
            setTimeout(function() {
                $(".select2").select2();
            }, 200);
        }

        $scope.deleteSchool = function deleteSchool(index) {
            swal({
                title: $rootScope.lang.delete_school,
                text: $rootScope.lang.sure,
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Có",
                confirmButtonColor: "#DD6B55",
                cancelButtonText: "Không",
                closeOnConfirm: true
            }, function(isConfirm) {
                if (isConfirm) {
                    GlobalService.DeleteSchool($scope.schools[index]._id).then(function(res) {
                        $scope.schools.splice(index, 1);
                        $scope.$evalAsync();
                    });
                }
            });
        }

        $scope.saveSchools = function saveSchools() {
            if ($scope.index == -1) {
                for (var i = 0; i < $scope.schools.length; i++) {
                    if ($scope.selected.MaTruong.toLowerCase() == $scope.schools[i].MaTruong.toLowerCase()) {
                        GlobalService.SweetAlert($rootScope.lang.error, "Trường này đã tồn tại", "error", "#DD6B55");
                        return false;
                    }
                }
                GlobalService.NewSchool($scope.selected).then(function(res) {
                    $scope.schools.push(res.result);
                }, function(res) {
                    GlobalService.SweetAlert($rootScope.lang.error, "Thêm trường không thành công", "error", "#DD6B55");
                });
                $('#schoolModal').modal('toggle');
            } else {
                GlobalService.UpdateSchool($scope.selected, $scope.selected._id).then(function(res) {
                    $scope.schools[$scope.index] = $scope.selected;
                    GlobalService.SweetAlert($rootScope.lang.success, "Đã cập nhật thông tin trường", "success", "#8CD4F5");
                }, function(res) {
                    GlobalService.SweetAlert($rootScope.lang.error, "Cập nhật thông tin trường không thành công", "error", "#DD6B55");
                });
            }
        }

        $scope.previewFile = function(name) {
            switch (name) {
                case 'form':
                    var embed = '<embed src="' + $scope.selected.BieuMau + '" width="100%" height="600px" type="application/pdf" />';
                    $('#profile embed').remove();
                    $('#profile').append(embed);
                    break;
                case 'finance':
                    var embed = '<embed src="' + $scope.selected.ChungMinhTaiChinh + '" width="100%" height="600px" type="application/pdf" />';
                    $('#profile embed').remove();
                    $('#profile').append(embed);
                    break;
                case 'health':
                    var embed = '<embed src="' + $scope.selected.MauKhamSucKhoe + '" width="100%" height="600px" type="application/pdf" />';
                    $('#profile embed').remove();
                    $('#profile').append(embed);
                    break;
                case 'finshare':
                    var embed = '<embed src="' + $scope.form.ChungMinhTaiChinh + '" width="100%" height="600px" type="application/pdf" />';
                    $('#profile embed').remove();
                    $('#profile').append(embed);
                    break;
                case 'healthshare':
                    var embed = '<embed src="' + $scope.form.KhamSucKhoe + '" width="100%" height="600px" type="application/pdf" />';
                    $('#profile embed').remove();
                    $('#profile').append(embed);
                    break;
            }
            $('#previewFile').modal('show');
        }

        $scope.chooseFile = function chooseFile(name) {
            $(`#uploadFile${name}`).click();
            $(`.progress-bar.${name}`).text('0%');
            $(`.progress-bar.${name}`).width('0%');
        }

        $scope.uploadFile = function uploadFile(name, type) {
            var files = $(`#uploadFile${name}`).get(0).files;

            var file = files[0];
            if (files.length > 0) {
                $scope.isWait = true;
                $scope.$evalAsync();

                // add the files to formData object for the data payload
                var formData = new FormData();
                // Check file upload is pdf, jpg or not.
                if (GlobalService.CheckFileExtension(file, "pdf")) {
                    formData.append('file', files[0]);
                } else {
                    GlobalService.SweetAlert($rootScope.lang.file_error, $rootScope.lang.pdf, "error", "#DD6B55");
                    $scope.isWait = false;
                    $scope.$evalAsync();
                    return false;
                }
            }

            $.ajax({
                url: server + "/cloud-upload/amazon",
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + $scope.accessToken);
                },
                xhr: function() {
                    // create an XMLHttpRequest
                    var xhr = new XMLHttpRequest();
                    // listen to the 'progress' event
                    xhr.upload.addEventListener('progress', function(evt) {
                        if (evt.lengthComputable) {
                            // calculate the percentage of upload completed
                            var percentComplete = evt.loaded / evt.total;
                            percentComplete = parseInt(percentComplete * 100);

                            // update the Bootstrap progress bar with the new percentage
                            $(`.progress-bar.${name}`).text(percentComplete + '%');
                            $(`.progress-bar.${name}`).width(percentComplete + '%');

                            // once the upload reaches 100%, set the progress bar text to done
                            if (percentComplete === 100) {
                                console.log("Done!!!");
                            }
                        }
                    }, false);
                    return xhr;
                },
                success: function(res) {
                    console.log("Upload file successfully");
                    console.log(res);

                    $scope.isWait = false;
                    if (name == "finshare" || name == "healthshare") {
                        $scope.form[`${type}`] = res.url;
                        $scope.count = 1;
                    } else {
                        $scope.selected[`${type}`] = res.url;
                    }
                    var embed = '<embed src="' + res.url + '" width="100%" height="600px" type="application/pdf" />';
                    $('#profile embed').remove();
                    $('#profile').append(embed);

                    $scope.$evalAsync();
                },
                error: function() {
                    console.log("Upload file error");
                    $scope.isWait = false;
                    $scope.$evalAsync();
                }
            });
        }

        $('#uploadFileform').on('change', function() {
            $scope.uploadFile('form', 'BieuMau');
        });

        $('#uploadFilefinance').on('change', function() {
            $scope.uploadFile('finance', 'ChungMinhTaiChinh');
        });

        $('#uploadFilehealth').on('change', function() {
            $scope.uploadFile('health', 'MauKhamSucKhoe');
        });

        $('#uploadFilefinshare').on('change', function() {
            $scope.uploadFile('finshare', 'ChungMinhTaiChinh');
        });

        $('#uploadFilehealthshare').on('change', function() {
            $scope.uploadFile('healthshare', 'KhamSucKhoe');
        });

        $scope.selectedFee = function selectedFee(index) {
            $scope.index = index;

            var now = new Date();
            now.setDate(now.getDate() + 7);

            if (index != -1) {
                $scope.feeSelected = $scope.fees.Fees[index];
                $cookies.put('f', $scope.fees.Fees[index].Fee, { expires: now, path: '/' });
                $cookies.put('n', $scope.fees.Fees[index].Name_vi, { expires: now, path: '/' });
            } else {
                $scope.feeSelected = {};
            }

            $scope.$evalAsync();
        }

        $scope.deleteFee = function deleteFee(index) {
            swal({
                title: "Xóa lệ phí",
                text: "Bạn có chắc chắn muốn xóa",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Có",
                confirmButtonColor: "#DD6B55",
                cancelButtonText: "Không",
                closeOnConfirm: true
            }, function(isConfirm) {
                if (isConfirm) {
                    $http({
                        url: '/api/admin/fee',
                        method: 'DELETE',
                        data: {
                            Name_vi: $scope.fees.Fees[index].Name_vi,
                            Fee: $scope.fees.Fees[index].Fee
                        },
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        }
                    }).then(function(res) {
                        $scope.fees.Fees.splice(index, 1);
                        $scope.$evalAsync();
                    }, function(res) {
                        GlobalService.SweetAlert($rootScope.lang.error, "Xóa thông tin lệ phí không thành công", "error", "#DD6B55");
                    });
                }
            });
        }

        $scope.saveFee = function saveFee() {
            if ($scope.index == -1) {
                for (var i = 0; i < $scope.fees.Fees.length; i++) {
                    if ($scope.feeSelected.Name_vi.toLowerCase() == $scope.fees.Fees[i].Name_vi.toLowerCase()) {
                        GlobalService.SweetAlert($rootScope.lang.error, "Lệ phí này đã tồn tại", "error", "#DD6B55");
                        return false;
                    }
                }
                GlobalService.NewFee($scope.feeSelected).then(function(res) {
                    $scope.fees.Fees.push($scope.feeSelected);
                }, function(res) {
                    GlobalService.SweetAlert($rootScope.lang.error, "Thêm lệ phí không thành công", "error", "#DD6B55");
                });
                $('#feeModal').modal('toggle');
            } else {
                $scope.feeUpdate.curr = {
                    Name_vi: $cookies.get('n'),
                    Fee: $cookies.get('f')
                }

                $scope.feeUpdate.new = $scope.feeSelected;
                GlobalService.UpdateFee($scope.feeUpdate).then(function(res) {
                    $scope.fees.Fees[$scope.index] = $scope.feeSelected;
                    GlobalService.SweetAlert($rootScope.lang.success, "Đã cập nhật thông tin lệ phí", "success", "#8CD4F5");
                    $('#feeModal').modal('toggle');
                }, function(res) {
                    GlobalService.SweetAlert($rootScope.lang.error, "Cập nhật thông tin lệ phí không thành công", "error", "#DD6B55");
                });
            }
        }

        $scope.checkAdmin = function checkAdmin(index) {
            if (index != -1) {
                $scope.key = index;
            } else {
                GlobalService.ConfirmPassword($rootScope.currentUser.Id, $scope.passwordValue).then(function(res) {
                    if (res.isConfirm == true) {
                        $("input#key" + $scope.key).removeAttr('disabled');
                        $('#confirmModal').modal('toggle');
                    } else {
                        GlobalService.SweetAlert($rootScope.lang.error, "Sai mật khẩu", "error", "#DD6B55");
                        return false;
                    }
                    $scope.passwordValue = "";
                }, function(res) {
                    GlobalService.SweetAlert($rootScope.lang.error, "Sai mật khẩu", "error", "#DD6B55");
                });
            }
        }

        $scope.savePaypalInfo = function savePaypalInfo() {
            GlobalService.UpdatePaypalInfo($scope.acc).then(function(res) {
                GlobalService.SweetAlert($rootScope.lang.success, "Đã cập nhật thông tin thanh toán Paypal", "success", "#8CD4F5");
            }, function(res) {
                GlobalService.SweetAlert($rootScope.lang.error, "Cập nhật thông tin Paypal không thành công", "error", "#DD6B55");
            });
        }

        $scope.updateFormSharing = function updateFormSharing() {
            if ($scope.count == 1) {
                GlobalService.UpdateForm($scope.form.KhamSucKhoe, $scope.form.ChungMinhTaiChinh).then(function(res) {
                    GlobalService.SweetAlert($rootScope.lang.success, "Đã cập nhật các biểu mẫu chung", "success", "#8CD4F5");
                }, function(res) {
                    GlobalService.SweetAlert($rootScope.lang.error, "Cập nhật biểu mẫu không thành công", "error", "#DD6B55");
                });
            } else {
                GlobalService.SweetAlert($rootScope.lang.error, "Không có biểu mẫu mới được tải lên", "error", "#DD6B55");
            }
        }
    });
})();