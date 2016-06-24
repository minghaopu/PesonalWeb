mpw.controller("login", ["$scope", "$user", "$message", function($scope, $user, $message) {
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
				$user.login($scope.widget.loginForm, function(data) {
					var apps = data.apps;
					for (var prop in apps) {
						$scope.$parent.apps[prop] = {
							name: prop,
							href: (prop === "email" ? "mailto:" : "") + apps[prop],
							src: "./img/icon/" + prop + ".png"
						}
					}
				}, function() {
					$message.show({
						title: "Login",
						text: "Login failed!",
						button: [{
							text: "OK",
							fn: function() {
								$message.hide();
								me.disabled = false;
							}
						}]
					})
				})
			}
		}
	}
	$scope.widget.registerForm = {
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
		confirm: {
			placeholder: "Confirm Your Password",
			name: "confirm",
			type: "password",
			data: ""
		},
		registerBtn: {
			text: "Sign Up",
			fn: function() {
				$user.register($scope.widget.registerForm);
			}
		}
	}
}])