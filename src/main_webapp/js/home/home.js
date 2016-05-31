// 登录控制
(function() {
	'use strict';
	var homeApp = angular.module('home', [ 'eDashboard', 'ngRoute' ]);
	homeApp.config(config);
	config.$inject = [ '$routeProvider', '$locationProvider' ];
	function config($routeProvider, $locationProvider) {
		$routeProvider.when('/', {
			// controller : 'LoginController',
			templateUrl : 'pevent.view.html',
			controllerAs : 'vm'
		}).when('/eventrepo', {
			controller : 'eventRepoController',
			templateUrl : 'eventrepo.view.html',
			controllerAs : 'vm'
		}).when('/eventdash', {
			// controller : 'LoginController',
			templateUrl : 'eventdash.view.html',
			controllerAs : 'vm'
		}).when('/addevent', {
			controller : 'addEventController',
			templateUrl : 'addevent.view.html',
			controllerAs : 'vm'
		});
	}
	homeApp.controller('addEventController', addEventController);
	addEventController.$inject = [ '$http', '$httpParamSerializerJQLike' ]
	function addEventController($http, $httpParamSerializerJQLike) {
		var vm = this;
		vm.dataLoading = false;
		vm.addEvent = addEvent;
		function addEvent() {
			vm.dataLoading = true;
			$http({
				url : "../event/create",
				method : 'POST',
				data : $httpParamSerializerJQLike(vm.event),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(function(response) {
				if (response.code == 0) {
					alert('添加事件成功！');
				} else {
					alert(response.message);
				}
				vm.dataLoading = false;
			});
		}
		;
	}

	homeApp.controller('eventRepoController', eventRepoController);
	eventRepoController.$inject = [ '$http', '$httpParamSerializerJQLike' ]
	function eventRepoController($http, $httpParamSerializerJQLike) {
		var vm = this;
		vm.dataLoading = false;
		vm.refresh = refresh;
		function refresh() {
			vm.dataLoading = true;
			$http({
				url : "../event/show",
				method : 'get',
			}).success(function(response) {
				vm.events = response.data;
				vm.dataLoading = false;
			});
		}
		;
		refresh();
	}

})();