mpw.directive("navigator", ["$module", "$location",function($module, $location) {
	var innerHTML = 	"<div class=\"widget-nav-container\">";
		innerHTML += 		"<div class=\"widget-nav-content\">";
		innerHTML += 			"<ul class=\"widget-nav-ul\">";
		innerHTML += 				"<li ng-repeat=\"nav in navs\" class=\"widget-nav-li {{nav.name}}\" ng-click=\"goto(nav.url)\">";
		innerHTML += 					"<a href=\"javascript:void(0)\" class=\"widget-nav-link\">";
		innerHTML += 						"{{nav.name}}";
		innerHTML += 					"</a>";
		innerHTML += 				"</li>";
		innerHTML += 			"</ul>";
		innerHTML += 		"</div>";
		innerHTML += 	"</div>";
	return {
		restrict: "A",
		replace: true,
		template: innerHTML,
		scope: false,
		compile: function(ele, attr, trans) {
			return function(scope, ele, attr) {
				scope.navs = $module.getRoutes();
				scope.goto = function (url) {
					$location.path(url);
				}
			}
		}

	}
}]);



mpw.directive("message", ["$message", function($message) {
	var innerHTML = 	"<div class=\"widget-msg-wrapper\" ng-show=\"msg.isVisible\">";
		innerHTML += 		"<div class=\"widget-msg-container\">";
		innerHTML += 			"<div class=\"widget-msg-title\">";
		innerHTML += 				"<div class=\"widget-msg-icon\"></div>";
		innerHTML += 				"<div class=\"widget-msg-title-text\"></div>";
		innerHTML += 			"</div>";
		innerHTML += 			"<div class=\"widget-msg-content-container\">";
		innerHTML += 				"<div class=\"widget-msg-content\"></div>";
		innerHTML += 				"<div class=\"widget-msg-btn-container\" ng-show=\"msg.hasBtn\">";
		innerHTML += 					"<button ng-repeat=\"btn in msg.button\" config={{btn}}></button>";
		// innerHTML += 					"<button id=\"msg-no-btn\" class=\"msg-no-btn\" btn-config=\"msg.noBtn\"></button>";
		innerHTML += 				"</div>";
		innerHTML += 			"</div>";
		innerHTML += 		"</div>";
		innerHTML += 		"<div class=\"mask-layer\"></div>";
		innerHTML += 	"</div>";
		return {
			restrict: "A",
			replace: false,
			template: innerHTML,
			scope: true,
			compile: function(ele, attr, trans) {
				return function(scope, ele, attr) {
					scope.msg = {};
					scope.$watch(function(){
						return $message.getStatus();
					}, function(newVal, oldVal) {
						scope.isVisible = newVal;
						if (newVal) scope.msg = $msg.getConfig();
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
		innerHTML += 						"<img src=\"{{app.src}}\" alt=\"{{app.name}}\" class=\"widget-app-img\">";
		innerHTML += 					"</a>";
		innerHTML += 				"</li>";
		innerHTML += 			"</ul>";
		innerHTML += 		"</div>";
		innerHTML += 	"</div>";
	return {
		restrict: "A",
		replace: true,
		template: innerHTML,
		scope: false
	}
});

// mpw.directive("loading", ["$message", function($message) {

// }]);