(function() {
    'use strict';
    var app = angular.module('app');
    var server = "../api";

    app.controller('profileCtr', function($scope, $cookies, $rootScope, $timeout, $state, userService, GlobalService) {
        window.sc = $scope;

        $scope.selectedSchool = $state.params.selectedSchool;
        $scope.accessToken = $cookies.get('at');
        $scope.profileID = $cookies.get('pid');
        $scope.adminStep = $cookies.get('adminStep');
        $scope.currentUser = $rootScope.currentUser;
        $scope.file = 1;
        $scope.step = 0;
        $scope.schoolIndex = 0;
        $scope.payType = true;

        $scope.isWait = false;

        $scope.profile = {
            UserId: $scope.currentUser.Id,
            HocBa: {
                FileUrl: "",
                FileEngUrl: "",
                ThongTinTruong: {
                    TenTruong: "",
                    NamTotNghiep: "",
                    DiaChi: {
                        SoNha: "",
                        ThanhPho: "",
                        QuocGia: "Việt Nam"
                    }
                },
                KetQua: {
                    Lop10: {
                        HocLuc: "",
                        HanhKiem: "",
                        DiemToan: ""
                    },
                    Lop11: {
                        HocLuc: "",
                        HanhKiem: "",
                        DiemToan: ""
                    },
                    Lop12: {
                        HocLuc: "",
                        HanhKiem: "",
                        DiemToan: ""
                    }
                },
            },
            BangTotNghiep: {
                FileUrl: "",
                FileEngUrl: "",
                NgayCapBang: "",
                XepLoai: "",
            },
            BangTiengAnh: {
                Valid: false,
                FileUrl: "",
                LoaiBang: "",
                NgayThi: "",
                Diem: {
                    DiemTong: "",
                    Nghe: "",
                    Noi: "",
                    Doc: "",
                    Viet: ""
                }
            },
            HoChieu: {
                FileUrl: "",
                SoHoChieu: "",
                NgayCap: "",
                NgayHetHan: ""
            },
            HinhHoChieu: {
                FileUrl: ""
            },
            ChuKy: {
                NguoiDangKy: "",
                NguoiGiamHo: ""
            },
            BieuMau: {
                CMTCTruong: "",
                CMTCNganHang: "",
                KSKTruong: "",
                KSKBenhVien: "",
            },
            Truong: {
                Id: "",
                TenTruong: "",
                Nganh1: "",
                Nganh2: ""
            }
        };

        $scope.nations = ["Việt Nam", "Mỹ", "Anh", "Nhật Bản", "Hàn Quốc", "Pháp"];
        $scope.hoclucs = ["Giỏi", "Khá", "Trung Bình", "Yếu", "Kém"];
        $scope.hanhkiems = ["Tốt", "Khá", "Trung Bình", "Yếu", "Kém"];
        $scope.xeploais = ["Giỏi", "Khá", "Trung Bình", "Yếu"];
        $scope.loaibangs = ["IELTS", "TOEFL", "TOEIC", "CEFR"];

        activates();

        /////////////

        function activates() {
            var name = $scope.currentUser.HoTen.split(' ');
            var lastname = "";
            for (var i = 0; i < name.length - 1; i++) {
                lastname += name[i] + " ";
            }

            $scope.paypal = {
                LastName: lastname,
                FirstName: name[name.length - 1],
                Email: $scope.currentUser.Email,
                Nation: "Việt Nam"
            }

            // Get lasted profile of service
            $.ajax({
                url: server + "/profile/user-profile/" + $scope.profileID,
                method: 'GET',
                dataType: 'json',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + $scope.accessToken);
                },
                success: function(res) {
                    console.log("Get profile successfully");
                    // Check and set data to profile
                    $scope.profile = userService.getUserProfile(res, $scope.profile, $scope.accessToken);
                    $scope.graduationYear = userService.getYear();

                    $timeout(function() {
                        if ($state.includes('app.i20-college.bang-tieng-anh')) {
                            $scope.english = $scope.profile.BangTiengAnh.Valid;
                            if ($scope.profile.BangTiengAnh.Valid || $scope.profile.BangTiengAnh.Valid == undefined) {
                                $('#onEnglish').iCheck('check');

                            } else {
                                $('#offEnglish').iCheck('check');
                            }
                        }
                        if ($state.includes('app.i20-college.chon-truong')) {
                            GlobalService.Schools().then(function(res) {
                                $scope.schools = res;
                                var data = userService.getFaculty($scope.profile.Truong, $scope.schools);

                                $scope.faculty = data.value;
                                $scope.schoolIndex = data.index;
                                $('#r-btn-' + data.index).iCheck('check');
                            });
                        }
                        if ($state.includes('app.i20-college.tai-chinh-suc-khoe')) {
                            GlobalService.GetForm().then(function(res) {
                                $scope.backup = res;
                            });

                            if ($scope.profile.Truong != undefined) {
                                $scope.selectedSchool = $scope.profile.Truong.TenTruong;

                                GlobalService.GetSchool($scope.profile.Truong.Id).then(function(res) {
                                    $scope.form = res;

                                    if ($scope.form.ChungMinhTaiChinh == null) {
                                        $scope.form.ChungMinhTaiChinh = $scope.backup.ChungMinhTaiChinh;
                                    }
                                    if ($scope.form.MauKhamSucKhoe == null) {
                                        $scope.form.MauKhamSucKhoe = $scope.backup.KhamSucKhoe;
                                    }
                                });
                            }
                        }
                        if ($state.includes('app.i20-college.xu-ly')) {
                            userService.checkPayment($scope.profileID).then(function(res) {
                                $scope.paid = res;
                                console.log($scope.paid);
                            }, function(res) {
                                $scope.paid = res.data;
                                console.log($scope.paid);
                            });
                        }

                        userService.getURL($scope.profile);
                        $scope.$evalAsync();
                    }, 200);
                },
                error: function() {
                    console.log("Get profile error");
                }
            });
        }

        $scope.saveInfo = function saveInfo(loaiHoSo) {
            $scope.uploadData = userService.checkDataUpload(loaiHoSo, $scope.profile);
            if (!userService.checkAllRequired(loaiHoSo, $scope.uploadData.value, $scope.faculty)) {
                return false;
            }
            if (loaiHoSo === 2 && !$scope.english) {
                $scope.uploadData.value = {
                    Valid: false
                };
            }

            $.ajax({
                url: server + "/profile/" + $scope.uploadData.name + "/" + $scope.profileID,
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify($scope.uploadData.value),
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + $scope.accessToken);
                },
                success: function() {
                    console.log("Update successfully");
                    $scope.saveSuccess(loaiHoSo, $scope.uploadData.stage);
                },
                error: function(res) {
                    console.log("Update error");
                    swal({
                        title: $rootScope.lang.unsuccess,
                        text: res.responseJSON.message,
                        type: "error",
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "OK",
                        closeOnConfirm: true
                    });
                }
            });
        }

        $scope.chooseFile = function chooseFile(arg) {
            $('#uploadFile' + arg).click();
            $('.progress-bar.' + arg).text('0%');
            $('.progress-bar.' + arg).width('0%');
        }

        $scope.uploadFile = function uploadFile(arg) {
            var files = $('#uploadFile' + arg).get(0).files;

            var file = files[0];
            if (files.length > 0) {
                $scope.isWait = true;
                $scope.$evalAsync();

                // add the files to formData object for the data payload
                var formData = new FormData();

                console.log(file);
                // Check file upload is pdf, jpg or not.
                if (arg < 11) {
                    if (GlobalService.CheckFileExtension(file, "pdf")) {
                        formData.append('file', files[0]);
                    } else {
                        swal({
                            title: $rootScope.lang.file_error,
                            text: $rootScope.lang.pdf,
                            type: "error",
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "OK",
                            closeOnConfirm: true
                        });
                        $scope.isWait = false;
                        $scope.$evalAsync();
                        return false;
                    }
                } else {
                    if (GlobalService.CheckFileExtension(file, "jpg")) {
                        if (GlobalService.CheckFileSize(file)) {
                            formData.append('file', files[0]);
                        } else {
                            swal({
                                title: $rootScope.lang.error_file,
                                text: $rootScope.lang.file_capacity,
                                type: "error",
                                confirmButtonColor: "#DD6B55",
                                confirmButtonText: "OK",
                                closeOnConfirm: true
                            });
                            $scope.isWait = false;
                            $scope.$evalAsync();
                            return false;
                        }
                    } else {
                        swal({
                            title: $rootScope.lang.error_file,
                            text: $rootScope.lang.JPG_PNG,
                            type: "error",
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "OK",
                            closeOnConfirm: true
                        });
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
                                $('.progress-bar.' + arg).text(percentComplete + '%');
                                $('.progress-bar.' + arg).width(percentComplete + '%');

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

                        userService.getEmbed(arg, res.url);
                        $scope.profile = userService.updateURL(res, $scope.profile, arg);
                        $scope.isWait = false;
                        $scope.$evalAsync();
                    },
                    error: function() {
                        console.log("Upload file error");
                        $scope.isWait = false;
                        $scope.$evalAsync();
                    }
                });
            }
        }

        $('#uploadFile1').on('change', function() {
            $scope.uploadFile(1);
        });
        $('#uploadFile2').on('change', function() {
            $scope.uploadFile(2);
        });
        $('#uploadFile3').on('change', function() {
            $scope.uploadFile(3);
        });
        $('#uploadFile4').on('change', function() {
            $scope.uploadFile(4);
        });
        $('#uploadFile5').on('change', function() {
            $scope.uploadFile(5);
        });
        $('#uploadFile6').on('change', function() {
            $scope.uploadFile(6);
        });
        $('#uploadFile7').on('change', function() {
            $scope.uploadFile(7);
        });
        $('#uploadFile8').on('change', function() {
            $scope.uploadFile(8);
        });
        $('#uploadFile9').on('change', function() {
            $scope.uploadFile(9);
        });
        $('#uploadFile10').on('change', function() {
            $scope.uploadFile(10);
        });
        $('#uploadFile11').on('change', function() {
            $scope.uploadFile(11);
        });
        $('#uploadFile12').on('change', function() {
            $scope.uploadFile(12);
        });
        $('#uploadFile13').on('change', function() {
            $scope.uploadFile(13);
        });

        $('#onEnglish').on('ifClicked', function() {
            $scope.english = true;
            $scope.profile.BangTiengAnh.Valid = true;
            $scope.$evalAsync();
        });
        $('#offEnglish').on('ifClicked', function() {
            $scope.english = false;
            $scope.profile.BangTiengAnh.Valid = false;
            $scope.$evalAsync();
        });

        $('#paypal').on('ifClicked', function() {
            $scope.payType = true;
            $scope.$evalAsync();
        });
        $('#later').on('ifClicked', function() {
            $scope.payType = false;
            $scope.$evalAsync();
        });

        $scope.changeFaculty = function changeFaculty(index) {
            $scope.profile.Truong.Id = $scope.schools[index]._id;
            $scope.profile.Truong.TenTruong = $scope.schools[index].TenTruong;
            $scope.profile.Truong.Nganh1 = "";
            $scope.profile.Truong.Nganh2 = "";

            $scope.faculty = $scope.schools[index].Nganh;
            $rootScope.selectedSchool = $scope.schools[index].TenTruong;


            $timeout(function() {
                $('.select2').select2();
            }, 200);
            $scope.$evalAsync();
            console.log("Faculty changed!!!");
        }

        $scope.backToSchool = function backToSchool() {
            $state.go('app.i20-college.chon-truong');
        }

        $scope.changeFile = function changeFile(index) {
            $scope.file = index;
            $scope.$evalAsync();
        }

        $scope.saveSuccess = function saveSuccess(loaiHoSo, stage) {
            swal({
                title: $rootScope.lang.success,
                text: $rootScope.lang.all_save,
                type: "success",
                confirmButtonText: "OK",
                closeOnConfirm: true
            });

            userService.updateStage(stage, $scope.profileID, $scope.accessToken);
            userService.checkState(loaiHoSo + 2, $scope.accessToken, $scope.profileID);
            userService.goToState(loaiHoSo + 2);
        }

        $scope.payment = function payment(valid) {
            if (valid) {
                $scope.isWait = true;
                $scope.$evalAsync();

                userService.callPayment($scope.paypal.Email, $scope.profileID).then(function(res) {
                    console.log(res);
                    $scope.isWait = false;
                    $scope.$evalAsync();
                    swal({
                        title: $rootScope.lang.success,
                        text: $rootScope.lang.invoices,
                        type: "success",
                        showCancelButton: true,
                        confirmButtonText: $rootScope.lang.pay_now,
                        cancelButtonText: $rootScope.lang.pay_later,
                        closeOnConfirm: true
                    }, function(isConfirm) {
                        if (isConfirm) {
                            window.open(res.invoice_metadata.payer_view_url, '_blank');
                            $scope.lastStep();
                        } else {
                            $scope.lastStep();
                        }
                    });
                });
            } else {
                $scope.lastStep();
            }
        }

        $scope.lastStep = function lastStep() {
            $.ajax({
                type: "GET",
                url: server + "/profile/fees/" + $scope.profileID,
                dataType: "json",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + $scope.accessToken);
                },
                success: function(response) {
                    $scope.saveSuccess(8, "Đóng Lệ Phí");
                },
                error: function(response) {
                    GlobalService.SweetAlert($rootScope.lang.unsuccess, response.responseJSON.message, "error", "#DD6B55");
                }
            });
        }

        $scope.rePayment = function rePayment() {
            $scope.isWait = true;
            $scope.$evalAsync();
            if ($scope.paid.invoices.length > 0 && $scope.paid != undefined) {
                userService.paymentDetail($scope.paid.invoices[$scope.paid.invoices.length - 1]).then(function(res) {
                    // console.log(res);
                    window.open(res.metadata.payer_view_url, '_blank');
                    $scope.isWait = false;
                    $scope.$evalAsync();
                });
            } else {
                userService.callPayment($scope.paypal.Email, $scope.profileID).then(function(res) {
                    // console.log(res);
                    window.open(res.invoice_metadata.payer_view_url, '_blank');
                    $scope.isWait = false;
                    $scope.$evalAsync();
                });
            }
        }

        $scope.printPdf = function(elementID) {
            let getMyFrame = document.getElementById(elementID);
            getMyFrame.focus();
            getMyFrame.contentWindow.print();
        }
    });
})();