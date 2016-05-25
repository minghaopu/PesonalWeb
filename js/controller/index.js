mpw.controller("index", [
	"$scope",
	"$module",
	"$request",
	"$encrypt",
	"$user",
	"$message",
	"$location",
	function($scope, $module, $request, $encrypt, $user, $message, $location) {

		$scope.isLogged = false;
		$scope.apps = [{
			name: "linkedin",
			href: "https://www.linkedin.com/in/minghao-pu-8914bb70",
			src: "./img/icon/linkedin1.png"
		}, {
			name: "facebook",
			href: "https://www.facebook.com/roneil.pmh",
			src: "./img/icon/facebook.png"
		}, {
			name: "github",
			href: "https://github.com/roneilPMH",
			src: "./img/icon/github.png"
		}, {
			name: "twitter",
			href: "https://twitter.com/NealPu_MH",
			src: "./img/icon/twitter.png"
		}, {
			name: "email",
			href: "mailto:nealpu@gwu.edu",
			src: "./img/icon/email.png",
		}];
		var current = new Date();
		$scope.copyright = "\u00A9" + " " + current.getFullYear() + " " + "MINGHAO PU ALLRIGHTS RESERVERED";

		$module.init();
		$user.checkLogin();
		// $scope.isLogged = $user.checkLogin();

		$scope.$watch(function() {
			return $user.getStatus();
		}, function(newVal, oldVal){
			$scope.isLogged = newVal;
		})

		// $scope.$on("$routeChangeSuccess", function(e, next, current) {
		// 	$scope.isLogged = next.controller === "login" ? false : true;
		// });
	}
])