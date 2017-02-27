(function () {
    var app = angular.module('app');
    var server = "../api";

    // app.directive('validPassword', function() {
    //     return {
    //         require: 'ngModel',
    //         scope: {
    //             reference: '=validPassword'
    //         },
    //         link: function(scope, elm, attrs, ctrl) {
    //             ctrl.$parsers.unshift(function(viewValue, $scope) {
    //                 var noMatch = viewValue != scope.reference;

    //                 ctrl.$setValidity('noMatch', !noMatch);
    //                 return (noMatch) ? noMatch : !noMatch;
    //             });

    //             scope.$watch("reference", function(value) {;
    //                 ctrl.$setValidity('noMatch', value === ctrl.$viewValue);
    //             });
    //         }
    //     }
    // });

    app.directive('embedSrc', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var current = element;
                scope.$watch(function() { return attrs.embedSrc; }, function () {
                    var clone = element
                        .clone()
                        .attr('src', attrs.embedSrc);
                    current.replaceWith(clone);
                    current = clone;
                });
            }
        };
    });

    app.directive('sibs', function () {
        return {
            link: function (scope, element, attrs) {
                element.bind('click', function () {
                    element.parent().children().removeClass('clicked');
                    element.addClass('clicked');
                })
            },
        }
    });

    app.directive('icheck', function ($timeout, $parse) {
        return {
            require: 'ngModel',
            link: function ($scope, element, $attrs, ngModel) {
                return $timeout(function () {
                    var value;
                    value = $attrs['value'];

                    $scope.$watch($attrs['ngModel'], function (newValue) {
                        $(element).iCheck('update');
                    })

                    return $(element).iCheck({
                        checkboxClass: 'icheckbox_square-blue',
                        radioClass: 'iradio_square-blue'

                    }).on('ifChanged', function (event) {
                        if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                            $scope.$apply(function () {
                                return ngModel.$setViewValue(event.target.checked);
                            });
                        }
                        if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                            return $scope.$apply(function () {
                                return ngModel.$setViewValue(value);
                            });
                        }
                    });
                });
            }
        };
    });

    app.directive('customOnChange', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var onChangeFunc = scope.$eval(attrs.customOnChange);
                element.bind('change', function (event) {
                    var files = event.target.files;
                    onChangeFunc(files);
                });

                element.bind('click', function () {
                    element.val('');
                });
            }
        };
    });

    app.run(function ($timeout, $rootScope, $http, $cookies, $window) {
        var accessToken = $cookies.get('at');
        $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;

        if (accessToken == null) {
            if (!($window.location.pathname === "/pages/login.html")) {
                $window.location.pathname = "/pages/login.html";
            }
        } else {
            $http.get("/api/auth/check-login").then(function (res) {
                $rootScope.currentUser = res.data.data;
                console.log("Get current user config!!!");
            }, function (res) {
                if (!($window.location.pathname === "/pages/login.html")) {
                    $window.location.pathname = "/pages/login.html";
                }
            });
        }

        var lang = $cookies.get('l');

        if (lang == null) {
            $http.get("/api/helper/get-language/vi").then(function (res) {
                $rootScope.lang = res.data;
            });
        } else {
            $http.get("/api/helper/get-language/" + lang).then(function (res) {
                $rootScope.lang = res.data;
            });
        }
    });
})();