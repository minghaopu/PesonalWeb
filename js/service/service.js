// var mpwService = angular.module("mpwService", ["ngRoute", "ngTouch"]);
mpw.factory("$module", [
	"$route",
	"$rootScope",
	"$user",
	"$location",
	function($route, $rootScope, $user, $location) {

		var currentModule = "";
		var history = [];

		var routes = {
			"intro": {
				name: "intro",
				url: "/intro",
				// url: "/:userNickName/passage/:passageId",
				controller: "intro",
				controllerJs: "./js/controller/intro.js",
				templateUrl: "./view/intro.html"
			},
			"passage": {
				name: "passage",
				url: "/passage/123",
				// url: "/:userNickName/passage/:passageId",
				controller: "passage",
				controllerJs: "./js/controller/passage.js",
				templateUrl: "./view/passage.html"
			},
			"resume": {
				name: "resume",
				url: "/resume",
				//url: "/:userNickName/resume",
				controller: "resume",
				controllerJs: "./js/controller/resume.js",
				templateUrl: "./view/resume.html"
			},
			"blog": {
				name: "blog",
				url: "/blog",
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

		return {
			currentModule: "",
			history: ["intro"],
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
			},
			getRoutes: function() {
				return routes;
			}
		}
	}
]);

mpw.factory("$request", [
	"$http",
	"$q",
	function($http, $q) {
		var defaultConfig = {
			url: null,
			async: true,
			method: "POST"
		};
		return {
			query: function(options, success, failure, error) {
				var config = angular.extend({},
					defaultConfig, options);
				var successFn = success || function() {};
				var failureFn = failure || function() {};
				var errorFn = error || function() {};

				if (config.async) {
					$http(config).success(function(data, status, headers, config) {
						if (data.success) {
							successFn(data.data, status, headers, config);
						} else {
							failureFn(data.error, status, headers, config);
						}
					}).error(errorFn);
				} else {
					$http(config).then(function(data, status, headers, config) {
						if (data.success) {
							successFn(data.data, status, headers, config);
						} else {
							failureFn(data.error, status, headers, config);
						}
					}, errorFn);
				}
			}
		}
	}
])

mpw.factory("$user", [
	"$request",
	"$session",
	"$encrypt",
	"$location",
	function($request, $session, $encrypt, $location) {
		var me = this;
		return {
			nickname: "MinghaoPU",
			login: function(data) {

				$request.query({
					url: "./data/login.json",
					action: "login",
					data: data
				}, function(data) {
					me.nickname = data.nickname;
					$session.set("pw", data);
					$location.path("/blog");
				}, function() {
					console.log("login fail");
					//error msg
					$location.path("/intro");
				})
			},
			checkLogin: function() {
				if (!$session.checkSessionStorage()) {
					$location.path("/intro");
					return false;
				}
				var data = $session.get("pw");
				if (!angular.isObject(data)) {
					$location.path("/intro");
					return false;
				}
				$request.query({
					url: "./data/loginInfo.json",
					action: "check",
					data: data
				}, function(data) {
					$location.path("/blog");
					return true;
				}, function() {
					$location.path("/intro");
					return false;
					// error message
				})
			},
			register: function(data) {
				$request.query({
					url: "./data/register.json",
					action: "register",
					data: data
				}, function() {
					console.log("register succeed");
				}, function() {
					console.log("register fail");
				})
			},
			logout: function() {
				$session.destroy("uid");
				$request.quesy({
					url: "./data/logout.json",
					action: "logout"
				}, function() {
					$location.path("/intro");
				})
			},
		};
	}
])

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

mpw.factory("$message", function() {
	var isVisible = false;
	var defaultConfig = {
		titleText: "",
		titleIcon: "./img/error.png",
		text: "",
		hasBtn: true,
		button: [{
			text: "OK",
			cls: "",
			iconCls: "",
			fn: function() {}
		}, {
			text: "NO",
			cls: "",
			iconCls: "",
			fn: function() {}
		}]
	};
	var config = {};
	return {
		show: function() {
			isVisible = true;
		},
		hide: function() {
			isVisible = false;
			config = {};
		},
		config: function(options) {
			config = angular.extend({}, defaultConfig, options);
		},
		getConfig: function() {
			return config;
		},
		getStatus: function() {
			return isVisible;
		}
	};
})
mpw.factory("$session", function() {
	return {
		checkSessionStorage: function() {
			if (!localStorage) {
				return false;
			}
			return true
		},
		set: function(key, value) {
			return localStorage.setItem(key, JSON.stringify(value));
		},
		get: function(key) {
			return JSON.parse(localStorage.getItem(key));
		},
		destroy: function(key) {
			return localStorage.removeItem(key);
		}
	};
})