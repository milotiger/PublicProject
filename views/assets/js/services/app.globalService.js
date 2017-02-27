(function() {
    'use strict';

    var app = angular.module('app');

    app.factory('GlobalService', function GlobalService($resource, $cookies) {

        var AuthResource = $resource("/api/auth/login", {}, {
            Register: {
                method: "POST",
                url: "/api/auth/register"
            },
            ForgotPassword: {
                method: "POST",
                url: "/api/auth/forgot"
            },
            Current: {
                method: "GET",
                url: "/api/auth/check-login"
            },
            Reset: {
                method: "POST",
                url: "/api/auth/reset/:resetToken",
                params: { resetToken: '@resetToken' }
            },
            Confirm: {
                method: "POST",
                url: "/api/auth/confirm"
            }
        });

        var HelpResource = $resource("/api/helper/schools", {}, {
            GetService: {
                method: "GET",
                url: "/api/service",
                isArray: true
            },
            GetLang: {
                method: "GET",
                url: "/api/helper/get-language/:lang",
                params: { lang: '@lang' }
            },
            GetFee: {
                method: "GET",
                url: "/api/helper/fees-i20"
            },
            GetPaypalInfo: {
                method: "GET",
                url: "/api/admin/paypal/information"
            },
            UpdatePaypalInfo: {
                method: "PUT",
                url: "/api/admin/paypal/information"
            },
            GetForm: {
                method: "GET",
                url: "/api/admin/manage/forms"
            },
            UpdateForm: {
                method: "PUT",
                url: "/api/admin/manage/forms"
            }
        });

        var SchoolResource = $resource("/api/admin/manage/school/:schoolId", { schoolId: '@schoolId' }, {
            UpdateSchool: {
                method: "PUT",
                url: "/api/admin/manage/school/:schoolId",
                params: { schoolId: '@schoolId' }
            },
            GetSchool: {
                method: "GET",
                url: "api/helper/school/:schoolId",
                params: { schoolId: '@schoolId' }
            }
        });

        var FeeResource = $resource("api/admin/fee", {}, {
            UpdateFee: {
                method: "PUT",
                url: "api/admin/fee"
            }
        });

        var service = {
            Login: login,
            Register: register,
            ForgotPassword: forgotPassword,
            ResetPassword: resetPassword,
            CheckLogin: checkLogin,
            Schools: schools,
            GetServices: getServices,
            DateString2Date: dateString2Date,
            GetTimeStamp: getTimeStamp,
            CheckFileExtension: checkFileExtension,
            CheckFileSize: checkFileSize,
            IsValidDate: isValidDate,
            CheckValidTime: checkValidTime,
            SweetAlert: sweetAlert,
            GetLang: getLang,
            NewSchool: newSchool,
            GetSchool: getSchool,
            UpdateSchool: updateSchool,
            DeleteSchool: deleteSchool,
            GetFee: getFee,
            NewFee: newFee,
            UpdateFee: updateFee,
            GetPaypalInfo: getPaypalInfo,
            UpdatePaypalInfo: updatePaypalInfo,
            GetForm: getForm,
            ConfirmPassword: confirmPassword,
            UpdateForm: updateForm
        };

        return service;

        ////////////////
        function login(user) {
            return AuthResource.save(user).$promise;
        }

        function register(user) {
            return AuthResource.Register(user).$promise;
        }

        function forgotPassword(email) {
            var user = {
                Email: email
            };
            return AuthResource.ForgotPassword(user).$promise;
        }

        function resetPassword(user, token) {
            return AuthResource.Reset({ resetToken: token }, user).$promise;
        }

        function checkLogin() {
            return AuthResource.Current().$promise;
        }

        function confirmPassword(id, password) {
            var data = {
                Id: id,
                Password: password
            }
            return AuthResource.Confirm(data).$promise;
        }

        function schools() {
            return HelpResource.query().$promise;
        }

        function getServices() {
            return HelpResource.GetService().$promise;
        }

        function dateString2Date(dateString) {
            var dt = dateString.split('/');
            return new Date(dt[2], parseInt(dt[1] - 1), dt[0]);
        }

        function getTimeStamp(data) {
            for (var i = 0; i < data.length; i++) {
                data[i].Second = data[i].TimeStamp;
                var time = new Date(data[i].TimeStamp).toLocaleString('vi-VN');
                data[i].TimeStamp = time;
            }

            return data;
        }

        function checkFileExtension(file, type) {
            // var re = /(?:\.([^.]+))?$/;
            // var ext = re.exec(file)[1];

            // console.log(ext);
            // if (ext != undefined) {
            //     return ext.toLowerCase() == type.toLowerCase();
            // } else return false;
            if (type == "jpg" && file.type == "image/jpeg" || file.type == "image/jpg" || file.type == "image/png") {
                return true;
            } else if (type == "pdf" && file.type == "application/pdf") {
                return true;
            } else {
                return false;
            }
        }

        function checkFileSize(file) {
            return file.size < 300 * 1024;
        }

        function isValidDate(dateString) {
            // First check for the pattern
            if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
                return false;
            }
            if (dateString.indexOf("d") != -1 || dateString.indexOf("m") != -1 || dateString.indexOf("y") != -1 || dateString == "" || dateString == undefined) {
                return false;
            }

            // Parse the date parts to integers
            var parts = dateString.split("/");
            var day = parseInt(parts[0], 10);
            var month = parseInt(parts[1], 10);
            var year = parseInt(parts[2], 10);

            // Check the ranges of month and year
            if (year < 1000 || year > 3000 || month == 0 || month > 12) {
                return false;
            }

            var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            // Adjust for leap years
            if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
                monthLength[1] = 29;
            }

            // Check the range of the day
            return day > 0 && day <= monthLength[month - 1];
        }

        function checkValidTime(start, end) {
            if (dateString2Date(start) >= dateString2Date(end)) {
                sweetAlert("Lỗi", "Ngày hết hạn không thể nhỏ hơn ngày cấp bằng", "error", "#DD6B55");
                return false;
            } else return true;
        }

        function sweetAlert(title, text, type, color) {
            swal({
                title: title,
                text: text,
                type: type,
                confirmButtonColor: color,
                confirmButtonText: "OK",
                closeOnConfirm: true
            });
        }

        function getLang(language) {
            return HelpResource.GetLang({ lang: language }).$promise;
        }

        function newSchool(school) {
            return SchoolResource.save(school).$promise;
        }

        function getSchool(id) {
            return SchoolResource.GetSchool({ schoolId: id }).$promise;
        }

        function updateSchool(school, id) {
            return SchoolResource.UpdateSchool({ schoolId: id }, school).$promise;
        }

        function deleteSchool(id) {
            return SchoolResource.remove({ schoolId: id }).$promise;
        }

        function getFee() {
            return HelpResource.GetFee().$promise;
        }

        function newFee(fee) {
            return FeeResource.save(fee).$promise;
        }

        function updateFee(fee) {
            return FeeResource.UpdateFee(fee).$promise;
        }

        function getPaypalInfo() {
            return HelpResource.GetPaypalInfo().$promise;
        }

        function updatePaypalInfo(info) {
            return HelpResource.UpdatePaypalInfo(info).$promise;
        }

        function getForm() {
            return HelpResource.GetForm().$promise;
        }

        function updateForm(health, finance) {
            var data = {
                ChungMinhTaiChinh: finance,
                KhamSucKhoe: health
            }
            return HelpResource.UpdateForm(data).$promise;
        }
    });
})();