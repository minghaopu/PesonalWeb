var mpw = angular.module('mpw', ['ngRoute', 'ngCookies']);
mpw.config([
	'$controllerProvider',
	'$routeProvider',
	'$filterProvider',
	'$provide',
	'$locationProvider',
	function($controllerProvider, $routeProvider, $filterProvider, $provide, $locationProvider) {


		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});

		mpw.controller = $controllerProvider.register;
		mpw.routeProvider = $routeProvider;
		mpw.filter = $filterProvider;
		mpw.factory = $provide.factory;
		mpw.service = $provide.service;

		
	}
]);

mpw.run(['$module','$user', function($module, $user) {
	$module.init();
	$user.checkStatus();
}])



// mpw.config(['$controllerProvider','$routeProvider', '$filterProvider','$provide',
// 	function($controllerProvider, $routeProvider, $filterProvider,$provide) {
// 		mpw.register = {
// 			controller: $controllerProvider.register,
// 			filter: $filterProvider,
// 			factory: $provide.factory,
// 			service: $provide.service
// 		}
// 	}])

// ])