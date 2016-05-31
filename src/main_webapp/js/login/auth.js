// 登录控制
(function() {
	'use strict';
	var authApp = angular.module('auth', [ 'ngCookies', 'ngRoute' ]);
	authApp.config(config);
	authApp.run(run);

	config.$inject = [ '$routeProvider', '$locationProvider' ];
	function config($routeProvider, $locationProvider) {
		$routeProvider.when('/login', {
			controller : 'LoginController',
			templateUrl : 'login.html',
			controllerAs : 'vm'
		}).when('register', {
			controller : 'RegisterController',
			templateUrl : 'register.html',
			controllerAs : 'vm'
		}).otherwise({
			controller : 'LoginController',
			templateUrl : 'register.html',
			controllerAs : 'vm'
		});
	}

	authApp.controller('LoginController', LoginController);
	LoginController.$inject = [ '$location', '$window', 'AuthenticationService' ];
	function LoginController($location, $window, AuthenticationService) {
		var vm = this;
		vm.login = login;
		(function initController() {
			// reset login status
			AuthenticationService.ClearCredentials();
		})();

		function login() {
			vm.dataLoading = true;
			AuthenticationService.Login(vm.username, vm.password, function(
					response) {
				if (response.code == 1) {
					AuthenticationService.SetCredentials(vm.username,
							vm.password);
					$window.location.href = "home/home.html";
					// $location.path('/home.html');
					// var curUrl = $location.absUrl();
				} else {
					// FlashService.Error(response.message);
					vm.dataLoading = false;
				}
			});
		}
		;
	}

	authApp.controller('RegisterController', RegisterController);
	RegisterController.$inject = [ '$window', '$http', 'AuthenticationService',
			'$httpParamSerializerJQLike' ];
	function RegisterController($window, $http, AuthenticationService,
			$httpParamSerializerJQLike) {
		var vm = this;
		vm.register = register;
		(function initController() {
			// reset login status
			AuthenticationService.ClearCredentials();
		})();

		function register() {
			vm.dataLoading = true;
			$http({
				url : "account/create",
				method : 'POST',
				data : $httpParamSerializerJQLike(vm.account),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).success(
					function(response) {
						if (response.code == 0) {
							AuthenticationService.SetCredentials(vm.username,
									vm.password);
							$window.location.href = "home.html";
						} else {
							alert(response.message);
						}
						vm.dataLoading = false;
					});
		}
		;
	}

	run.$inject = [ '$rootScope', '$location', '$cookieStore', '$http' ];
	function run($rootScope, $location, $cookieStore, $http) {
		// keep user logged in after page refresh
		$rootScope.globals = $cookieStore.get('globals') || {};
		if ($rootScope.globals.currentUser) {
			$http.defaults.headers.common['Authorization'] = 'Basic '
					+ $rootScope.globals.currentUser.authdata; // jshint
			// ignore:line
		}

		$rootScope.$on('$locationChangeStart', function(event, next, current) {
			// redirect to login page if not logged in and trying to access a
			// restricted page
			var restrictedPage = [ '/login', '/register' ].indexOf($location
					.path()) === -1;
			var loggedIn = $rootScope.globals.currentUser;
			if (restrictedPage && !loggedIn) {
				$location.path('/login');
			}
		});
	}

})();

// 授权服务
(function() {
	'use strict';
	angular.module('auth').factory('AuthenticationService',
			AuthenticationService);

	AuthenticationService.$inject = [ '$http', '$cookieStore', '$rootScope' ];
	function AuthenticationService($http, $cookieStore, $rootScope) {
		var service = {};

		service.Login = Login;
		service.SetCredentials = SetCredentials;
		service.ClearCredentials = ClearCredentials;

		return service;

		function Login(username, password, callback) {

			/*
			 * Dummy authentication for testing, uses $timeout to simulate api
			 * call ----------------------------------------------
			 * 
			 * $timeout(function() { var response;
			 * UserService.GetByUsername(username).then(function(user) { if
			 * (user !== null && user.password === password) { response = {
			 * success : true }; } else { response = { success : false, message :
			 * 'Username or password is incorrect' }; } callback(response); }); },
			 * 1000);
			 */

			/*
			 * Use this for real authentication
			 * ----------------------------------------------
			 */
			$http.get(
					'account/authenticate?username=' + username + "&password="
							+ password).success(function(response) {
				callback(response);
			});
		}

		function SetCredentials(username, password) {
			var authdata = Base64.encode(username + ':' + password);

			$rootScope.globals = {
				currentUser : {
					username : username,
					authdata : authdata
				}
			};

			$http.defaults.headers.common['Authorization'] = 'Basic '
					+ authdata; // jshint ignore:line
			$cookieStore.put('globals', $rootScope.globals);
		}

		function ClearCredentials() {
			$rootScope.globals = {};
			$cookieStore.remove('globals');
			$http.defaults.headers.common.Authorization = 'Basic';
		}
	}

	// Base64 encoding service used by AuthenticationService
	var Base64 = {

		keyStr : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

		encode : function(input) {
			var output = "";
			var chr1, chr2, chr3 = "";
			var enc1, enc2, enc3, enc4 = "";
			var i = 0;

			do {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);

				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;

				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}

				output = output + this.keyStr.charAt(enc1)
						+ this.keyStr.charAt(enc2) + this.keyStr.charAt(enc3)
						+ this.keyStr.charAt(enc4);
				chr1 = chr2 = chr3 = "";
				enc1 = enc2 = enc3 = enc4 = "";
			} while (i < input.length);

			return output;
		},

		decode : function(input) {
			var output = "";
			var chr1, chr2, chr3 = "";
			var enc1, enc2, enc3, enc4 = "";
			var i = 0;

			// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
			var base64test = /[^A-Za-z0-9\+\/\=]/g;
			if (base64test.exec(input)) {
				window
						.alert("There were invalid base64 characters in the input text.\n"
								+ "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n"
								+ "Expect errors in decoding.");
			}
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

			do {
				enc1 = this.keyStr.indexOf(input.charAt(i++));
				enc2 = this.keyStr.indexOf(input.charAt(i++));
				enc3 = this.keyStr.indexOf(input.charAt(i++));
				enc4 = this.keyStr.indexOf(input.charAt(i++));

				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;

				output = output + String.fromCharCode(chr1);

				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}

				chr1 = chr2 = chr3 = "";
				enc1 = enc2 = enc3 = enc4 = "";

			} while (i < input.length);

			return output;
		}
	};

})();
