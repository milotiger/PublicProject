(function () {
	'use strict';
	var app = angular.module('app');

	app.controller('indexCtr', function ($scope, $http) {
		$scope.hoverIn = function () {
			this.hoverDis = true;
		};

		$scope.hoverOut = function () {
			this.hoverDis = false;
		};

		$scope.hoverIn1 = function () {
			this.hoverDis1 = true;
		};

		$scope.hoverOut1 = function () {
			this.hoverDis1 = false;
		};

		$scope.hoverIn2 = function () {
			this.hoverDis2 = true;
		};

		$scope.hoverOut2 = function () {
			this.hoverDis2 = false;
		};

		$scope.hoverIn3 = function () {
			this.hoverDis3 = true;
		};

		$scope.hoverOut3 = function () {
			this.hoverDis3 = false;
		};

		$scope.hoverIn4 = function () {
			this.hoverDis4 = true;
		};

		$scope.hoverOut4 = function () {
			this.hoverDis4 = false;
		};

		$scope.hoverIn5 = function () {
			this.hoverDis5 = true;
		};

		$scope.hoverOut5 = function () {
			this.hoverDis5 = false;
		};
	});
})();