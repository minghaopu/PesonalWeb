mpw.controller("index", [
	"$scope",
	"$module",
	"$request",
	"$encrypt",
	"$user",
	function($scope, $module, $request, $encrypt, $user) {

		$scope.apps = [{
			name: "linkedin",
			href: "https://www.linkedin.com/in/minghao-pu-8914bb70",
			src: "./img/linkedin.png"
		}, {
			name: "facebook",
			href: "https://www.facebook.com/roneil.pmh",
			src: "./img/facebook.png"
		}, {
			name: "github",
			href: "https://github.com/roneilPMH",
			src: "./img/github.png"
		}, {
			name: "twitter",
			href: "https://twitter.com/NealPu_MH",
			src: "./img/twitter.png"
		}, {
			name: "email",
			href: "mailto:nealpu@gwu.edu",
			src: "./img/email.png",
		}]
	}
])