(function(window, angular) {
	'use strict';
	var eDashboard = angular.module('eDashboard', []);
	eDashboard
			.directive(
					'eventInfo',
					function() {
						return {
							restrict : 'AE',
							// declare the directive scope as private (and
							// empty)
							scope : {
								info : '=ngModel'
							},
							controller : [
									'$scope',
									'$http',
									'$httpParamSerializerJQLike',
									function($scope, $http,
											$httpParamSerializerJQLike) {
										$scope.edit = function() {
											$scope.nonEditable = !$scope.nonEditable
											$scope.copy = angular
													.copy($scope.info);
										};
										$scope.save = function() {
											var data = {
												'id' : $scope.info.id
											};
											if ($scope.form.pattern.$dirty)
												data['pattern'] = $scope.info.pattern;
											$http(
													{
														url : "../event/"
																+ $scope.info.id
																+ "/update",
														method : 'post',
														data : $httpParamSerializerJQLike(data),
														headers : {
															'Content-Type' : 'application/x-www-form-urlencoded'
														}
													})
													.success(
															function(response) {
																if (response.code == 0) {
																	alert("更新成功!");
																}
																$scope.info = response.data;
																$scope.nonEditable = true;
															});
											// $scope.info=
										};
										$scope.cancel = function() {
											$scope.info = $scope.copy;
											$scope.nonEditable = !$scope.nonEditable
										};
									} ],
							// add behaviour to our buttons and use a variable
							// value
							templateUrl : '../home/eventinfo.view.html'
						};
					});
})(window, window.angular);