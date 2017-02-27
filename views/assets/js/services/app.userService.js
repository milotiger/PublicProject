(function() {
    'use strict';
    var app = angular.module('app');
    var server = "../api";

    app.factory('userService', function($timeout, $window, $state, $resource, $rootScope, GlobalService) {
        var PaypalResource = $resource("/api/paypal/send-invoice/:i20Id", { i20Id: '@i20Id' }, {
            CheckPayment: {
                method: "GET",
                url: "/api/paypal/check-paid/:i20Id",
                params: { i20Id: '@i20Id' }
            },
            PaymentDetail: {
                method: "GET",
                url: "/api/paypal/invoice-detail/:invoiceId",
                params: { invoiceId: '@invoiceId' }
            }
        });

        var service = {
            checkDataUpload: checkDataUpload,
            getBasicInfo: getBasicInfo,
            getUserProfile: getUserProfile,
            getURL: getURL,
            getEmbed: getEmbed,
            getYear: getYear,
            updateURL: updateURL,
            updateStage: updateStage,
            goToState: goToState,
            checkAllRequired: checkAllRequired,
            checkState: checkState,
            setValidStep: setValidStep,
            checkStep: checkStep,
            getFaculty: getFaculty,
            callPayment: callPayment,
            checkPayment: checkPayment,
            paymentDetail: paymentDetail
        };
        var currentStep = 0;

        return service;

        ////////////////
        function checkDataUpload(loaiHoSo, data) {
            var save = {
                value: {},
                name: "",
                stage: "",
            };

            switch (loaiHoSo) {
                case 0:
                    save.value = data.HocBa;
                    save.name = "hoc-ba";
                    save.stage = "Học Bạ";
                    break;
                case 1:
                    save.value = data.BangTotNghiep;
                    save.name = "bang-tot-nghiep";
                    save.stage = "Bằng Tốt Nghiệp";
                    break;
                case 2:
                    save.value = data.BangTiengAnh;
                    save.name = "bang-tieng-anh";
                    save.stage = "Bằng Tiếng Anh";
                    break;
                case 3:
                    save.value = data.HoChieu;
                    save.name = "ho-chieu";
                    save.stage = "Hộ Chiếu";
                    break;
                case 4:
                    save.value = data.HinhHoChieu;
                    save.name = "hinh-ho-chieu";
                    save.stage = "Hình Hộ Chiếu";
                    break;
                case 5:
                    save.value = data.ChuKy;
                    save.name = "chu-ky";
                    save.stage = "Chữ Ký";
                    break;
                case 6:
                    save.value = data.Truong;
                    save.name = "truong";
                    save.stage = "Trường";
                    break;
                case 7:
                    save.value = data.BieuMau;
                    save.name = "bieu-mau";
                    save.stage = "Tài Chính - Sức Khỏe";
                    break;
            }

            return save;
        }

        function getBasicInfo(res, data) {
            if (res.HoTen != undefined) {
                data.HoTen = res.HoTen;
            }
            if (res.GioiTinh == undefined) {
                data.GioiTinh = "";
            } else if (res.GioiTinh) {
                data.GioiTinh = "Nam";
            } else {
                data.GioiTinh = "Nữ";
            }
            if (res.NgaySinh != undefined) {
                data.NgaySinh = res.NgaySinh;
            }
            if (res.NoiSinh != undefined) {
                data.NoiSinh = res.NoiSinh;
            }
            if (res.QuocTich != undefined) {
                data.QuocTich = res.QuocTich;
            }
            if (res.DiaChi != undefined) {
                data.DiaChi = res.DiaChi;
            }
            if (res.SoDienThoai != undefined) {
                data.SoDienThoai = res.SoDienThoai;
            }
            if (res.Email != undefined) {
                data.Email = res.Email;
            }
            if (res.NguoiGiamHo != undefined) {
                if (res.NguoiGiamHo.HoTen != undefined) {
                    data.NguoiGiamHo.HoTen = res.NguoiGiamHo.HoTen;
                }
                if (res.NguoiGiamHo.QuanHe != undefined) {
                    data.NguoiGiamHo.QuanHe = res.NguoiGiamHo.QuanHe;
                } else {
                    data.NguoiGiamHo.QuanHe = "";
                }
                if (res.NguoiGiamHo.DiaChi != undefined) {
                    data.NguoiGiamHo.DiaChi = res.NguoiGiamHo.DiaChi;
                }
            }
            return data;
        }

        function getUserProfile(res, data, token) {
            data.Step = res.Step;
            if (res.HocBa != undefined && $state.includes('app.i20-college.hoc-ba') || $state.includes('app.i20-college.tong-hop') || $state.includes('app.admin.quan-ly-dich-vu.check-i20')) {
                data.HocBa = res.HocBa;
                if (res.HocBa.ThongTinTruong != undefined) {
                    if (res.HocBa.ThongTinTruong.NamTotNghiep != undefined) {
                        data.HocBa.ThongTinTruong.NamTotNghiep = res.HocBa.ThongTinTruong.NamTotNghiep.toString();
                    }
                }
                console.log("HocBa done!!!");
            }
            if (res.BangTotNghiep != undefined && $state.includes('app.i20-college.bang-tot-nghiep') || $state.includes('app.i20-college.tong-hop') || $state.includes('app.admin.quan-ly-dich-vu.check-i20')) {
                data.BangTotNghiep = res.BangTotNghiep;
                console.log("BangTotNghiep done!!!");
            }
            if (res.BangTiengAnh != undefined && $state.includes('app.i20-college.bang-tieng-anh') || $state.includes('app.i20-college.tong-hop') || $state.includes('app.admin.quan-ly-dich-vu.check-i20')) {
                data.BangTiengAnh = res.BangTiengAnh;
                console.log("BangTiengAnh done!!!");
            }
            if (res.HinhHoChieu != undefined && $state.includes('app.i20-college.hinh-ho-chieu') || $state.includes('app.i20-college.tong-hop') || $state.includes('app.admin.quan-ly-dich-vu.check-i20')) {
                data.HinhHoChieu = res.HinhHoChieu;
                console.log("HinhHoChieu done!!!");
            }
            if (res.HoChieu != undefined && $state.includes('app.i20-college.ho-chieu') || $state.includes('app.i20-college.tong-hop') || $state.includes('app.admin.quan-ly-dich-vu.check-i20')) {
                data.HoChieu = res.HoChieu;
                console.log("HoChieu done!!!");
            }
            if (res.ChuKy != undefined && $state.includes('app.i20-college.chu-ky') || $state.includes('app.i20-college.tong-hop') || $state.includes('app.admin.quan-ly-dich-vu.check-i20')) {
                data.ChuKy = res.ChuKy;
                console.log("ChuKy done!!!");
            }
            if (res.BieuMau != undefined && $state.includes('app.i20-college.tai-chinh-suc-khoe') || $state.includes('app.i20-college.tong-hop') || $state.includes('app.admin.quan-ly-dich-vu.check-i20')) {
                data.BieuMau = res.BieuMau;
                if (res.Truong != undefined) {
                    data.Truong = res.Truong;
                }
                console.log("BieuMau done!!!");
            }
            if (res.Truong != undefined && $state.includes('app.i20-college.chon-truong') || $state.includes('app.i20-college.tai-chinh-suc-khoe') || $state.includes('app.i20-college.tong-hop') || $state.includes('app.admin.quan-ly-dich-vu.check-i20')) {
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
                embed = '<embed src="' + data + '" width="100%" height="600px" type="application/pdf" />';
            } else {
                embed = '<img src="' + data + '" class="img-responsive" width="570px"/>';
            }
            $('#profile' + arg + ' embed').remove();
            $('#profile' + arg).append(embed);
            $('.progress-bar.' + arg).text(100 + '%');
            $('.progress-bar.' + arg).width(100 + '%');
        }

        function getYear() {
            var year = [];
            var date = new Date();
            for (var i = 2005; i < date.getFullYear(); i++) {
                year.push(i);
            }

            return year;
        }

        function updateURL(res, data, index) {
            if (index === 1) {
                data.HocBa.FileUrl = res.url;
            } else if (index === 2) {
                data.HocBa.FileEngUrl = res.url;
            } else if (index === 3) {
                data.BangTotNghiep.FileUrl = res.url;
            } else if (index === 4) {
                data.BangTotNghiep.FileEngUrl = res.url;
            } else if (index === 5) {
                data.BangTiengAnh.FileUrl = res.url;
            } else if (index === 6) {
                data.HoChieu.FileUrl = res.url;
            } else if (index === 7) {
                data.BieuMau.CMTCTruong = res.url;
            } else if (index === 8) {
                data.BieuMau.CMTCNganHang = res.url;
            } else if (index === 9) {
                data.BieuMau.KSKTruong = res.url;
            } else if (index === 10) {
                data.BieuMau.KSKBenhVien = res.url;
            } else if (index === 11) {
                data.HinhHoChieu.FileUrl = res.url;
            } else if (index === 12) {
                data.ChuKy.NguoiDangKy = res.url;
            } else if (index === 13) {
                data.ChuKy.NguoiGiamHo = res.url;
            } else {
                console.log("None updated");
            }

            return data;
        }

        function updateStage(stage, id, token) {
            var data = {
                stage: stage
            }

            $.ajax({
                url: server + "/service/update/" + id,
                type: 'POST',
                dataType: 'json',
                data: data,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                },
                success: function(res) {
                    console.log("Update stage successfully!!!");
                },
                error: function(res) {
                    console.log("Update stage error!!!");
                }
            });
        }

        function goToState(index) {
            switch (index) {
                case 0:
                    if (!$state.includes('app.i20-college.thong-tin')) { $state.go('app.i20-college.thong-tin'); }
                    break;
                case 1:
                    if (!$state.includes('app.i20-college.hoc-ba')) { $state.go('app.i20-college.hoc-ba'); }
                    break;
                case 2:
                    if (!$state.includes('app.i20-college.bang-tot-nghiep')) { $state.go('app.i20-college.bang-tot-nghiep'); }
                    break;
                case 3:
                    if (!$state.includes('app.i20-college.bang-tieng-anh')) { $state.go('app.i20-college.bang-tieng-anh'); }
                    break;
                case 4:
                    if (!$state.includes('app.i20-college.ho-chieu')) { $state.go('app.i20-college.ho-chieu'); }
                    break;
                case 5:
                    if (!$state.includes('app.i20-college.hinh-ho-chieu')) { $state.go('app.i20-college.hinh-ho-chieu'); }
                    break;
                case 6:
                    if (!$state.includes('app.i20-college.chu-ky')) { $state.go('app.i20-college.chu-ky'); }
                    break;
                case 7:
                    if (!$state.includes('app.i20-college.chon-truong')) { $state.go('app.i20-college.chon-truong'); }
                    break;
                case 8:
                    if (!$state.includes('app.i20-college.tai-chinh-suc-khoe')) { $state.go('app.i20-college.tai-chinh-suc-khoe', { 'selectedSchool': $rootScope.selectedSchool }); }
                    break;
                case 9:
                    if (!$state.includes('app.i20-college.dong-le-phi')) { $state.go('app.i20-college.dong-le-phi'); }
                    break;
                case 10:
                    if (!$state.includes('app.i20-college.xu-ly')) { $state.go('app.i20-college.xu-ly'); }
                    break;
            }
        }

        function checkAllRequired(loaiHoSo, data, checked) {
            if (loaiHoSo === 0) {
                if (data.FileUrl == undefined || data.FileEngUrl == undefined || data.FileUrl == "" || data.FileEngUrl == "") {
                    GlobalService.SweetAlert("Lỗi", "Thiếu tập tin học bạ", "error", "#DD6B55");
                    return false;
                }
                if (data.ThongTinTruong.NamTotNghiep == "" || data.ThongTinTruong.NamTotNghiep == undefined) {
                    GlobalService.SweetAlert("Lỗi", "Năm tốt nghiệp không được trống", "error", "#DD6B55");
                    return false;
                }
                if (data.KetQua.Lop10.HocLuc == undefined || data.KetQua.Lop10.HanhKiem == undefined || data.KetQua.Lop11.HocLuc == undefined || data.KetQua.Lop11.HanhKiem == undefined || data.KetQua.Lop12.HocLuc == undefined || data.KetQua.Lop12.HanhKiem == undefined || data.KetQua.Lop10.HocLuc == "" || data.KetQua.Lop10.HanhKiem == "" || data.KetQua.Lop11.HocLuc == "" || data.KetQua.Lop11.HanhKiem == "" || data.KetQua.Lop12.HocLuc == "" || data.KetQua.Lop12.HanhKiem == "") {
                    GlobalService.SweetAlert("Lỗi", "Học lực và hạnh kiểm không được trống", "error", "#DD6B55");
                    return false;
                }
                for (var i = 0; i < 3; i++) {
                    if (parseFloat($('#mathPoint' + i).val()) > 10) {
                        GlobalService.SweetAlert("Lỗi", "Điểm Toán không thể lớn hơn 10", "error", "#DD6B55");
                        return false;
                    }
                }
            } else if (loaiHoSo === 1) {
                if (data.FileUrl == undefined || data.FileEngUrl == undefined || data.FileUrl == "" || data.FileEngUrl == "") {
                    GlobalService.SweetAlert("Lỗi", "Thiếu tập tin bằng tốt nghiệp", "error", "#DD6B55");
                    return false;
                }
                if (!GlobalService.IsValidDate(data.NgayCapBang)) {
                    GlobalService.SweetAlert("Lỗi", "Ngày cấp bằng không tồn tại", "error", "#DD6B55");
                    return false;
                }
                if (data.XepLoai == undefined || data.XepLoai == "") {
                    GlobalService.SweetAlert("Lỗi", "Xếp loại không được trống", "error", "#DD6B55");
                    return false;
                }
            } else if (loaiHoSo === 2) {
                if (!data.Valid) {
                    return true;
                } else {
                    if (data.FileUrl == undefined || data.FileUrl == "") {
                        GlobalService.SweetAlert("Lỗi", "Thiếu tập tin bằng tiếng anh", "error", "#DD6B55");
                        return false;
                    }
                    // if (parseFloat(data.Diem.Nghe) > 10 || parseFloat(data.Diem.Noi) > 10 || parseFloat(data.Diem.Doc) > 10 || parseFloat(data.Diem.Viet) > 10 || parseFloat(data.Diem.DiemTong) > 10) {
                    //     GlobalService.SweetAlert("Lỗi", "Điểm không thể lớn hơn 10", "error", "#DD6B55");
                    //     return false;
                    // }
                    if (data.LoaiBang == "" || data.LoaiBang == undefined) {
                        GlobalService.SweetAlert("Lỗi", "Loại bằng không được trống", "error", "#DD6B55");
                        return false;
                    }
                }
            } else if (loaiHoSo === 3) {
                if (data.FileUrl == undefined || data.FileUrl == "") {
                    GlobalService.SweetAlert("Lỗi", "Thiếu tập tin hộ chiếu", "error", "#DD6B55");
                    return false;
                }
                if (!GlobalService.IsValidDate(data.NgayCap) || !GlobalService.IsValidDate(data.NgayHetHan)) {
                    GlobalService.SweetAlert("Lỗi", "Ngày cấp hoặc ngày hết hạn không tồn tại", "error", "#DD6B55");
                    return false;
                }
                if (!GlobalService.CheckValidTime(data.NgayCap, data.NgayHetHan)) {
                    return false;
                }
            } else if (loaiHoSo === 4) {
                if (data.FileUrl == undefined || data.FileUrl == "") {
                    GlobalService.SweetAlert("Lỗi", "Thiếu hình hộ chiếu", "error", "#DD6B55");
                    return false;
                }
            } else if (loaiHoSo === 5) {
                if (data.NguoiDangKy == undefined || data.NguoiGiamHo == undefined || data.NguoiDangKy == "" || data.NguoiGiamHo == "") {
                    GlobalService.SweetAlert("Lỗi", "Thiếu chữ ký của người đăng ký hoặc người giám hộ", "error", "#DD6B55");
                    return false;
                }
            } else if (loaiHoSo === 6) {
                if (data.Id == undefined || data.Id == "") {
                    GlobalService.SweetAlert("Lỗi", "Chưa chọn trường", "error", "#DD6B55");
                    return false;
                }
                if (checked.length > 0) {
                    if (data.Nganh1 == undefined || data.Nganh1 == "") {
                        GlobalService.SweetAlert("Lỗi", "Phải chọn ngành 1", "error", "#DD6B55");
                        return false;
                    }
                    if (data.Nganh1 == data.Nganh2) {
                        GlobalService.SweetAlert("Lỗi", "Hai nguyện vọng không được giống nhau", "error", "#DD6B55");
                        return false;
                    }
                }
            } else if (loaiHoSo === 7) {
                if (data.CMTCTruong == undefined || data.CMTCNganHang == undefined || data.CMTCTruong == "" || data.CMTCNganHang == "") {
                    GlobalService.SweetAlert("Lỗi", "Thiếu tập tin chứng minh tài chính", "error", "#DD6B55");
                    return false;
                }
                if (data.KSKTruong == undefined || data.KSKBenhVien == undefined || data.KSKTruong == "" || data.KSKBenhVien == "") {
                    GlobalService.SweetAlert("Lỗi", "hiếu tập tin kiểm tra sức khỏe", "error", "#DD6B55");
                    return false;
                }
            } else {

            }

            return true;
        }

        function checkState(index, token, id) {
            $.ajax({
                url: server + "/profile/step/" + id,
                type: 'POST',
                dataType: 'json',
                data: { Step: index },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                },
                success: function(res) {
                    console.log("Check state successfully!!!");
                    setValidStep(index);
                    return true;
                },
                error: function() {
                    console.log("Check state error!!!");
                    return false;
                }
            });
        }

        function setValidStep(step) {
            if (currentStep < step) {
                currentStep = step;
            }

            for (var i = currentStep + 1; i < 11; i++) {
                $('#state' + i).removeClass('no-drop');
                $('#state' + i).addClass('no-drop');
                $("style").remove();
            }

            for (var i = 0; i < currentStep; i++) {
                $('#state' + i).removeClass('no-drop');
                $('#state' + currentStep).removeClass('no-drop');

                var element = '#state' + i;
                var icon = String.fromCharCode(34) + String.fromCharCode(92) + "f00c" + String.fromCharCode(34);
                var css = element + ':after { font-family: FontAwesome; content:' + icon + '; display: inline-block; padding-left: 15px; vertical-align: middle; color: #4CAF50; margin-top: -5px; }';
                $("head").append($('<style> ' + css + ' </style>'));
            }

            if (currentStep === 10) {
                for (var i = 0; i < currentStep; i++) {
                    $('#state' + i).removeClass('no-drop');
                    $('#state' + i).addClass('no-drop');
                }
            }
        }

        function checkStep(index) {
            if (index > currentStep) {
                return false;
            } else if (index === -1) {
                currentStep = 0;
                $state.go('app');
                return true;
            } else if (currentStep === 10) {
                return false;
            } else {
                goToState(index);
                return true;
            }
        }

        function getFaculty(data, school) {
            var result = {};
            for (var i = 0; i < school.length; i++) {
                if (data.Id == school[i]._id) {
                    result.value = school[i].Nganh;
                    result.index = i;
                    console.log(result);
                }
            }
            return result;
        }

        function callPayment(email, id) {
            var data = {
                Email: email
            }

            return PaypalResource.save({ i20Id: id }, data).$promise;
        }

        function checkPayment(id) {
            return PaypalResource.CheckPayment({ i20Id: id }).$promise;
        }

        function paymentDetail(id) {
            return PaypalResource.PaymentDetail({ invoiceId: id }).$promise;
        }
    });
})();