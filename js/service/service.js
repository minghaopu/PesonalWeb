// var mpwService = angular.module("mpwService", ["ngRoute", "ngTouch"]);
mpw.factory("$users", function() {

	var isLogged = false;
	var nickname = null;
	var uid = null;
	return {


		getStatus: function() {
			return isLogged;
		},
		getName: function() {
			return nickname;
		},
		getId: function() {
			return uid;
		},
		setStatus: function(value) {
			console.log(this)
			isLogged = value;
		},
		setName: function(value) {
			nickname = value;
		},
		setId: function(value) {
			uid = value;
		}

	};

})
mpw.factory("$module", [
	"$route",
	"$rootScope",
	"$users",
	"$location",
	function($route, $rootScope, $users, $location) {

		var currentModule = "";
		var history = [];


		var routes = {
			"login": {
				name: "login",
				url: "/login",
				// url: "/:userNickName/passage/:blogId",
				controller: "login",
				controllerJs: "./js/controller/login.js",
				templateUrl: "./view/login.html"
			},
			// "intro": {
			// 	name: "intro",
			// 	url: "/intro",
			// 	// url: "/:userNickName/passage/:blogId",
			// 	controller: "intro",
			// 	controllerJs: "./js/controller/intro.js",
			// 	templateUrl: "./view/intro.html"
			// },
			"passage": {
				name: "passage",
				url: "/:nickname/passage/:blogId",
				// url: "/:userNickName/passage/:blogId",
				controller: "passage",
				controllerJs: "./js/controller/passage.js",
				templateUrl: "./view/passage.html"
			},
			"blog": {
				name: "blog",
				url: "/:nickname/blog",
				//url: "/:userNickName/blog",
				controller: "blog",
				controllerJs: "./js/controller/blog.js",
				templateUrl: "./view/blog.html"
			},
			"resume": {
				name: "resume",
				url: "/:nickname/resume",
				//url: "/:userNickName/resume",
				controller: "resume",
				controllerJs: "./js/controller/resume.js",
				templateUrl: "./view/resume.html"
			},
			"error": {
				name: "error",
				url: "/error/",
				controller: "error",
				controllerJs: "./js/controller/error.js",
				templateUrl: "./view/error.html"
			},
			"profile": {
				name: "profile",
				url: "/:nickname/profile",
				controller: "profile",
				controllerJs: "./js/controller/profile.js",
				templateUrl: "./view/profile.html"
			},
			"edit": {
				name: "edit",
				url: "/edit/:blogId",
				controller: "edit",
				controllerJs: "./js/controller/edit.js",
				templateUrl: "./view/edit.html"
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
			// history: ["intro"],
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
					redirectTo: "/error/"
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
			// goTo: function(module) {

			// 	module = module.toLowerCase();
			// 	if (routes[module] === undefined) {
			// 		module = "error";
			// 	}

			// 	if (currentModule !== "") history.push(currentModule);
			// 	currentModule = module;

			// 	$location.path(routes[module].url);
			// },
			// goBack: function() {
			// 	var pre = history.pop() || "intro";
			// 	currentModule = pre;
			// 	$location.path(routes[pre].url);
			// },
			getRoutes: function() {
				return routes;
			}
		}
	}
]);

mpw.factory("$request", [
	"$http",
	"$q",
	"$message",
	"$error",
	"$location",
	"$users",
	function($http, $q, $message, $error, $location, $users) {
		var defaultConfig = {
			url: null,
			async: true,
			method: "POST"
		};
		return {
			query: function(options, success, failure, error) {
				$message.showLoading();
				var config = angular.extend({}, defaultConfig, options);
				var successFn = success || function() {};
				var failureFn = failure || function() {};
				// var errorFn = error || function() {};

				if (config.async) {
					$http(config).success(function(response, status, headers, config) {
						if (response.success) {
							$message.hideLoading();
							successFn(response.data, status, headers, config);
						} else {
							if (response.error.errorcode === -1) {
								$message.hideLoading();
								$message.hide();
								$users.setStatus(false);
								$users.setId(null);
								$users.setName(null);
								$location.path("/login");
							} else {
								$message.show({
									title: "Error",
									text: $error(status),
									button: [{
										text: "OK",
										fn: function() {
											$message.hide();
										}
									}]
								})
								failureFn(response.error, status, headers, config);
							}
						}
					}).error(function(response, status, headers, config) {
						$message.show({
								title: "Error",
								text: $error(status),
								button: [{
									text: "OK",
									fn: function() {
										$message.hide();
									}
								}]
							})
							// errorFn(arguments)
					});
				} else {
					var promise = (function() {
						var deferred = $q.defer();
						$http(config).success(function(data, status, headers, config) {
							deferred.resolve(data);
						}).error(function(data, status, headers, config) {
							deferred.reject(data);
						})
						return deferred.promise;
					})();
					promise.then(function(data) {
						if (data.success) {
							$message.hideLoading();
							successFn(data.data);
						} else {
							if (data.error.errorcode === -1) {
								$message.hideLoading();
								$message.hide();
								$users.setStatus(false);
								$users.setId(null);
								$users.setName(null);
								$location.path("/login");
							} else {
								failureFn(data.error);
							}
						}
					}, function(data) {
						errorFn(data);
					});
				}
			}
		}
	}
])


mpw.factory("$encrypt", function() {
	var defaultConfig = "MD5";

	return function $encrypt(data, options) {
		var config = options || defaultConfig;
		return CryptoJS.MD5(data).toString();
	};
});

// mpw.factory("$util", ["", function() {
// 	return function $util() {

// 	};
// }])

mpw.factory("$message", ["$timeout", function($timeout) {
		var isVisible = false;
		var isLoading = false;
		var defaultConfig = {
			title: "title",
			titleIcon: "./img/error.png",
			text: "content",
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
		var config = null;
		var mask = angular.element(document.getElementById("mask-layer"));
		var loading = angular.element(document.getElementById("loading"));
		var msg = angular.element(document.getElementById("message"));
		var timer;
		var me = this;
		return {
			show: function() {
				if (isVisible) {
					me.hide();
				}
				if (arguments[0]) {
					config = angular.extend({}, defaultConfig, arguments[0]);
				} else {
					config = defaultConfig;
				}
				if (isLoading) {
					setTimeout(function() {
						loading.addClass("hide");
					}, 1000)
					$timeout(function() {
						isVisible = true;
					}, 1500)
				} else {
					mask.addClass("show");
					isVisible = true;
				}
			},
			hide: function() {
				mask.removeClass("show");
				isVisible = false;
				config = null;
			},
			getConfig: function() {
				if (config === null) return defaultConfig
				return config;
			},
			getStatus: function() {
				return isVisible;
			},
			showLoading: function() {
				isLoading = true;
				mask.addClass("show");
				loading.removeClass("hide");
			},
			hideLoading: function() {
				isLoading = false;
				// loading.removeClass("show");
				loading.addClass("hide");
				setTimeout(function() {
					mask.removeClass("show");
				}, 500);
			}
		};
	}])
	// mpw.factory("$session", function() {
	// 	return {
	// 		checkSessionStorage: function() {
	// 			if (!localStorage) {
	// 				return false;
	// 			}
	// 			return true
	// 		},
	// 		set: function(key, value) {
	// 			return localStorage.setItem(key, JSON.stringify(value));
	// 		},
	// 		get: function(key) {
	// 			return JSON.parse(localStorage.getItem(key));
	// 		},
	// 		destroy: function(key) {
	// 			return localStorage.removeItem(key);
	// 		}
	// 	};
	// })
	// mpw.factory("$validation", function() {
	// 	return {

// 	};
// })
mpw.factory("$formatData", ["$encrypt", function($encrypt) {
	return function $formatData(form, action) {
		var formData = {
			action: action || ""
		}
		var formInput = {};
		for (prop in form) {
			var obj = form[prop];
			if (obj.data === undefined) continue;
			if (obj.type !== undefined && obj.type === "password") {
				formInput[obj.name] = $encrypt(obj.data);
			} else {
				formInput[obj.name] = obj.data;
			}
		}
		if (arguments[2] !== undefined) {
			if (angular.isObject(arguments[2])) {
				angular.extend(formInput, arguments[2]);
			}
		}
		formData.data = formInput;

		return formData;
	};
}])

// mpw.factory("$codeFormat", function() {
// 	return function $codeFormat(code) {
// 		var t = code;
// 		var newCode = "";
// 		if (code !== "") {
// 			var codes = t.replace(/</g, "&lt").replace(/>/g, "&gt").replace(/\r/g, "").replace(/\n/g, "<br/>").replace(/    /g, "<div class=\"tab\"></div>").split("<br/>");
// 			for (var i = 0; i < codes.length; i++) {
// 				var line = codes[i].split(" ");
// 				newCode += "<div class=\"code-line\">" + codes[i] + "</div>";
// 			}
// 		}
// 		return newCode;
// 		// for (var i = 0; i < codes.length; i++) {
// 		// 	newCode += "<p>"+codes[i]+"</p>";
// 		// }

// 		// newCode = "<div>" + newCode + "</div>";
// 		// return newCode;
// 	};
// })

mpw.factory("$error", function() {
	return function $error(errorcode) {
		switch (errorcode) {
			case 0:
				return "Your username or password is wrong!";
			case 1:
				return "You have entered the wrong username or password too many times! Please try again later!";
			case 2:
				return "Your username has been used! Please choose another one!";
			case 3:
				return "The passwords you entered are not match.";
			case 4:
				return "The file you are trying to upload are more than 5MB. Please choose another one.";
			default:
				return "Network Error!";
		}
	};
})
mpw.decorator('taOptions', ['taRegisterTool', '$delegate', 'taSelection', '$compile', function(taRegisterTool, taOptions, taSelection, $compile) {
	// $delegate is the taOptions we are decorating
	// register the tool with textAngular
	taRegisterTool('insertCode', {
		iconclass: "code",
		buttontext: "insertCode",
		action: function() {
			// console.log(this.$editor().getSelection())

			var editor = this.$editor().$parent;

			editor.isCode = true;
			editor.insertCode.isVisible = true;

			var id = "code-area-" + editor.codeIndex;

			// var html = "<code id=\"" + id + "\" class=\"code-area\">{{codes[" + editor.codeIndex + "]}}</code>";
			var html = "<code id=\"" + id + "\" class=\"code-area\">Click to Edit Code</code>";
			taSelection.insertHtml("<p><br></p>" + html + "<p><br></p>");
			var code = angular.element(document.getElementById(id));

			$compile(code);
			// code.on("click", function(event) {

			// 	event.bubbles = false;
			// 	event.preventDefault();
			// 	event.stopPropagation();
			// 	event.stopImmediatePropagation();
			// 	editor.isCode = true;
			// 	editor.insertCode.isVisible = true;
			// 	editor.current = parseInt(code[0].id.split("-")[2]);
			// 	editor.config.code.data = editor.codes[editor.current];
			// 	editor.$apply();
			// })
			// code.on("mouseover", function() {
			// 	editor.isPreview = true;
			// 	editor.current = parseInt(code[0].id.split("-")[2]);
			// 	editor.config.code.data = editor.codes[editor.current];
			// 	editor.$apply();
			// })

		}
	});
	// add the button to the default toolbar definition
	taOptions.toolbar[1].push('insertCode');
	return taOptions;
}]);