var mpw = angular.module("mpw", ["ngRoute", "ngCookies", "textAngular"]);
mpw.config([
	"$controllerProvider",
	"$routeProvider",
	"$filterProvider",
	"$provide",
	"$locationProvider",
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
		mpw.decorator = $provide.decorator;

	}
]).run(["$module", "$user", "$rootScope", function($module, $user, $rootScope) {
	$rootScope.pageTitle = $user.nickname || "MPW"; //need to change with url

}])