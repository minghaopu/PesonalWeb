mpw.controller("login", ["$scope", "$users", "$message", "$error", "$request", "$formatData", "$location", function($scope, $users, $message, $error, $request, $formatData, $location) {
	var loginSuccess = function(data) {
		$scope.$parent.nav = {
			navs: [{
				name: "My Blog",
				url: "/" + data.nickname + "/blog"
			}, {
				name: "My Resume",
				url: "/" + data.nickname + "/resume"
			}],
			nickname: data.nickname
		};

		$scope.$parent.nav.nickname = data.nickname;
		var apps = data.apps;
		for (var prop in apps) {
			$scope.$parent.apps.data[prop] = {
				name: prop,
				href: (prop === "email" ? "mailto:" : "") + apps[prop],
				src: "./img/icon/" + prop + ".png"
			}
		}
		$users.setStatus(true);
		$users.setId(data.uid);
		$users.setName(data.nickname);
		$location.path("/" + data.nickname + "/blog");
	}

	$scope.isLogin = true;

	$scope.widget = {
		switchBtn: {},
		loginForm: {},
		registerForm: {}
	};

	$scope.widget.switchBtn = {
		text: "Sign Up",
		fn: function() {
			if ($scope.isLogin) {
				$scope.isLogin = false;
				this.text = "Log In";
				$scope.widget.registerForm.username.data = "";
				$scope.widget.registerForm.nickname.data = "";
				$scope.widget.registerForm.password.data = "";
				$scope.widget.registerForm.confirm.data = "";
			} else {
				$scope.isLogin = true;
				this.text = "Sign Up";
				$scope.widget.loginForm.username.data = "";
				$scope.widget.loginForm.password.data = "";
			}
		}
	}

	$scope.widget.loginForm = {
		username: {
			placeholder: "Username",
			name: "username",
			data: ""
		},
		password: {
			placeholder: "Password",
			name: "password",
			type: "password",
			data: ""
		},
		loginBtn: {
			text: "Log In",
			fn: function() {
				var me = this;
				me.disabled = true;

				$request.query({
					// url: "./data/login.json",
					url: "./php/user",
					data: $formatData($scope.widget.loginForm, "login")
				}, loginSuccess(data), function(data) {
					me.disabled = false;
				})
			}
		}
	}
	$scope.widget.registerForm = {
		username: {
			placeholder: "Username for login",
			name: "username",
			data: ""
		},
		nickname: {
			placeholder: "Nickname",
			name: "nickname",
			data: ""
		},
		password: {
			placeholder: "Password",
			name: "password",
			type: "password",
			data: ""
		},
		confirm: {
			placeholder: "Confirm Your Password",
			name: "confirm",
			type: "password",
			data: ""
		},
		registerBtn: {
			text: "Sign Up",
			fn: function() {
				var me = this;
				me.disabled = true;
				if ($scope.widget.registerForm.password.data !== $scope.widget.registerForm.confirm.data) {
					$message.show({
						title: "Error",
						text: $error(3),
						button: [{
							text: "OK",
							fn: function() {
								$message.hide();
								me.disabled = false;
							}
						}]
					})
					return 0;
				}

				$request.query({
					url: "./php/user",
					data: $formatData($scope.widget.registerForm, "register")
					}, loginSuccess(data), function() {
					me.disabled = false;
				})
			}
		}
	}
	// var checkPassword = function(pwd, cfm) {
	// 	if ()
	// }
}])