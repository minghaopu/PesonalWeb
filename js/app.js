var mpw = angular.module("mpw", ["ngRoute", "ngCookies", "textAngular"]);
mpw.config([
	"$controllerProvider",
	"$routeProvider",
	"$filterProvider",
	"$provide",
	"$locationProvider",
	"$httpProvider",
	function($controllerProvider, $routeProvider, $filterProvider, $provide, $locationProvider, $httpProvider) {
		$httpProvider.defaults.withCredentials = true;
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});

		mpw.controller = $controllerProvider.register;
		mpw.routeProvider = $routeProvider;
		mpw.filter = $filterProvider;
		mpw.factory = $provide.factory;
		mpw.service = $provide.service;
		mpw.decorator = $provide.decorator;

	}
]).run(["$module", "$users", "$rootScope", function($module, $users, $rootScope) {

}])