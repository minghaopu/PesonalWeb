// var mpwService = angular.module("mpwService", ["ngRoute", "ngTouch"]);
mpw.factory("$module", [
	"$route",
	"$rootScope",
	"$user",
	"$location",

	function($route, $rootScope, $user, $location) {
		var asyncJs = function(jsPath) {
			return ["$q", "$route", "$rootScope", function($q, $route, $rootScope) {
				var deferred = $q.defer();
				$script([jsPath], function() {
					$rootScope.$apply(function() {
						deferred.resolve();
					});
				});
				return deferred.promise;
			}]
		};
		var currentModule = "";
		var history = [];

		var routes = {
			"intro": {
				name: "intro",
				url: "/" + $user.userNickname,
				// url: "/:userNickName/passage/:passageId",
				controller: "intro",
				controllerJs: "./js/controller/intro.js",
				templateUrl: "./view/intro.html"
			},
			"passage": {
				name: "passage",
				url: "/" + $user.userNickname + "/passage/123",
				// url: "/:userNickName/passage/:passageId",
				controller: "passage",
				controllerJs: "./js/controller/passage.js",
				templateUrl: "./view/passage.html"
			},
			"resume": {
				name: "resume",
				url: "/" + $user.userNickname + "/resume",
				//url: "/:userNickName/resume",
				controller: "resume",
				controllerJs: "./js/controller/resume.js",
				templateUrl: "./view/resume.html"
			},
			"blog": {
				name: "blog",
				url: "/" + $user.userNickname + "/blog",
				//url: "/:userNickName/blog",
				controller: "blog",
				controllerJs: "./js/controller/blog.js",
				templateUrl: "./view/blog.html"
			},
			"error": {
				name: "error",
				url: "/error",
				controller: "error",
				controllerJs: "./js/controller/error.js",
				templateUrl: "./view/error.html"
			}
		};

		return {
			//currentModule: "",
			history: ['intro'],
			init: function() {
				var route, controllerJs;

				for (var prop in routes) {
					route = routes[prop];
					controllerJs = route.controllerJs;
					route.resolve = {
						delay: asyncJs(controllerJs)
					};
					mpw.routeProvider.when(route.url, route);
				}
				mpw.routeProvider.otherwise({
					redirectTo: routes["intro"].url
				});
				// var route = routes[module];

				// var controllerJs = route.controllerJs;

				// var asyncJs = (function(jsPath) {
				// 	return ["$q", "$route", "$rootScope", function($q, $route, $rootScope) {
				// 		var deferred = $q.defer();
				// 		$script([jsPath], function() {
				// 			$rootScope.$apply(function() {
				// 				deferred.resolve();
				// 			});
				// 		});
				// 		return deferred.promise;
				// 	}]
				// })(controllerJs);

				// var routeConfig = {
				// 	templateUrl: route.templateUrl,
				// 	controller: route.controller,
				// 	resolve: {
				// 		delay: asyncJs
				// 	}
				// };

			},
			goTo: function(module) {
				time++;
				console.log(time);
				module = module.toLowerCase();
				if (routes[module] === undefined) {
					module = "error";
				}

				if (currentModule !== "") history.push(currentModule);
				currentModule = module;

				$location.path(routes[module].url);
			},
			goBack: function() {
				var pre = history.pop() || "intro";
				currentModule = pre;
				$location.path(routes[pre].url);
			}
		}
	}
]);

mpw.factory("$request", ["$http", "$q", function($http, $q) {
	var defaultConfig = {
		url: null,
		async: true,
		method: "GET"
	};
	return {
		query: function(options, success, failure, error) {
			var config = angular.extend({},
				defaultConfig, options);
			var successFn = success || function() {};
			var failureFn = failure || function() {};
			var errorFn = error || function() {};

			if (!config.async) {
				$http(config).then(function(response) {
					if (data.success) {
						successFn(data.data, status, headers, config);
					} else {
						failureFn(data.error, status, headers, config);
					}
				}, errorFn);

			} else {
				$http(config).success(function(data, status, headers, config) {
					if (data.success) {
						successFn(data.data, status, headers, config);
					} else {
						failureFn(data.error, status, headers, config);
					}
				}).error(errorFn);
			}
		}
	}
}])

mpw.factory("$user", ["$request", "$cookies", "$encrypt", function($request, $cookies, $encrypt) {

	return {
		isLogin: false,
		userNickname: "MinghaoPU",
		login: function() {

		},
		checkStatus: function() {
			/**
			 *	cookie test
			 */

			try {
				if (!(document.cookie || navigator.cookieEnabled)) {
					// error message
					return false;
				};
			} catch (e) {
				// error message
				return false;
			};

			$request.query({
				url: "./data/loginInfo.json"
			}, function(data) {
				$cookies.put("token", $encrypt(data.token));
			}, function() {
				// error message
			})
		},
		register: function() {

		}
	};
}])

mpw.factory("$encrypt", ["$rootScope", function($rootScope) {
	var defaultConfig = "rsa";

	return function $encrypt(data, options) {
		var config = options || defaultConfig;
		return data;
	};
}]);

mpw.factory("$util", ["", function() {
	return function $util() {

	};
}])