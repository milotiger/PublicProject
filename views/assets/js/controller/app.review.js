(function() {
    'use strict';
    var app = angular.module('app');
    var server = "../api";

    app.controller('reviewCtr', function($scope, $cookies, userService, $rootScope, $timeout, $state, GlobalService) {
        window.sc = $scope;

        $scope.accessToken = $cookies.get('at');
        $scope.profileID = $cookies.get('pid');
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
            }
        };
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
                Valid: true,
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
                        if ($scope.profile.BangTiengAnh.Valid) {
                            $('#onEnglish').iCheck('check');

                        } else {
                            $('#offEnglish').iCheck('check');
                        }
                    }
                    if ($state.includes('app.i20-college.chon-truong')) {
                        var query = userService.getSchool();

                        $timeout(function() {
                            $scope.schools = query.$$state.value;
                            var data = userService.getFaculty($scope.profile.Truong, $scope.schools);
                            $scope.faculty = data.value;
                            $scope.schoolIndex = data.index;
                        }, 400);
                    }

                    userService.getURL($scope.profile);
                    $scope.$evalAsync();
                }, 200);
            },
            error: function() {
                console.log("Get profile error");
            }
        });
        var service = {
            getUserProfile: getUserProfile,
            getURL: getURL,
            getEmbed: getEmbed,

        };

        return service;
        $scope.changeFile = function changeFile(index) {
            $scope.file = index;
            $scope.$evalAsync();
        }

        function getUserProfile(res, data, token) {
            if (res.HocBa != undefined && $state.includes('app.i20-college.hoc-ba') || $state.includes('app.i20-college.tong-hop')) {
                data.HocBa = res.HocBa;
                data.HocBa.ThongTinTruong.NamTotNghiep = data.HocBa.ThongTinTruong.NamTotNghiep.toString();
                console.log("HocBa done!!!");
            }
            if (res.BangTotNghiep != undefined && $state.includes('app.i20-college.bang-tot-nghiep') || $state.includes('app.i20-college.tong-hop')) {
                data.BangTotNghiep = res.BangTotNghiep;
                console.log("BangTotNghiep done!!!");
            }
            if (res.BangTiengAnh != undefined && $state.includes('app.i20-college.bang-tieng-anh') || $state.includes('app.i20-college.tong-hop')) {
                data.BangTiengAnh = res.BangTiengAnh;
                console.log("BangTiengAnh done!!!");
            }
            if (res.HinhHoChieu != undefined && $state.includes('app.i20-college.hinh-ho-chieu') || $state.includes('app.i20-college.tong-hop')) {
                data.HinhHoChieu = res.HinhHoChieu;
                console.log("HinhHoChieu done!!!");
            }
            if (res.HoChieu != undefined && $state.includes('app.i20-college.ho-chieu') || $state.includes('app.i20-college.tong-hop')) {
                data.HoChieu = res.HoChieu;
                console.log("HoChieu done!!!");
            }
            if (res.ChuKy != undefined && $state.includes('app.i20-college.chu-ky') || $state.includes('app.i20-college.tong-hop')) {
                data.ChuKy = res.ChuKy;
                console.log("ChuKy done!!!");
            }
            if (res.BieuMau != undefined && $state.includes('app.i20-college.tai-chinh-suc-khoe') || $state.includes('app.i20-college.tong-hop')) {
                data.BieuMau = res.BieuMau;
                console.log("BieuMau done!!!");
            }
            if (res.Truong != undefined && $state.includes('app.i20-college.chon-truong') || $state.includes('app.i20-college.tai-chinh-suc-khoe') || $state.includes('app.i20-college.tong-hop')) {
                data.Truong = res.Truong;
                console.log("Truong done!!!");
            }
            if ($state.includes('app.i20-college.dong-le-phi')) {
                if (res.Fees != undefined && res.Fees.length > 0) {
                    data.Fees = res.Fees;
                    console.log("LePhi done!!!");
                } else {
                    $.ajax({
                        url: server + "/helper/fees-i20",
                        method: 'GET',
                        dataType: 'json',
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                        },
                        success: function(response) {
                            console.log("Get fees successfully!!!");
                            console.log(response);
                            data.Fees = response.Fees;
                        },
                        error: function() {
                            console.log("Get fees error");
                        }
                    });
                }
            }

            return data;
        }

        function getURL(data) {
            if (data.HocBa.FileUrl != "" && data.HocBa.FileUrl != undefined) {
                getEmbed(1, data.HocBa.FileUrl);
            }
            if (data.HocBa.FileEngUrl != "" && data.HocBa.FileEngUrl != undefined) {
                getEmbed(2, data.HocBa.FileEngUrl);
            }
            if (data.BangTotNghiep.FileUrl != "" && data.BangTotNghiep.FileUrl != undefined) {
                getEmbed(3, data.BangTotNghiep.FileUrl);
            }
            if (data.BangTotNghiep.FileEngUrl != "" && data.BangTotNghiep.FileEngUrl != undefined) {
                getEmbed(4, data.BangTotNghiep.FileEngUrl);
            }
            if (data.BangTiengAnh.FileUrl != "" && data.BangTiengAnh.FileUrl != undefined) {
                getEmbed(5, data.BangTiengAnh.FileUrl);
            }
            if (data.HoChieu.FileUrl != "" && data.HoChieu.FileUrl != undefined) {
                getEmbed(6, data.HoChieu.FileUrl);
            }
            if (data.BieuMau.CMTCTruong != "" && data.BieuMau.CMTCTruong != undefined) {
                getEmbed(7, data.BieuMau.CMTCTruong);
            }
            if (data.BieuMau.CMTCNganHang != "" && data.BieuMau.CMTCNganHang != undefined) {
                getEmbed(8, data.BieuMau.CMTCNganHang);
            }
            if (data.BieuMau.KSKTruong != "" && data.BieuMau.KSKTruong != undefined) {
                getEmbed(9, data.BieuMau.KSKTruong);
            }
            if (data.BieuMau.KSKBenhVien != "" && data.BieuMau.KSKBenhVien != undefined) {
                getEmbed(10, data.BieuMau.KSKBenhVien);
            }
            if (data.HinhHoChieu.FileUrl != "" && data.HinhHoChieu.FileUrl != undefined) {
                getEmbed(11, data.HinhHoChieu.FileUrl);
            }
            if (data.ChuKy.NguoiDangKy != "" && data.ChuKy.NguoiDangKy != undefined) {
                getEmbed(12, data.ChuKy.NguoiDangKy);
            }
            if (data.ChuKy.NguoiGiamHo != "" && data.ChuKy.NguoiGiamHo != undefined) {
                getEmbed(13, data.ChuKy.NguoiGiamHo);
            }
        }

        function getEmbed(arg, data) {
            var embed = "";
            if (arg < 11) {
                embed = '<embed src="' + window.location.origin + '/' + data + '" width="100%" height="600px" type="application/pdf" />';
            } else {
                embed = '<img src="' + window.location.origin + '' + data + '" class="img-responsive" width="570px"/>';
            }
            $('#profile' + arg + ' embed').remove();
            $('#profile' + arg).append(embed);
            $('.progress-bar.' + arg).text(100 + '%');
            $('.progress-bar.' + arg).width(100 + '%');
        }

    });
})();