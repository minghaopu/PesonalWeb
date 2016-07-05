mpw.controller("index", [
	"$scope",
	"$module",
	"$request",
	"$users",
	"$message",
	"$location",
	"$http",
	function($scope, $module, $request, $users, $message, $location, $http) {
		var initrequest = "";
		var urlseg = $location.path().split('/');
		if (urlseg.length === 2 || (urlseg.length === 3 && urlseg[2].toLowerCase() === "blog")) {
			initrequest = urlseg[1].toLowerCase();
		}
		$scope.isLogged = false;

		// $scope.isLogged = false;
		// $scope.apps = [{
		// 	name: "linkedin",
		// 	href: "https://www.linkedin.com/in/minghao-pu-8914bb70",
		// 	src: "./img/icon/linkedin.png"
		// }, {
		// 	name: "facebook",
		// 	href: "https://www.facebook.com/roneil.pmh",
		// 	src: "./img/icon/facebook.png"
		// }, {
		// 	name: "github",
		// 	href: "https://github.com/roneilPMH",
		// 	src: "./img/icon/github.png"
		// }, {
		// 	name: "twitter",
		// 	href: "https://twitter.com/NealPu_MH",
		// 	src: "./img/icon/twitter.png"
		// }, {
		// 	name: "email",
		// 	href: "mailto:nealpu@gwu.edu",
		// 	src: "./img/icon/email.png",
		// }];
		$scope.apps = {
			data: {}
		};
		var current = new Date();
		$scope.copyright = "\u00A9" + " " + current.getFullYear() + " " + "MINGHAO PU ALLRIGHTS RESERVERED";

		$module.init();
		$scope.nav = {
			navs: [],
			nickname: ""
		}

		$request.query({
			// url: "./data/loginInfo.json",
			url: "./php/user",
			async: false,
			data: {
				action: "check",
				data: {}
			}
		}, function(data) {

			$users.setStatus(true);
			$users.setId(data.uid);
			$users.setName(data.nickname);

			$scope.nav = {
				navs: [{
					name: "My Blog",
					url: "/" + data.nickname + "/blog"
				}, {
					name: "My Resume",
					url: "/" + data.nickname + "/resume"
				}],
				nickname: data.nickname
			};
			var apps = data.apps;
			for (var prop in apps) {
				$scope.apps.data[prop] = {
					name: prop,
					href: (prop === "email" ? "mailto:" : "http://") + apps[prop],
					src: "./img/icon/" + prop + ".png"
				}
			}
			if (initrequest !== "") {
				$location.path("/" + initrequest + "/blog");
			} else {
				initrequest = "";
				$location.path("/" + $users.getName() + "/blog");
			}
		})

		$scope.$watch(function() {
			return $users.getStatus();
		}, function(newValue, oldValue) {
			if (newValue) {
				$scope.pageTitle = $users.getName();
				$scope.isLogged = true;
			} else {
				$scope.$root.pageTitle = "Personal Web";
				$scope.isLogged = false;
				$users.setStatus(false);
				$users.setId(null);
				$users.setName(null);
			}
		})
	}
])