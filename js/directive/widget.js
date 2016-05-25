mpw.directive("navigator", ["$module", "$location", "$user", "$timeout", function($module, $location, $user, $timeout) {
	var innerHTML = 	"<div class=\"widget-nav-container\">";
		innerHTML += 		"<div class=\"widget-nav-content\">";
		innerHTML += 			"<ul class=\"widget-nav-ul\">";
		innerHTML += 				"<li ng-repeat=\"nav in navs\" class=\"widget-nav-li {{nav.name}}\" ng-click=\"goto(nav.url)\">";
		innerHTML += 					"<a href=\"javascript:void(0)\" class=\"widget-nav-link\">";
		innerHTML += 						"{{nav.name | uppercase}}";
		innerHTML += 					"</a>";
		innerHTML += 				"</li>";
		innerHTML += 			"</ul>";
		innerHTML += 		"</div>";
		innerHTML +=		"<div class=\"widget-user-container\" ng-mouseover=\"mouseover()\" ng-mouseleave=\"mouseleave()\">";
		innerHTML +=			"<div class=\"widget-user-content\">";
		innerHTML +=				"<span class=\"widget-user-text\">{{name}}</span>";
		innerHTML +=			"</div>";
		innerHTML +=			"<div class=\"widget-drop-content\" ng-show=\"isDropped\" ng-mouseover=\"mouseover()\" ng-mouseleave=\"mouseleave()\">";
		innerHTML += 				"<ul class=\"widget-drop-ul\">";
		innerHTML +=					"<li class=\"widget-drop-li\" ng-click=\"gotoProfile()\">";
		innerHTML +=						"<a href=\"javascript:void(0)\" class=\"widget-drop-link\">Profile</a>";
		innerHTML +=					"</li>";
		innerHTML +=					"<li class=\"widget-drop-li\" ng-click=\"logout()\">";
		innerHTML +=						"<a href=\"javascript:void(0)\" class=\"widget-drop-link\">Logout</a>";
		innerHTML +=					"</li>";
		innerHTML += 				"</ul>";
		innerHTML +=			"</div>";
		innerHTML +=		"</div>";
		innerHTML += 	"</div>";
	return {
		restrict: "A",
		replace: true,
		template: innerHTML,
		scope: true,
		compile: function(ele, attr, trans) {
			return function(scope, ele, attr) {
				var navs = $module.getRoutes();
				var timer;

				scope.navs = [navs.intro, navs.blog, navs.resume];
				scope.isDropped = false;
				scope.name = $user.getName();

				scope.goto = function (url) {
					$location.path(url);
				}
				
				scope.mouseover = function() {
					$timeout.cancel(timer);
					scope.isDropped = true;
				}
				scope.mouseleave = function() {
					timer = $timeout(function() {
						scope.isDropped = false;
					}, 500)
				}
				scope.logout = function() {
					$user.logout();
				}
				scope.gotoProfile = function() {
					$location.path("/profile")
				}
			}
		}

	}
}]);

mpw.directive("message", ["$message", function($message) {
	var innerHTML = 	"<div class=\"widget-msg-wrapper\" ng-show=\"isVisible\">";
		innerHTML += 		"<div class=\"widget-msg-container\">";
		innerHTML += 			"<div class=\"widget-msg-title\">";
		innerHTML += 				"<div class=\"widget-msg-icon-container\">"
		innerHTML +=					"<img ng-src=\"msg.titleIcon\" class=\"widget-msg-icon\">"
		innerHTML += 				"</div>";
		innerHTML += 				"<div class=\"widget-msg-title-text\">{{msg.title}}</div>";
		innerHTML += 			"</div>";
		innerHTML += 			"<div class=\"widget-msg-content-container\">";
		innerHTML += 				"<div class=\"widget-msg-content\">{{msg.text}}</div>";
		innerHTML += 				"<div class=\"widget-msg-btn-container\" ng-show=\"msg.hasBtn\">";
		innerHTML += 					"<button ng-repeat=\"btn in msg.button\" config={{btn}}></button>";
		// innerHTML += 					"<button id=\"msg-no-btn\" class=\"msg-no-btn\" btn-config=\"msg.noBtn\"></button>";
		innerHTML += 				"</div>";
		innerHTML += 			"</div>";
		innerHTML += 		"</div>";
		innerHTML += 		"<div class=\"widget-msg-mask-layer\"></div>";
		innerHTML += 	"</div>";
		return {
			restrict: "A",
			replace: false,
			template: innerHTML,
			scope: true,
			compile: function(ele, attr, trans) {
				return function(scope, ele, attr) {
					scope.msg = {};
					scope.isVisible = false;
					scope.$watch(function(){
						return $message.getStatus();
					}, function(newVal, oldVal) {
						scope.isVisible = newVal;
						if (newVal) scope.msg = $message.getConfig();
						else scope.msg = {};
					})
				}
			}
		}
}]);

mpw.directive("appLink", function() {
	var innerHTML = 	"<div class=\"widget-apps-container\">";
		innerHTML += 		"<div class=\"widget-apps-content\">";
		innerHTML += 			"<ul class=\"widget-apps-ul\">";
		innerHTML += 				"<li ng-repeat=\"app in apps\" class=\"widget-apps-li {{app.name}}\">";
		innerHTML += 					"<a href=\"{{app.href}}\" class=\"widget-app-link\">";
		innerHTML += 						"<img ng-src=\"{{app.src}}\" alt=\"{{app.name}}\" class=\"widget-app-img\">";
		innerHTML += 					"</a>";
		innerHTML += 				"</li>";
		innerHTML += 			"</ul>";
		innerHTML += 		"</div>";
		innerHTML += 	"</div>";
	return {
		restrict: "A",
		replace: true,
		template: innerHTML
	}
});

mpw.directive("textBox", function() {
	var innerHTML = 	"<div class=\"widget-text-wrapper {{config.cls}}\">";
		innerHTML +=		"<div class=\"widget-icon-container {{config.iconCls}}\">";
		innerHTML +=			"<div class=\"widget-icon-content\"></div>";
		innerHTML +=		"</div>";
		innerHTML +=		"<div class=\"widget-lable-container {{config.labelCls}}\">";
		innerHTML +=			"<div class=\"widget-lable-content\">";
		innerHTML +=				"<span class=\"widget-lable-text\">{{config.label}}</span>";
		innerHTML +=			"</div>";
		innerHTML +=		"</div>";
		innerHTML +=		"<div class=\"widget-text-content {{config.inputCls}}\">";
		innerHTML +=			"<input type=\"{{config.type}}\"";
		innerHTML +=					" class=\"widget-text-input\"";
		innerHTML +=					" ng-readonly=\"config.readOnly\"";
		innerHTML +=					" maxlength=\"{{config.maxLength}}\"";
		// innerHTML +=					" ng-minlength=\"config.minLength\"";
		innerHTML +=					" placeholder=\"{{config.placeholder}}\"";
		innerHTML +=					" ng-disabled=\"config.disabled\"";
		innerHTML +=					" ng-trim=\"config.trim\"";
		innerHTML +						" ng-model=\"config.data\">";
		innerHTML +=		"</div>";
		innerHTML +=		"<div class=\"widget-error-container  {{config.errorCls}}\">";
		innerHTML +=			"<div ng-hide=\"config.isValid\" class=\"widget-error-content\">";
		innerHTML +=				"<span class=\"widget-error-text\">{{config.error}}</span>";
		innerHTML +=			"</div>";
		innerHTML +=		"</div>";
		innerHTML +=	"</div>";
	return {
		restrict: "A",
		replace: true,
		template: innerHTML,
		scope: {
			config: "="
		},
		compile: function(ele, attr, trans) {
			var defaultConfig = {
				readOnly: false,
				disabled: false,
				type: "text",
				trim: true,
				isValid: true
			}
			return function(scope, ele, attr) {
				scope.config = angular.extend({}, defaultConfig, scope.config);
			}
		}
	}
})

mpw.directive("button", function() {
	var innerHTML = 	"<div class=\"widget-button-container {{config.cls}}\" ng-class=\"config.disabled?'widget-button-disalbed':''\" ng-click=\"config.fn()\">";
		innerHTML +=		"<div class=\"widget-icon-container\">";
		innerHTML +=			"<div class=\"widget-icon-content {{config.iconCls}}\"></div>";
		innerHTML +=		"</div>";
		innerHTML +=		"<div class=\"widget-button-content\">";
		innerHTML +=			"<button class=\"widget-button-btn {{config.btnCls}}\" ng-disabled=\"config.disabled\">{{config.text}}</button>";
		innerHTML +=		"</div>";
		innerHTML +=	"</div>";
	return {
		restrict: "A",
		replace: true,
		template: innerHTML,
		scope: {
			config: "="
		},
		compile: function(ele, attr, trans) {
			var defaultConfig = {
				text: "button",
				disabled: false,
				fn: function(){}
			}
			return function(scope, ele, attr) {
				scope.config = angular.extend({}, defaultConfig, scope.config);
			}
		}
	}
})

mpw.directive("list", ["$location", function($location) {
	var innerHTML = 	"<div class=\"widget-list-container\">";
		innerHTML +=		"<div class=\"widget-list-content\" ng-hide=\"config.data.length > 0 ? false : true\">";
		innerHTML +=			"<ul class=\"widget-list-ul\">";
		innerHTML +=				"<li ng-repeat=\"row in config.data\" class=\"widget-list-row row-{{$index}}\">";
		innerHTML +=					"<div class=\"widget-row-title\" ng-click=\"viewPassage(row)\">";
		innerHTML +=						"<a href=\"javascript:void(0)\" class=\"widget-row-link\">{{row.title}}</a>"
		innerHTML +=					"</div>";
		innerHTML +=					"<div class=\"widget-row-time\">{{row.posttime}}</div>";
		innerHTML +=				"</li>";
		innerHTML +=			"</ul>";
		innerHTML +=		"</div>";
		innerHTML +=		"<div class=\"widget-list-empty-content\" ng-show=\"config.data.length > 0 ? false : true\">";
		innerHTML +=			"<span class=\"widget-list-empty-text\">{{config.emptyText}}</span>";
		innerHTML +=		"</div>";
		innerHTML +=	"</div>";
	return {
		restrict: "A",
		replace: true,
		template: innerHTML,
		scope: {
			config: "="
		},
		compile: function(ele, attr, trans) {
			var defaultConfig = {
				emptyText: "No blog!",
				data: []
			}
			return function(scope, ele, attr) {
				scope.config = angular.extend({}, defaultConfig, scope.config);
				scope.isEmpty = scope.config.data.length > 0 ? false : true;
				scope.viewPassage = function(row) {
					$location.path("/passage/"+row.passageId);
				}
			}
		}
	}
}])
// mpw.directive("button", function() {

// })

// mpw.directive("loading", ["$message", function($message) {

// }]);