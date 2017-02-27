"use strict";

(function($) {
    let app = angular.module('app');

    app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

        $urlRouterProvider.otherwise('/dashboard/');
        $stateProvider
            .state('app', {
                url: '/dashboard/',
                views: {
                    'content-view': {
                        templateUrl: './components/home/lich-su-dich-vu.html',
                        controller: 'homeCtr'
                    },
                    'sidebar-view': {
                        templateUrl: './components/home/home-sidebar.html'
                    }
                }
            })

        .state('app.admin', {
            url: 'admin',
            views: {
                'content-view@': {
                    templateUrl: './components/admin/ho-so-moi.html',
                    controller: 'adminCtr'
                }
            }
        })

        .state('app.admin.quan-ly-dich-vu', {
            url: '/quan-ly-dich-vu',
            params: {
                action: null
            },
            views: {
                'content-view@': {
                    templateUrl: './components/employee/quan-ly-dich-vu.html',
                    controller: 'adminCtr'
                },
            }
        })

        .state('app.admin.quan-ly-dich-vu.kiem-tra-hoso', {
            url: '/kiem-tra-hoso',
            views: {
                'tab-content': {
                    templateUrl: './components/employee/dich-vu-modal.html',
                    controller: 'adminCtr'
                },
            }
        })

        .state('app.admin.quan-ly-dich-vu.xu-ly-i20', {
            url: '/xu-ly-i20',
            views: {
                'tab-content': {
                    templateUrl: './components/employee/dich-vu-modal.html',
                    controller: 'adminCtr'
                },
            }
        })

        .state('app.admin.quan-ly-dich-vu.nop-i20', {
            url: '/xin-i20',
            views: {
                'tab-content': {
                    templateUrl: './components/employee/dich-vu-modal.html',
                    controller: 'adminCtr'
                },
            }
        })

        .state('app.admin.quan-ly-dich-vu.kiem-tra-i20', {
            url: '/kiem-tra-i20',
            views: {
                'tab-content': {
                    templateUrl: './components/employee/dich-vu-modal.html',
                    controller: 'adminCtr'
                },
            }
        })

        .state('app.admin.quan-ly-dich-vu.gui-i20', {
            url: '/gui-i20',
            views: {
                'tab-content': {
                    templateUrl: './components/employee/dich-vu-modal.html',
                    controller: 'adminCtr'
                },
            }
        })

        .state('app.admin.quan-ly-dich-vu.ket-thuc', {
            url: '/ket-thuc',
            views: {
                'tab-content': {
                    templateUrl: './components/employee/dich-vu-modal.html',
                    controller: 'adminCtr'
                },
            }
        })

        .state('app.admin.quan-ly-dich-vu.check-i20', {
            url: '/kiem-tra-i20/:profileId',
            params: {
                profileId: null,
                userId: null,
                serviceId: null
            },
            views: {
                'tab-content': {
                    templateUrl: './components/check-i20-college/thong-tin.html',
                    controller: 'checkCtr'
                }
            }
        })

        .state('app.admin.quan-ly-dich-vu.xu-ly-detail', {
            url: '/xu-ly/:profileID',
            params: {
                profileId: null,
                serviceId: null
            },
            views: {
                'tab-content': {
                    templateUrl: './components/check-i20-college/xu-ly.html',
                    controller: 'fileCtr'
                },
            }
        })

        .state('app.admin.quan-ly-dich-vu.i20-detail', {
            url: '/check-i20/:profileID',
            params: {
                profileID: null,
                serviceId: null,
                userName: null
            },
            views: {
                'tab-content': {
                    templateUrl: './components/check-i20-college/kiem-tra-upload.html',
                    controller: 'adminCtr'
                },
            }
        })

        .state('app.admin.ho-so-moi', {
            url: '/ho-so-moi',
            views: {
                'content-view@': {
                    templateUrl: './components/admin/ho-so-moi.html',
                    controller: 'adminCtr'
                }
            }
        })

        .state('app.admin.ho-so-da-chuyen', {
            url: '/ho-so-da-chuyen',
            views: {
                'content-view@': {
                    templateUrl: './components/admin/ho-so-da-chuyen.html',
                    controller: 'adminCtr'
                }
            }
        })

        .state('app.admin.quan-ly-tai-khoan', {
            url: '/quan-ly-tai-khoan',
            views: {
                'content-view@': {
                    templateUrl: './components/admin/quan-ly-tai-khoan.html',
                    controller: 'adminCtr'
                }
            }
        })

        .state('app.admin.truong', {
            url: '/truong',
            views: {
                'content-view@': {
                    templateUrl: './components/service/truong.html',
                    controller: 'serviceCtr'
                }
            }
        })

        .state('app.admin.le-phi', {
            url: '/le-phi',
            views: {
                'content-view@': {
                    templateUrl: './components/service/le-phi.html',
                    controller: 'serviceCtr'
                }
            }
        })

        .state('app.admin.thong-tin-thanh-toan', {
            url: '/thong-tin-thanh-toan',
            views: {
                'content-view@': {
                    templateUrl: './components/service/thong-tin-thanh-toan.html',
                    controller: 'serviceCtr'
                }
            }
        })

        .state('app.admin.bieu-mau', {
            url: '/bieu-mau',
            views: {
                'content-view@': {
                    templateUrl: './components/service/bieu-mau.html',
                    controller: 'serviceCtr'
                }
            }
        })

        .state('app.create', {
            url: 'service/dich-vu-moi',
            views: {
                'content-view@': {
                    templateUrl: './components/service/dich-vu-moi.html',
                    controller: 'homeCtr'
                },
                'sidebar-view': {
                    templateUrl: './components/home/home-sidebar.html'
                }
            }
        })

        .state('app.i20-college', {
            url: 'i20-college',
            views: {
                'content-view@': {
                    templateUrl: './components/i20-college/thong-tin.html',
                    controller: 'infoCtr'
                },
                'sidebar-view@': {
                    templateUrl: './components/i20-college/i20-college-sidebar.html',
                    controller: 'sidebarCtr'
                }
            }
        })

        .state('app.i20-college.thong-tin', {
            url: '/thong-tin',
            views: {
                'content-view@': {
                    templateUrl: './components/i20-college/thong-tin.html',
                    controller: 'infoCtr'
                }
            }
        })

        .state('app.i20-college.hoc-ba', {
            url: '/hoc-ba',
            views: {
                'content-view@': {
                    templateUrl: './components/i20-college/hoc-ba.html',
                    controller: 'profileCtr'
                }
            }
        })

        .state('app.i20-college.bang-tot-nghiep', {
            url: '/bang-tot-nghiep',
            views: {
                'content-view@': {
                    templateUrl: './components/i20-college/bang-tot-nghiep.html',
                    controller: 'profileCtr'
                }
            }
        })

        .state('app.i20-college.bang-tieng-anh', {
            url: '/bang-tieng-anh',
            views: {
                'content-view@': {
                    templateUrl: './components/i20-college/bang-tieng-anh.html',
                    controller: 'profileCtr'
                }
            }
        })

        .state('app.i20-college.ho-chieu', {
            url: '/ho-chieu',
            views: {
                'content-view@': {
                    templateUrl: './components/i20-college/ho-chieu.html',
                    controller: 'profileCtr'
                }
            }
        })

        .state('app.i20-college.hinh-ho-chieu', {
            url: '/hinh-ho-chieu',
            views: {
                'content-view@': {
                    templateUrl: './components/i20-college/hinh-ho-chieu.html',
                    controller: 'profileCtr'
                }
            }
        })

        .state('app.i20-college.chu-ky', {
            url: '/chu-ky',
            views: {
                'content-view@': {
                    templateUrl: './components/i20-college/chu-ky.html',
                    controller: 'profileCtr'
                }
            }
        })

        .state('app.i20-college.chon-truong', {
            url: '/chon-truong',
            views: {
                'content-view@': {
                    templateUrl: './components/i20-college/chon-truong.html',
                    controller: 'profileCtr'
                }
            }
        })

        .state('app.i20-college.tai-chinh-suc-khoe', {
            url: '/tai-chinh-suc-khoe',
            params: {
                selectedSchool: null
            },
            views: {
                'content-view@': {
                    templateUrl: './components/i20-college/tai-chinh-suc-khoe.html',
                    controller: 'profileCtr'
                }
            }
        })

        .state('app.i20-college.dong-le-phi', {
            url: '/dong-le-phi',
            views: {
                'content-view@': {
                    templateUrl: './components/i20-college/dong-le-phi.html',
                    controller: 'profileCtr'
                }
            }
        })

        .state('app.i20-college.xu-ly', {
            url: '/xu-ly',
            views: {
                'content-view@': {
                    templateUrl: './components/i20-college/xu-ly.html',
                    controller: 'profileCtr'
                }
            }
        })

        .state('app.i20-college.tong-hop', {
            url: '/tong-hop',
            views: {
                'content-view@': {
                    templateUrl: './components/i20-college/tong-hop.html',
                    controller: 'reviewCtr'
                }
            }
        });

        if (window.history && window.history.pushState) {
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            }).hashPrefix('');
        }
    });
}(jQuery));